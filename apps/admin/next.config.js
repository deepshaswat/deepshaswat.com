/** @type {import('next').NextConfig} */
require("dotenv").config({ path: "../../.env" });
module.exports = {
  // BlockNote/ProseMirror editable node views are incompatible with React
  // StrictMode: its double-mount tears down and recreates the node view, and on
  // the second mount getPos() returns undefined, so custom blocks (e.g. the
  // callout) throw "RangeError: Position undefined out of range" when a saved
  // post is reloaded into the editor. Disabling StrictMode is BlockNote's
  // documented workaround; it only affects dev-mode double-invocation.
  reactStrictMode: false,
  experimental: {
    optimizePackageImports: ["@repo/ui", "@repo/store", "@repo/actions"],
  },
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
