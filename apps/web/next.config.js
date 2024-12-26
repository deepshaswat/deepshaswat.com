/** @type {import('next').NextConfig} */
require("dotenv").config({ path: "../../.env" });
const withMDX = require("@next/mdx")({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});
module.exports = withMDX({
  reactStrictMode: true,
  transpilePackages: ["@repo/ui"],
  images: {
    domains: [
      "img.clerk.com",
      "blog-deepshaswat-readonly.s3.amazonaws.com",
      "images.unsplash.com",
      "assets.aceternity.com",
    ],
  },
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
});
