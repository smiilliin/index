import { generation } from "@/back/static";
import { NextApiRequest, NextApiResponse } from "next";
import { env } from "@/back/env";
import { serialize } from "cookie";
import en from "@/../public/api/strings/en.json";

interface IError {
  reason: keyof typeof en;
}
interface ITokenData {
  "refresh-token": string;
}

export default async (req: NextApiRequest, res: NextApiResponse<IError | ITokenData>) => {
  const tokenString = req.headers.authorization;
  const token = generation.verifyRefreshToken(tokenString);
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
      domain: env.cookie_domain,
      path: "/",
      secure: true,
    })
  );

  return res.status(200).send({
    "refresh-token": updatedTokenString,
  });
};
