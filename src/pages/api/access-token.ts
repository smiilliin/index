import { generation } from "@/back/static";
import { serialize } from "cookie";
import { NextApiRequest, NextApiResponse } from "next";
import en from "@/../public/api/strings/en.json";
import { cookieDomain } from "@/front/static";

interface IError {
  reason: keyof typeof en;
}
interface ITokenData {
  "access-token": string;
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
      const accessToken = await generation.createAccessToken(token, 30);
      if (!accessToken) {
        return res.status(400).send({
          reason: "TOKEN_WRONG",
        });
      }
      const accessTokenString = generation.tokenToString(accessToken);

      res.setHeader(
        "Set-Cookie",
        serialize("access-token", accessTokenString, {
          httpOnly: true,
          domain: cookieDomain,
          path: "/",
          secure: true,
          expires: keepLoggedin ? new Date(accessToken.expires) : undefined,
          sameSite: "strict",
        })
      );
      return res.status(200).send({
        "access-token": accessTokenString,
      });
    }
    default: {
      return res.status(400).send({
        reason: "WRONG_ACCESS",
      });
    }
  }
};
