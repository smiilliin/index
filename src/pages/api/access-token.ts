import { env } from "@/back/env";
import { generation } from "@/back/static";
import { serialize } from "cookie";
import { NextApiRequest, NextApiResponse } from "next";
import en from "@/../public/api/strings/en.json";

interface IError {
  reason: keyof typeof en;
}
interface ITokenData {
  "access-token": string;
}

export default async (req: NextApiRequest, res: NextApiResponse<IError | ITokenData>) => {
  const tokenString = req.headers.authorization;
  const token = generation.verifyRefreshToken(tokenString);

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
      domain: env.cookie_domain,
      path: "/",
      secure: true,
    })
  );
  return res.status(200).send({
    "access-token": accessTokenString,
  });
};
