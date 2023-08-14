import { PoolConnection } from "mysql";
import { fromdb, query } from "./db";
import { pool } from "./static";
import { Rank, getRankFromBuffer } from "@/front/ranks";
import { andOperation, isEmpty } from "./bit";

interface IUserRankJoin {
  id: string;
  rank: Buffer | null;
}

interface IUser {
  id: string;
  rank: Rank | null;
}
const getUserListDB = async (
  connection: PoolConnection,
  page: number,
  pageSize: number
): Promise<Array<IUser>> => {
  const users = await query<IUserRankJoin>(
    connection,
    "SELECT user.id, userRank.rank FROM user LEFT JOIN userRank ON user.id = userRank.id UNION SELECT user.id, userRank.rank FROM user RIGHT JOIN userRank ON user.id = userRank.id LIMIT ? OFFSET ?;",
    [pageSize, page * pageSize]
  );
  const userList: Array<IUser> = users.map((v) => {
    const user: IUser = {
      id: v.id,
      rank: v.rank ? getRankFromBuffer(v.rank) : null,
    };
    return user;
  });

  return userList;
};

const getUserList = fromdb(pool, getUserListDB, new Array());

export { getUserListDB, getUserList };
export type { IUser };
