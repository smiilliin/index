/** @type {import('next').NextConfig} */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Dotenv = require("dotenv-webpack");

const nextConfig = {
  reactStrictMode: false,
  poweredByHeader: false,
  compiler: {
    styledComponents: true,
  },
  webpack: (config) => {
    config.plugins.push(new Dotenv({ silent: true }));
    return config;
  },
};

module.exports = nextConfig;
