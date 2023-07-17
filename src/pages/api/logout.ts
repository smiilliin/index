import { NextApiRequest, NextApiResponse } from "next";
import { env } from "@/back/env";
import { serialize } from "cookie";

interface INull {}

export default async (req: NextApiRequest, res: NextApiResponse<INull>) => {
  switch (req.method) {
    case "GET": {
      res.setHeader("Set-Cookie", [
        serialize("refresh-token", "", {
          httpOnly: true,
          expires: new Date(1),
          path: "/",
          domain: env.cookie_domain,
          secure: true,
        }),
        serialize("access-token", "", {
          httpOnly: true,
          expires: new Date(1),
          path: "/",
          domain: env.cookie_domain,
          secure: true,
        }),
      ]);

      return res.status(200).send({});
    }
    default: {
      return res.status(400).send({
        reason: "WRONG_ACCESS",
      });
    }
  }
};
