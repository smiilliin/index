import { Pool, PoolConnection } from "mysql";

const getConnection = (pool: Pool): Promise<PoolConnection> => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        connection?.release();
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
const fromdb = <T, I extends any[]>(
  pool: Pool,
  dbFun: (connection: PoolConnection, ...options: I) => Promise<T>,
  defaultResult?: T | ((err: any) => T)
): ((...options: I) => Promise<T>) => {
  return async (...options: I) => {
    let connection: PoolConnection | undefined;

    try {
      connection = await getConnection(pool);

      return await dbFun(connection, ...options);
    } catch (err) {
      // console.error(err);
      if (typeof defaultResult === "function")
        return (defaultResult as (err: any) => T)(err);
      return defaultResult as T;
    } finally {
      connection?.release();
    }
  };
};

export { getConnection, query, fromdb };
