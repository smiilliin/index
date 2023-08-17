import { generation, pool } from "@/back/static";
import { NextApiRequest, NextApiResponse } from "next";
import en from "@/../public/api/strings/en.json";
import { fromdb, query } from "@/back/db";
import { getRank, getRankDB, isAdminDB } from "@/back/rank";
import { IUser, getUserListDB } from "@/back/userList";

interface IError {
  reason: keyof typeof en;
}
interface IUserList {
  userList: Array<IUser>;
}
interface ISuccess {}

export default async (
  req: NextApiRequest,
  res: NextApiResponse<IError | IUserList | ISuccess>
) => {
  const accessToken = generation.verifyAccessToken(
    req.headers.authorization || req.cookies["access-token"]
  );
  if (!accessToken) {
    return res.status(400).send({
      reason: "TOKEN_WRONG",
    });
  }
  const { id } = accessToken;

  switch (req.method) {
    case "GET": {
      const getQuery = () => {
        const { page, pageSize } = req.query;
        return { page: Number(page), pageSize: Number(pageSize) };
      };
      const { page, pageSize } = getQuery();

      await fromdb(
        pool,
        async (connection) => {
          if (!(await isAdminDB(connection, id))) {
            return res.status(400).send({ reason: "NO_ACCESS" });
          }
          const userList = await getUserListDB(connection, page, pageSize);

          return res.status(200).send({ userList: userList });
        },
        () => {
          return res.status(400).send({
            reason: "UNKNOWN_ERROR",
          });
        }
      )();
      return;
    }
    default: {
      return res.status(400).send({
        reason: "WRONG_ACCESS",
      });
    }
  }
};
export type { IUser, IUserList };
