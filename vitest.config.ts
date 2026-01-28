import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./vitest.setup.tsx"],
    include: [
      "**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}",
      "**/tests/**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}",
    ],
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/.next/**",
      "**/coverage/**",
    ],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "**/*.d.ts",
        "**/*.config.*",
        "**/coverage/**",
        "**/.next/**",
        "**/dist/**",
      ],
    },
  },
  resolve: {
    alias: {
      "@repo/ui/utils": path.resolve(__dirname, "./packages/ui/lib/utils"),
      "@repo/ui/blocknote": path.resolve(__dirname, "./packages/ui/src/components/common/blocknote-editor"),
      "@repo/ui": path.resolve(__dirname, "./packages/ui/src"),
      "@repo/actions": path.resolve(__dirname, "./packages/actions/src"),
      "@repo/db/client": path.resolve(__dirname, "./packages/db/src/index.ts"),
      "@repo/db/redis": path.resolve(__dirname, "./packages/db/src/redis.ts"),
      "@repo/db": path.resolve(__dirname, "./packages/db"),
      "@repo/schema": path.resolve(__dirname, "./packages/schema/src"),
      "@repo/store": path.resolve(__dirname, "./packages/store/src"),
    },
  },
});
