import en from "@/../public/api/strings/en.json";
import { Pool, PoolConnection } from "mysql";

// let connection: PoolConnection | undefined;
// try {
//   connection = await getConnection(pool);
// } catch (err) {
//   console.error(err);
//   res.status(400).send({
//     reason: "UNKNOWN_ERROR",
//   });
// } finally {
//   connection?.release();
// }
const getConnection = (pool: Pool): Promise<PoolConnection> => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        return reject(err);
      }
      resolve(connection);
    });
  });
};
const query = <T>(
  connection: PoolConnection,
  q: string,
  values?: any
): Promise<Array<T>> => {
  return new Promise((resolve, reject) => {
    connection.query(q, values, (err, result: Array<T>) => {
      if (err) {
        return reject(err);
      }
      resolve(result);
    });
  });
};
export { getConnection, query };
