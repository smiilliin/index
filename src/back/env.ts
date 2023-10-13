const env = {
  db_host: process.env.DB_HOST as string,
  db_user: process.env.DB_USER as string,
  db_password: process.env.DB_PASSWORD as string,
  db_database: process.env.DB_DATABASE as string,
  recaptcha_key: process.env.RECAPTCHA_KEY as string,
};

for (const [key, value] of Object.entries(env)) {
  if (value === undefined || (typeof value == "number" && isNaN(value))) {
    throw new Error(`${key} not defined`);
  }
}

export { env };
