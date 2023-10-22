import { generation, idRegex, passwordRegex, pool } from "@/back/static";
import { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";
import { serialize } from "cookie";
import en from "@/../public/api/strings/en.json";
import { fromdb, query } from "@/back/db";
import { cookieDomain } from "@/front/static";

interface IError {
  reason: keyof typeof en;
}
interface ITokenData {
  "refresh-token": string;
}

interface IUserQuery {
  id: string;
  salt: Buffer;
  password: Buffer;
}

const sleep = async (ms: number) => {
  return new Promise<void>((resolve) => {
    setTimeout(() => resolve(), ms);
  });
};

export default async (
  req: NextApiRequest,
  res: NextApiResponse<IError | ITokenData>
) => {
  switch (req.method) {
    case "POST": {
      await sleep(1000);
      const { id, password, keepLoggedin } = req.body;

      if (!idRegex(id) || !passwordRegex(password)) {
        return res.status(400).send({
          reason: "ID_OR_PASSWORD_WRONG",
        });
      }

      await fromdb(
        pool,
        async (connection) => {
          const results = await query<IUserQuery>(
            connection,
            "SELECT * FROM user WHERE id=?",
            [id]
          );
          if (results.length == 0) {
            return res.status(400).send({
              reason: "ID_OR_PASSWORD_WRONG",
            });
          }
          const { salt, password: dbPassword } = results[0];

          const saltedPassword = Buffer.concat([
            salt,
            Buffer.from(password, "hex"),
          ]);
          let hashedPassword = crypto
            .createHash("sha256")
            .update(saltedPassword)
            .digest("binary");

          let passed = false;
          for (let i = 0; i < 20; i++) {
            if (dbPassword.equals(Buffer.from(hashedPassword, "binary"))) {
              passed = true;
              break;
            }

            hashedPassword = crypto
              .createHash("sha256")
              .update(Buffer.from(hashedPassword, "binary"))
              .digest("binary");
          }

          if (!passed) {
            return res.status(400).send({
              reason: "ID_OR_PASSWORD_WRONG",
            });
          }

          const refreshToken = await generation.createRefreshToken(id, 20);

          if (!refreshToken) {
            return res.status(400).send({
              reason: "UNKNOWN_ERROR",
            });
          }
          const refreshTokenString = generation.tokenToString(refreshToken);

          res.setHeader(
            "Set-Cookie",
            serialize("refresh-token", refreshTokenString, {
              httpOnly: true,
              domain: cookieDomain,
              path: "/",
              expires: keepLoggedin
                ? new Date(refreshToken.expires)
                : undefined,
              secure: true,
              sameSite: "lax",
            })
          );

          return res.status(200).send({
            "refresh-token": refreshTokenString,
          });
        },
        () => {
          res.status(400).send({
            reason: "UNKNOWN_ERROR",
          });
        }
      )();
      break;
    }
    default: {
      return res.status(400).send({
        reason: "WRONG_ACCESS",
      });
    }
  }
};
