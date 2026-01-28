/** @type {import('next').NextConfig} */
require("dotenv").config({ path: "../../.env" });
module.exports = {
  reactStrictMode: true,
  transpilePackages: [
    "@repo/ui",
    "@repo/store",
    "@repo/actions",
    "@repo/schema",
    "@repo/db",
    "@blocknote/core",
    "@blocknote/react",
    "@blocknote/mantine",
  ],
};
