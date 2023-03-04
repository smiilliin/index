const env = {
  recaptcha_public_key: process.env.RECAPTCHA_PUBLIC_KEY as string,
  auth_host: process.env.AUTH_HOST as string,
};

new Map(Object.entries(env)).forEach((value, key) => {
  if (value === undefined) {
    throw new Error(`${key} not defined`);
  }
});

export { env };
