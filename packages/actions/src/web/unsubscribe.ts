"use server";

import { verifyUnsubscribeToken } from "../common/unsubscribe-tokens";
import { unsubscribeMember } from "../admin/crud-member";

/**
 * Verify an unsubscribe token and unsubscribe the member if valid.
 * Used for one-click unsubscribe links in newsletter emails.
 */
export async function verifyAndUnsubscribe(
  email: string,
  token: string,
): Promise<{ success?: boolean; error?: string }> {
  if (!email || !token) {
    return { error: "Missing email or token" };
  }

  const isValid = verifyUnsubscribeToken(email, token);

  if (!isValid) {
    return { error: "Invalid or expired unsubscribe link" };
  }

  try {
    const result = await unsubscribeMember(email);

    if (result && "error" in result) {
      return { error: result.error as string };
    }

    return { success: true };
  } catch (error) {
    console.error("Error in verifyAndUnsubscribe:", error);
    return { error: "Failed to unsubscribe" };
  }
}
