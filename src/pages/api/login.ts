import { generation, idRegex, passwordRegex, pool } from "@/back/static";
import { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";
import { env } from "@/back/env";
import { serialize } from "cookie";

interface IError {
  reason: string;
}
interface ITokenData {
  "refresh-token": string;
}

interface IUserQuery {
  id: string;
  salt: Buffer;
  password: Buffer;
}

export default (req: NextApiRequest, res: NextApiResponse<IError | ITokenData>) => {
  const { id, password } = req.body;

  if (!idRegex(id) || !passwordRegex(password)) {
    return res.status(400).send({
      reason: "ID_OR_PASSWORD_WRONG",
    });
  }

  pool.getConnection((err, connection) => {
    if (err) {
      console.error(err);

      return res.status(400).send({
        reason: "UNKNOWN_ERROR",
      });
    }

    try {
      connection.query(`SELECT * FROM user WHERE id=?`, [id], async (err, results: Array<IUserQuery>) => {
        if (err) {
          return res.status(400).send({
            reason: "UNKNOWN_ERROR",
          });
        }

        if (results.length == 0) {
          return res.status(400).send({
            reason: "ID_OR_PASSWORD_WRONG",
          });
        }
        const { salt, password: dbPassword } = results[0];

        const saltedPassword = Buffer.concat([salt, Buffer.from(password, "hex")]);
        const hashedPassword = crypto.createHash("sha256").update(saltedPassword).digest("hex");

        if (dbPassword.equals(Buffer.from(hashedPassword, "hex"))) {
          const refreshToken = await generation.createRefreshToken(id, 20);

          if (refreshToken) {
            const refreshTokenString = generation.tokenToString(refreshToken);

            res.setHeader(
              "Set-Cookie",
              serialize("refresh-token", refreshTokenString, {
                httpOnly: true,
                domain: env.cookie_domain,
                path: "/",
                secure: true,
              })
            );

            return res.status(200).send({
              "refresh-token": refreshTokenString,
            });
          }

          return res.status(400).send({
            reason: "UNKNOWN_ERROR",
          });
        }

        return res.status(400).send({
          reason: "ID_OR_PASSWORD_WRONG",
        });
      });
    } finally {
      connection.release();
    }
  });
};
