import { generation, idRegex, passwordRegex, pool } from "@/back/static";
import { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";
import { env } from "@/back/env";
import { serialize } from "cookie";
import { checkRecaptcha } from "@/back/recaptcha";

interface IError {
  reason: string;
}
interface ITokenData {
  "refresh-token": string;
}

export default async (req: NextApiRequest, res: NextApiResponse<IError | ITokenData>) => {
  const { id, password, g_response } = req.body;
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

  pool.getConnection((err, connection) => {
    if (err) {
      console.error(err);

      return res.status(400).send({
        reason: "UNKNOWN_ERROR",
      });
    }

    try {
      const salt = crypto.randomBytes(8);
      const saltedPassword = Buffer.concat([salt, Buffer.from(password, "hex")]);
      const hashedPassword = crypto.createHash("sha256").update(saltedPassword).digest("hex");

      connection.query(
        `INSERT INTO user VALUES(?, ?, ?);`,
        [id, salt, Buffer.from(hashedPassword, "hex")],
        async (err) => {
          if (err) {
            return res.status(400).send({
              reason: "ID_DUPLICATE",
            });
          }
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
      );
    } finally {
      connection.release();
    }
  });
};
