import { PoolConnection } from "mysql";
import { getConnection, query } from "./db";
import { pool } from "./static";

interface IRankQuery {
  rank: Buffer;
}

const getRankDB = async (
  connection: PoolConnection,
  id: string
): Promise<Buffer> => {
  const result = await query<IRankQuery>(
    connection,
    "SELECT rank FROM userRank WHERE id=?",
    [id]
  );
  if (result.length == 0) return Buffer.from([0x00]);
  return result[0].rank;
};
const getRank = async (id: string): Promise<Buffer | undefined> => {
  let connection: PoolConnection | undefined;

  try {
    connection = await getConnection(pool);

    const rank = await getRankDB(connection, id);
    return rank;
  } catch (err) {
    console.error(err);
  } finally {
    connection?.release();
  }
};

export { getRank, getRankDB };
