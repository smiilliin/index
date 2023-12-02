import fs from "fs";
import { env } from "./env";
import TokenGeneration from "token-generation";
import mysql, { Pool } from "mysql";

let hmacKey: Buffer;
let pool: Pool;

const newPool = (): Pool => {
  return mysql.createPool({
    host: env.db_host,
    user: env.db_user,
    password: env.db_password,
    database: env.db_database,
  });
};
const newHmacKey = (): Buffer => {
  return Buffer.from(fs.readFileSync("../hmacKey").toString(), "hex");
};

if (process.env.NODE_ENV === "production") {
  pool = newPool();
  hmacKey = newHmacKey();
  global.pool = pool;
  global.hmacKey = hmacKey;
} else {
  if (!global.pool) {
    pool = newPool();
    global.pool = pool;
  } else {
    pool = global.pool;
  }

  if (!global.hmacKey) {
    hmacKey = newHmacKey();
    global.hmacKey = hmacKey;
  } else {
    hmacKey = global.hmacKey;
  }
}

const generation = new TokenGeneration(pool, hmacKey);

const idRegex = (id: string) => {
  return typeof id === "string" && /^[a-z0-9]{4,20}$/.test(id);
};
const passwordRegex = (password: string) => {
  return (
    typeof password === "string" &&
    /^[a-fA-F0-9]{64}$|^0x[a-fA-F0-9]{64}$/.test(password)
  );
};

const REQLIMIT = 500;

export { pool, generation, idRegex, passwordRegex, REQLIMIT };
