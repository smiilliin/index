import { generation, idRegex, passwordRegex, pool } from "@/back/static";
import { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";
import { serialize } from "cookie";
import { checkRecaptcha } from "@/back/recaptcha";
import en from "@/../public/api/strings/en.json";
import { fromdb, query } from "@/back/db";
import { cookieDomain } from "@/front/static";

interface IError {
  reason: keyof typeof en;
}
interface ITokenData {
  "refresh-token": string;
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
      const { id, password, g_response, keepLoggedin } = req.body;
      if (!(await checkRecaptcha(g_response))) {
        return res.status(400).send({
          reason: "RECAPTCHA_WRONG",
        });
      }

      if (!idRegex(id) || !passwordRegex(password)) {
        return res.status(400).send({
          reason: "ID_OR_PASSWORD_WRONG",
        });
      }

      await fromdb(
        pool,
        async (connection) => {
          const salt = crypto.randomBytes(8);
          const saltedPassword = Buffer.concat([
            salt,
            Buffer.from(password, "hex"),
          ]);
          const repeat = Math.floor(Math.random() * 19 + 2); //2 ~ 20
          let hashedPassword = crypto
            .createHash("sha256")
            .update(saltedPassword)
            .digest("binary");

          for (let i = 0; i < repeat; i++) {
            hashedPassword = crypto
              .createHash("sha256")
              .update(Buffer.from(hashedPassword, "binary"))
              .digest("binary");
          }

          if (
            (await query(connection, "SELECT id FROM user WHERE id=?", [id]))
              .length != 0
          ) {
            return res.status(400).send({
              reason: "ID_DUPLICATE",
            });
          }

          await query(connection, "INSERT INTO user VALUES(?, ?, ?)", [
            id,
            salt,
            Buffer.from(hashedPassword, "binary"),
          ]);

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
              secure: true,
              expires: keepLoggedin
                ? new Date(refreshToken.expires)
                : undefined,
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
