import { generation, idRegex, passwordRegex, pool } from "@/back/static";
import { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";
import { env } from "@/back/env";
import { serialize } from "cookie";
import en from "@/../public/api/strings/en.json";
import { getConnection, query } from "@/back/db";
import { PoolConnection } from "mysql";

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

      let connection: PoolConnection | undefined;
      try {
        connection = await getConnection(pool);
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
        const hashedPassword = crypto
          .createHash("sha256")
          .update(saltedPassword)
          .digest("hex");

        if (!dbPassword.equals(Buffer.from(hashedPassword, "hex"))) {
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
            domain: env.cookie_domain,
            path: "/",
            expires: keepLoggedin ? new Date(refreshToken.expires) : undefined,
            secure: true,
          })
        );

        return res.status(200).send({
          "refresh-token": refreshTokenString,
        });
      } catch (err) {
        console.error(err);
        res.status(400).send({
          reason: "UNKNOWN_ERROR",
        });
      } finally {
        connection?.release();
      }
      break;
    }
    default: {
      return res.status(400).send({
        reason: "WRONG_ACCESS",
      });
    }
  }
};
