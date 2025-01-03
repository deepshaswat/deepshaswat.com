/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_APP_URL || "https://deepshaswat.com",
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  outDir: "./public",
};
