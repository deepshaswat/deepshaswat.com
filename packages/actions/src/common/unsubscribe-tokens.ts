/**
 * HMAC-SHA256 unsubscribe token generation and verification.
 * Tokens are derived from email + secret — no database lookup needed.
 * Uses timing-safe comparison to prevent timing attacks.
 */

import { createHmac, timingSafeEqual } from "crypto";
import { UNSUBSCRIBE_SECRET } from "./email-config";

/**
 * Generate an HMAC-SHA256 unsubscribe token for an email address.
 */
export function generateUnsubscribeToken(email: string): string {
  if (!UNSUBSCRIBE_SECRET) {
    throw new Error("EMAIL_UNSUBSCRIBE_SECRET is not configured");
  }
  return createHmac("sha256", UNSUBSCRIBE_SECRET)
    .update(email.toLowerCase().trim())
    .digest("hex");
}

/**
 * Verify an HMAC-SHA256 unsubscribe token.
 * Uses timing-safe comparison to prevent timing attacks.
 */
export function verifyUnsubscribeToken(email: string, token: string): boolean {
  if (!UNSUBSCRIBE_SECRET) {
    return false;
  }
  try {
    const expected = generateUnsubscribeToken(email);
    const tokenBuf = Buffer.from(token, "hex");
    const expectedBuf = Buffer.from(expected, "hex");
    if (tokenBuf.length !== expectedBuf.length) {
      return false;
    }
    return timingSafeEqual(tokenBuf, expectedBuf);
  } catch {
    return false;
  }
}
