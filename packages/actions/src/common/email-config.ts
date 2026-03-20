/**
 * Centralized email configuration constants.
 * Replaces hardcoded strings scattered across resend.ts and email templates.
 */

export const EMAIL_FROM = "Shaswat Deep <contact@mail.deepshaswat.com>";
export const EMAIL_REPLY_TO = "hi@deepshaswat.com";
export const APP_URL = "https://deepshaswat.com";
export const UNSUBSCRIBE_URL = `${APP_URL}/unsubscribe`;
export const UNSUBSCRIBE_SECRET = process.env.EMAIL_UNSUBSCRIBE_SECRET || "";
