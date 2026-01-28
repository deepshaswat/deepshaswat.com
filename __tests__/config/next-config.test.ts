import { describe, it, expect } from "vitest";
import path from "path";
import fs from "fs";

/**
 * Configuration tests to ensure Next.js apps are properly configured
 * These tests help catch issues like missing transpilePackages that
 * cause runtime errors like "Cannot find module './vendor-chunks/@blocknote.js'"
 */
describe("Next.js Configuration Tests", () => {
  const appsDir = path.resolve(__dirname, "../../apps");
  const packagesDir = path.resolve(__dirname, "../../packages");

  describe("Admin App Configuration", () => {
    const adminConfigPath = path.join(appsDir, "admin/next.config.js");

    it("should have next.config.js file", () => {
      expect(fs.existsSync(adminConfigPath)).toBe(true);
    });

    it("should include all required monorepo packages in transpilePackages", () => {
      const configContent = fs.readFileSync(adminConfigPath, "utf-8");

      // Required internal packages
      const requiredPackages = [
        "@repo/ui",
        "@repo/store",
        "@repo/actions",
        "@repo/schema",
        "@repo/db",
      ];

      requiredPackages.forEach((pkg) => {
        expect(configContent).toContain(pkg);
      });
    });

    it("should include BlockNote packages in transpilePackages (required for editor)", () => {
      const configContent = fs.readFileSync(adminConfigPath, "utf-8");

      // BlockNote packages required for the editor functionality
      const blocknotePackages = [
        "@blocknote/core",
        "@blocknote/react",
        "@blocknote/mantine",
      ];

      blocknotePackages.forEach((pkg) => {
        expect(
          configContent.includes(pkg),
          `Admin app should include ${pkg} in transpilePackages for editor functionality`
        ).toBe(true);
      });
    });

    it("should have transpilePackages array defined", () => {
      const configContent = fs.readFileSync(adminConfigPath, "utf-8");
      expect(configContent).toContain("transpilePackages");
    });
  });

  describe("Web App Configuration", () => {
    const webConfigPath = path.join(appsDir, "web/next.config.js");

    it("should have next.config.js file", () => {
      expect(fs.existsSync(webConfigPath)).toBe(true);
    });

    it("should include all required monorepo packages in transpilePackages", () => {
      const configContent = fs.readFileSync(webConfigPath, "utf-8");

      const requiredPackages = [
        "@repo/ui",
        "@repo/store",
        "@repo/actions",
        "@repo/schema",
        "@repo/db",
      ];

      requiredPackages.forEach((pkg) => {
        expect(configContent).toContain(pkg);
      });
    });

    it("should have transpilePackages array defined", () => {
      const configContent = fs.readFileSync(webConfigPath, "utf-8");
      expect(configContent).toContain("transpilePackages");
    });
  });

  describe("Package Dependencies Consistency", () => {
    it("admin app package.json should have BlockNote dependencies", () => {
      const adminPackageJson = JSON.parse(
        fs.readFileSync(path.join(appsDir, "admin/package.json"), "utf-8")
      );

      const requiredDeps = [
        "@blocknote/core",
        "@blocknote/react",
        "@blocknote/mantine",
      ];

      requiredDeps.forEach((dep) => {
        expect(
          adminPackageJson.dependencies[dep] || adminPackageJson.devDependencies?.[dep],
          `Admin app should have ${dep} as a dependency`
        ).toBeDefined();
      });
    });

    it("admin app should have @repo/ui dependency", () => {
      const adminPackageJson = JSON.parse(
        fs.readFileSync(path.join(appsDir, "admin/package.json"), "utf-8")
      );

      expect(adminPackageJson.dependencies["@repo/ui"]).toBeDefined();
    });

    it("web app should have @repo/ui dependency", () => {
      const webPackageJson = JSON.parse(
        fs.readFileSync(path.join(appsDir, "web/package.json"), "utf-8")
      );

      expect(webPackageJson.dependencies["@repo/ui"]).toBeDefined();
    });
  });

  describe("Turbo Configuration", () => {
    const turboConfigPath = path.resolve(__dirname, "../../turbo.json");

    it("should have turbo.json file", () => {
      expect(fs.existsSync(turboConfigPath)).toBe(true);
    });

    it("should have build task configured", () => {
      const turboConfig = JSON.parse(fs.readFileSync(turboConfigPath, "utf-8"));

      expect(turboConfig.tasks).toBeDefined();
      expect(turboConfig.tasks.build).toBeDefined();
    });

    it("should have required environment variables in build task", () => {
      const turboConfig = JSON.parse(fs.readFileSync(turboConfigPath, "utf-8"));

      const requiredEnvVars = [
        "AWS_REGION",
        "AWS_ACCESS_KEY_ID",
        "AWS_SECRET_ACCESS_KEY",
        "AWS_S3_BUCKET_NAME",
        "GCP_PROJECT_ID",
        "GCP_LOCATION",
      ];

      const buildEnv = turboConfig.tasks.build.env || [];

      requiredEnvVars.forEach((envVar) => {
        expect(
          buildEnv.includes(envVar),
          `turbo.json should include ${envVar} in build.env`
        ).toBe(true);
      });
    });
  });

  describe("UI Package Exports", () => {
    const uiIndexPath = path.join(packagesDir, "ui/src/index.ts");

    it("should have index.ts file in UI package", () => {
      expect(fs.existsSync(uiIndexPath)).toBe(true);
    });

    it("should export sidebar components", () => {
      const indexContent = fs.readFileSync(uiIndexPath, "utf-8");

      expect(indexContent).toContain("sidebar");
    });

    it("should export collapsible component", () => {
      const indexContent = fs.readFileSync(uiIndexPath, "utf-8");

      expect(indexContent).toContain("collapsible");
    });
  });

  describe("Ideas Feature Files", () => {
    const ideasComponentsDir = path.join(
      appsDir,
      "admin/app/(auth)/_components/ideas"
    );
    const ideasPagesDir = path.join(appsDir, "admin/app/(auth)/(ideas)/ideas");

    it("should have ideas components directory", () => {
      expect(fs.existsSync(ideasComponentsDir)).toBe(true);
    });

    it("should have required ideas component files", () => {
      const requiredFiles = [
        "ideas-component.tsx",
        "idea-card.tsx",
        "idea-detail.tsx",
        "new-idea-form.tsx",
        "ai-generate-dialog.tsx",
        "outline-editor.tsx",
      ];

      requiredFiles.forEach((file) => {
        const filePath = path.join(ideasComponentsDir, file);
        expect(
          fs.existsSync(filePath),
          `Ideas component ${file} should exist`
        ).toBe(true);
      });
    });

    it("should have AI-related dialog components", () => {
      const aiDialogs = [
        "trending-topics-dialog.tsx",
        "topic-suggestions-dialog.tsx",
        "script-generation-dialog.tsx",
        "image-generation-dialog.tsx",
      ];

      aiDialogs.forEach((file) => {
        const filePath = path.join(ideasComponentsDir, file);
        expect(
          fs.existsSync(filePath),
          `AI dialog ${file} should exist`
        ).toBe(true);
      });
    });

    it("should have ideas pages directory", () => {
      expect(fs.existsSync(ideasPagesDir)).toBe(true);
    });

    it("should have ideas page.tsx", () => {
      const pageFile = path.join(ideasPagesDir, "page.tsx");
      expect(fs.existsSync(pageFile)).toBe(true);
    });

    it("should have ideas [id] dynamic route", () => {
      const dynamicRouteDir = path.join(ideasPagesDir, "[id]");
      expect(fs.existsSync(dynamicRouteDir)).toBe(true);

      const pageFile = path.join(dynamicRouteDir, "page.tsx");
      expect(fs.existsSync(pageFile)).toBe(true);
    });
  });

  describe("API Routes for AI Features", () => {
    const apiDir = path.join(appsDir, "admin/app/api/ai");

    it("should have AI API directory", () => {
      expect(fs.existsSync(apiDir)).toBe(true);
    });

    it("should have required AI API routes", () => {
      const requiredRoutes = [
        "generate-ideas",
        "generate-outline",
        "generate-script",
        "generate-image",
        "suggest-topics",
        "trending-topics",
      ];

      requiredRoutes.forEach((route) => {
        const routeDir = path.join(apiDir, route);
        const routeFile = path.join(routeDir, "route.ts");
        expect(
          fs.existsSync(routeFile),
          `API route /api/ai/${route} should exist`
        ).toBe(true);
      });
    });
  });

  describe("Actions Package", () => {
    const actionsDir = path.join(packagesDir, "actions/src/admin");

    it("should have crud-ideas.ts file", () => {
      const crudIdeasFile = path.join(actionsDir, "crud-ideas.ts");
      expect(fs.existsSync(crudIdeasFile)).toBe(true);
    });

    it("should export idea-related functions from actions package", () => {
      const crudIdeasContent = fs.readFileSync(
        path.join(actionsDir, "crud-ideas.ts"),
        "utf-8"
      );

      const requiredExports = [
        "createIdea",
        "fetchIdeas",
        "fetchIdeaById",
        "updateIdea",
        "deleteIdea",
        "convertIdeaToDraft",
        "fetchIdeasCount",
      ];

      requiredExports.forEach((exportName) => {
        expect(
          crudIdeasContent.includes(`export async function ${exportName}`) ||
            crudIdeasContent.includes(`export function ${exportName}`),
          `crud-ideas.ts should export ${exportName}`
        ).toBe(true);
      });
    });
  });
});
