import fs from "fs";
import { env } from "./env";
import TokenGeneration from "token-generation";
import mysql from "mysql";

const hmacKey = Buffer.from(fs.readFileSync("../hmacKey").toString(), "hex"); //HMAC KEY

const dbConfig = {
  host: env.db_host,
  user: env.db_user,
  password: env.db_password,
  database: env.db_database,
};
const pool = mysql.createPool(dbConfig);

const generation = new TokenGeneration(dbConfig, hmacKey);

const idRegex = (id: string) => {
  return typeof id === "string" && /^[a-z0-9]{4,20}$/.test(id);
};
const passwordRegex = (password: string) => {
  return typeof password === "string" && /^[a-fA-F0-9]{64}$|^0x[a-fA-F0-9]{64}$/.test(password);
};

const REQLIMIT = 500;

export { pool, generation, idRegex, passwordRegex, REQLIMIT };
