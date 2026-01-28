import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { Webhook } from "svix";
import type { ResendWebhookEvent } from "@repo/actions";
import { processEmailEvent } from "@repo/actions";

const webhookSecret = process.env.RESEND_WEBHOOK_SECRET;

export async function POST(request: NextRequest): Promise<NextResponse> {
  // Verify webhook secret is configured
  if (!webhookSecret) {
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 },
    );
  }

  try {
    // Get the raw body for signature verification
    const body = await request.text();

    // Get Svix headers for verification
    const svixId = request.headers.get("svix-id");
    const svixTimestamp = request.headers.get("svix-timestamp");
    const svixSignature = request.headers.get("svix-signature");

    // Validate required headers
    if (!svixId || !svixTimestamp || !svixSignature) {
      return NextResponse.json(
        { error: "Missing required headers" },
        { status: 400 },
      );
    }

    // Verify webhook signature using Svix
    const wh = new Webhook(webhookSecret);

    let payload: ResendWebhookEvent;
    try {
      payload = wh.verify(body, {
        "svix-id": svixId,
        "svix-timestamp": svixTimestamp,
        "svix-signature": svixSignature,
      }) as ResendWebhookEvent;
    } catch (_err) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // Extract event type from payload
    const eventType = payload.type;

    // Process the event
    const result = await processEmailEvent(svixId, eventType, payload);

    if (!result.success) {
      // Return 200 anyway to prevent Resend from retrying
      // Log for debugging but acknowledge receipt
      return NextResponse.json({ received: true, warning: result.error });
    }

    return NextResponse.json({ received: true });
  } catch (_error) {
    // Return 500 to trigger retry for transient errors
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// Only allow POST requests
export function GET(): NextResponse {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
