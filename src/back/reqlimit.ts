import { getConnection, query } from "./db";
import { Pool, PoolConnection } from "mysql";
import { REQLIMIT } from "./static";

interface IDBReqlimit {
  req: number;
}

export default async (
  pool: Pool,
  id: string,
  req: number = 1
): Promise<boolean> => {
  let connection: PoolConnection | undefined;
  try {
    connection = await getConnection(pool);

    const reqlimit = (
      await query<IDBReqlimit>(
        connection,
        "SELECT req FROM reqlimit WHERE id=?",
        [id]
      )
    )[0];

    try {
      if (!reqlimit) return true;

      if (reqlimit.req < REQLIMIT) return true;
      return false;
    } finally {
      query(
        connection,
        "INSERT INTO reqlimit (id, req) VALUES(?, ?) ON DUPLICATE KEY UPDATE req=req + ?;",
        [id, req, req]
      );
    }
  } catch (err) {
    console.error(err);
    return false;
  } finally {
    connection?.release();
  }
};
