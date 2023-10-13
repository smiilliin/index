import { generation } from "@/back/static";
import { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";
import en from "@/../public/api/strings/en.json";
import { cookieDomain } from "@/front/static";

interface IError {
  reason: keyof typeof en;
}
interface ITokenData {
  "refresh-token": string;
}

export default async (
  req: NextApiRequest,
  res: NextApiResponse<IError | ITokenData>
) => {
  switch (req.method) {
    case "GET": {
      const tokenString =
        req.headers.authorization || req.cookies["refresh-token"];
      const token = generation.verifyRefreshToken(tokenString);
      const { keepLoggedin } = req.query;

      if (!token) {
        return res.status(400).send({
          reason: "TOKEN_WRONG",
        });
      }
      const updatedToken = await generation.updateRefreshToken(token, 20);

      if (!updatedToken) {
        return res.status(400).send({
          reason: "TOKEN_WRONG",
        });
      }

      const updatedTokenString = generation.tokenToString(updatedToken);

      res.setHeader(
        "Set-Cookie",
        serialize("refresh-token", updatedTokenString, {
          httpOnly: true,
          domain: cookieDomain,
          path: "/",
          secure: true,
          expires: keepLoggedin ? new Date(updatedToken.expires) : undefined,
          sameSite: "strict",
        })
      );

      return res.status(200).send({
        "refresh-token": updatedTokenString,
      });
    }
    default: {
      return res.status(400).send({
        reason: "WRONG_ACCESS",
      });
    }
  }
};
