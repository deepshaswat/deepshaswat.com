/** @type {import('next').NextConfig} */
require("dotenv").config({ path: "../../.env" });
module.exports = {
  reactStrictMode: true,
  transpilePackages: ["@repo/ui"],
  images: {
    domains: ["img.clerk.com", "blog-deepshaswat-readonly.s3.amazonaws.com"],
  },
};
