import { Page } from "@playwright/test";

/**
 * Authentication fixtures for E2E tests
 */

export interface AuthConfig {
  email: string;
  password: string;
}

// Test credentials (should be configured via environment variables in CI)
export const testAdminCredentials: AuthConfig = {
  email: process.env.E2E_ADMIN_EMAIL || "admin@example.com",
  password: process.env.E2E_ADMIN_PASSWORD || "testpassword",
};

/**
 * Login to admin panel via Clerk
 * Note: In CI, you may need to use Clerk's test mode or mock authentication
 */
export async function loginAsAdmin(page: Page): Promise<void> {
  await page.goto("/sign-in");

  // Wait for Clerk to load
  await page.waitForSelector('[data-testid="clerk-sign-in"]', {
    timeout: 10000,
  }).catch(() => {
    // If Clerk test ID not found, try alternative selectors
    return page.waitForSelector('input[name="identifier"]', { timeout: 10000 });
  });

  // Enter email
  await page.fill('input[name="identifier"]', testAdminCredentials.email);
  await page.click('button[type="submit"]');

  // Wait for password field
  await page.waitForSelector('input[name="password"]', { timeout: 10000 });
  await page.fill('input[name="password"]', testAdminCredentials.password);
  await page.click('button[type="submit"]');

  // Wait for redirect to dashboard
  await page.waitForURL(/\/(dashboard|$)/, { timeout: 30000 });
}

/**
 * Check if currently logged in
 */
export async function isLoggedIn(page: Page): Promise<boolean> {
  const userButton = await page.$('[data-testid="clerk-user-button"]');
  return userButton !== null;
}

/**
 * Logout from admin panel
 */
export async function logout(page: Page): Promise<void> {
  // Click user button to open menu
  await page.click('[data-testid="clerk-user-button"]');

  // Click sign out button
  await page.click('button:has-text("Sign out")');

  // Wait for redirect to sign-in
  await page.waitForURL(/sign-in/);
}
