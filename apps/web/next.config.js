/** @type {import('next').NextConfig} */
require("dotenv").config({ path: "../../.env" });
module.exports = {
  reactStrictMode: true,
  transpilePackages: ["@repo/ui"],
};
