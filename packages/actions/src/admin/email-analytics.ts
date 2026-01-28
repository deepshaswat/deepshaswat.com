"use server";

import prisma from "@repo/db/client";

export interface ResendWebhookEvent {
  type: string;
  created_at: string;
  data: {
    email_id: string;
    from: string;
    to: string[];
    subject: string;
    created_at?: string;
    click?: {
      link: string;
      timestamp: string;
    };
  };
}

export interface EmailAnalyticsOverview {
  totalSent: number;
  totalDelivered: number;
  totalOpened: number;
  totalClicked: number;
  totalBounced: number;
  deliveryRate: number;
  openRate: number;
  clickRate: number;
  bounceRate: number;
}

export interface NewsletterPerformance {
  postId: string;
  postTitle: string;
  sentAt: Date;
  totalSent: number;
  delivered: number;
  opened: number;
  uniqueOpens: number;
  clicked: number;
  bounced: number;
  deliveryRate: number;
  openRate: number;
  clickRate: number;
}

/**
 * Process incoming email event with idempotency check
 */
export async function processEmailEvent(
  eventId: string,
  eventType: string,
  payload: ResendWebhookEvent,
): Promise<{ success: boolean; error?: string }> {
  try {
    // Idempotency check - see if we've already processed this event
    const existingEvent = await prisma.emailEvent.findUnique({
      where: { eventId },
    });

    if (existingEvent) {
      return { success: true }; // Already processed
    }

    // Find the EmailSend record by resendEmailId
    const emailSend = await prisma.emailSend.findUnique({
      where: { resendEmailId: payload.data.email_id },
    });

    if (!emailSend) {
      // Store event anyway for debugging, but return error
      console.warn(
        `EmailSend not found for email_id: ${payload.data.email_id}`,
      );
      return { success: false, error: "EmailSend record not found" };
    }

    // Route to appropriate handler based on event type
    switch (eventType) {
      case "email.delivered":
        await handleEmailDelivered(emailSend.id, payload, eventId);
        break;
      case "email.opened":
        await handleEmailOpened(emailSend.id, payload, eventId);
        break;
      case "email.clicked":
        await handleEmailClicked(emailSend.id, payload, eventId);
        break;
      case "email.bounced":
        await handleEmailBounced(emailSend.id, payload, eventId);
        break;
      case "email.complained":
        await handleEmailComplained(emailSend.id, payload, eventId);
        break;
      default:
        // Store unknown event types for debugging
        await prisma.emailEvent.create({
          data: {
            emailSendId: emailSend.id,
            eventType,
            eventId,
            recipientEmail: payload.data.to?.[0],
            rawPayload: JSON.stringify(payload),
          },
        });
    }

    return { success: true };
  } catch (error) {
    console.error("Error processing email event:", error);
    return { success: false, error: "Failed to process event" };
  }
}

/**
 * Handle email delivered event
 */
async function handleEmailDelivered(
  emailSendId: string,
  payload: ResendWebhookEvent,
  eventId: string,
) {
  const recipientEmail = payload.data.to?.[0];

  await prisma.$transaction(async (tx) => {
    // Create event record
    await tx.emailEvent.create({
      data: {
        emailSendId,
        eventType: "email.delivered",
        eventId,
        recipientEmail,
        rawPayload: JSON.stringify(payload),
      },
    });

    // Update EmailSend status
    await tx.emailSend.update({
      where: { id: emailSendId },
      data: {
        status: "DELIVERED",
        deliveredAt: new Date(payload.created_at),
        lastEventAt: new Date(payload.created_at),
      },
    });

    // Update or create EmailRecipient
    if (recipientEmail) {
      await tx.emailRecipient.upsert({
        where: {
          emailSendId_email: {
            emailSendId,
            email: recipientEmail,
          },
        },
        update: {
          delivered: true,
        },
        create: {
          emailSendId,
          email: recipientEmail,
          delivered: true,
        },
      });

      // Update member's received count
      const member = await tx.member.findUnique({
        where: { email: recipientEmail },
      });
      if (member) {
        await tx.member.update({
          where: { id: member.id },
          data: {
            totalEmailsReceived: { increment: 1 },
          },
        });

        // Link recipient to member
        await tx.emailRecipient.update({
          where: {
            emailSendId_email: {
              emailSendId,
              email: recipientEmail,
            },
          },
          data: {
            memberId: member.id,
          },
        });
      }
    }

    // Update Post stats if linked
    const emailSend = await tx.emailSend.findUnique({
      where: { id: emailSendId },
      select: { postId: true },
    });
    if (emailSend?.postId) {
      await tx.post.update({
        where: { id: emailSend.postId },
        data: {
          emailsDelivered: { increment: 1 },
        },
      });
    }
  });
}

/**
 * Handle email opened event
 */
async function handleEmailOpened(
  emailSendId: string,
  payload: ResendWebhookEvent,
  eventId: string,
) {
  const recipientEmail = payload.data.to?.[0];
  const openedAt = new Date(payload.created_at);

  await prisma.$transaction(async (tx) => {
    // Create event record
    await tx.emailEvent.create({
      data: {
        emailSendId,
        eventType: "email.opened",
        eventId,
        recipientEmail,
        rawPayload: JSON.stringify(payload),
      },
    });

    // Update EmailSend status (only if not already clicked)
    const currentSend = await tx.emailSend.findUnique({
      where: { id: emailSendId },
      select: { status: true, openedAt: true },
    });

    if (currentSend?.status !== "CLICKED") {
      await tx.emailSend.update({
        where: { id: emailSendId },
        data: {
          status: "OPENED",
          openedAt: currentSend?.openedAt || openedAt,
          lastEventAt: openedAt,
        },
      });
    }

    // Update EmailRecipient
    if (recipientEmail) {
      const recipient = await tx.emailRecipient.findUnique({
        where: {
          emailSendId_email: {
            emailSendId,
            email: recipientEmail,
          },
        },
      });

      const isFirstOpen = !recipient?.opened;

      await tx.emailRecipient.upsert({
        where: {
          emailSendId_email: {
            emailSendId,
            email: recipientEmail,
          },
        },
        update: {
          opened: true,
          openCount: { increment: 1 },
          firstOpenedAt: recipient?.firstOpenedAt || openedAt,
          lastOpenedAt: openedAt,
        },
        create: {
          emailSendId,
          email: recipientEmail,
          opened: true,
          openCount: 1,
          firstOpenedAt: openedAt,
          lastOpenedAt: openedAt,
        },
      });

      // Update member stats
      const member = await tx.member.findUnique({
        where: { email: recipientEmail },
      });
      if (member) {
        await tx.member.update({
          where: { id: member.id },
          data: {
            totalEmailsOpened: { increment: 1 },
            lastEmailOpenedAt: openedAt,
          },
        });
      }

      // Update Post stats
      const emailSend = await tx.emailSend.findUnique({
        where: { id: emailSendId },
        select: { postId: true },
      });
      if (emailSend?.postId) {
        await tx.post.update({
          where: { id: emailSend.postId },
          data: {
            emailsOpened: { increment: 1 },
            uniqueOpens: isFirstOpen ? { increment: 1 } : undefined,
          },
        });
      }
    }
  });
}

/**
 * Handle email clicked event
 */
async function handleEmailClicked(
  emailSendId: string,
  payload: ResendWebhookEvent,
  eventId: string,
) {
  const recipientEmail = payload.data.to?.[0];
  const linkUrl = payload.data.click?.link;
  const clickedAt = new Date(payload.created_at);

  await prisma.$transaction(async (tx) => {
    // Create event record
    await tx.emailEvent.create({
      data: {
        emailSendId,
        eventType: "email.clicked",
        eventId,
        recipientEmail,
        linkUrl,
        rawPayload: JSON.stringify(payload),
      },
    });

    // Update EmailSend status
    await tx.emailSend.update({
      where: { id: emailSendId },
      data: {
        status: "CLICKED",
        clickedAt: clickedAt,
        lastEventAt: clickedAt,
      },
    });

    // Update EmailRecipient
    if (recipientEmail) {
      await tx.emailRecipient.upsert({
        where: {
          emailSendId_email: {
            emailSendId,
            email: recipientEmail,
          },
        },
        update: {
          clicked: true,
          clickCount: { increment: 1 },
        },
        create: {
          emailSendId,
          email: recipientEmail,
          clicked: true,
          clickCount: 1,
        },
      });

      // Update member stats
      const member = await tx.member.findUnique({
        where: { email: recipientEmail },
      });
      if (member) {
        await tx.member.update({
          where: { id: member.id },
          data: {
            totalEmailsClicked: { increment: 1 },
          },
        });
      }
    }
  });
}

/**
 * Handle email bounced event
 */
async function handleEmailBounced(
  emailSendId: string,
  payload: ResendWebhookEvent,
  eventId: string,
) {
  const recipientEmail = payload.data.to?.[0];
  const bouncedAt = new Date(payload.created_at);

  await prisma.$transaction(async (tx) => {
    // Create event record
    await tx.emailEvent.create({
      data: {
        emailSendId,
        eventType: "email.bounced",
        eventId,
        recipientEmail,
        rawPayload: JSON.stringify(payload),
      },
    });

    // Update EmailSend status
    await tx.emailSend.update({
      where: { id: emailSendId },
      data: {
        status: "BOUNCED",
        bouncedAt,
        lastEventAt: bouncedAt,
      },
    });

    // Update EmailRecipient
    if (recipientEmail) {
      await tx.emailRecipient.upsert({
        where: {
          emailSendId_email: {
            emailSendId,
            email: recipientEmail,
          },
        },
        update: {
          bounced: true,
        },
        create: {
          emailSendId,
          email: recipientEmail,
          bounced: true,
        },
      });

      // Update member stats
      const member = await tx.member.findUnique({
        where: { email: recipientEmail },
      });
      if (member) {
        await tx.member.update({
          where: { id: member.id },
          data: {
            totalBounces: { increment: 1 },
          },
        });
      }
    }
  });
}

/**
 * Handle email complained (spam) event - auto-unsubscribe
 */
async function handleEmailComplained(
  emailSendId: string,
  payload: ResendWebhookEvent,
  eventId: string,
) {
  const recipientEmail = payload.data.to?.[0];

  await prisma.$transaction(async (tx) => {
    // Create event record
    await tx.emailEvent.create({
      data: {
        emailSendId,
        eventType: "email.complained",
        eventId,
        recipientEmail,
        rawPayload: JSON.stringify(payload),
      },
    });

    // Update EmailSend status
    await tx.emailSend.update({
      where: { id: emailSendId },
      data: {
        status: "COMPLAINED",
        lastEventAt: new Date(payload.created_at),
      },
    });

    // Auto-unsubscribe the member on spam complaint
    if (recipientEmail) {
      const member = await tx.member.findUnique({
        where: { email: recipientEmail },
      });
      if (member) {
        await tx.member.update({
          where: { id: member.id },
          data: {
            unsubscribed: true,
          },
        });
      }
    }
  });
}

/**
 * Fetch overall email analytics
 */
export async function fetchEmailAnalyticsOverview(): Promise<EmailAnalyticsOverview> {
  const [sent, delivered, opened, clicked, bounced] = await Promise.all([
    prisma.emailSend.count(),
    prisma.emailSend.count({
      where: { status: { in: ["DELIVERED", "OPENED", "CLICKED"] } },
    }),
    prisma.emailSend.count({
      where: { status: { in: ["OPENED", "CLICKED"] } },
    }),
    prisma.emailSend.count({ where: { status: "CLICKED" } }),
    prisma.emailSend.count({ where: { status: "BOUNCED" } }),
  ]);

  const totalSent = sent || 1; // Prevent division by zero

  return {
    totalSent: sent,
    totalDelivered: delivered,
    totalOpened: opened,
    totalClicked: clicked,
    totalBounced: bounced,
    deliveryRate: (delivered / totalSent) * 100,
    openRate: (opened / totalSent) * 100,
    clickRate: (clicked / totalSent) * 100,
    bounceRate: (bounced / totalSent) * 100,
  };
}

/**
 * Fetch newsletter performance for a specific post
 */
export async function fetchNewsletterPerformance(
  postId: string,
): Promise<NewsletterPerformance | null> {
  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      emailSends: {
        include: {
          recipients: true,
        },
      },
    },
  });

  if (!post || post.emailSends.length === 0) {
    return null;
  }

  const primarySend = post.emailSends[0];
  const totalSent = post.emailsSent || 1;

  return {
    postId: post.id,
    postTitle: post.title,
    sentAt: primarySend.sentAt,
    totalSent: post.emailsSent,
    delivered: post.emailsDelivered,
    opened: post.emailsOpened,
    uniqueOpens: post.uniqueOpens,
    clicked: primarySend.recipients.filter((r) => r.clicked).length,
    bounced: primarySend.recipients.filter((r) => r.bounced).length,
    deliveryRate: (post.emailsDelivered / totalSent) * 100,
    openRate: (post.uniqueOpens / totalSent) * 100,
    clickRate:
      (primarySend.recipients.filter((r) => r.clicked).length / totalSent) *
      100,
  };
}

/**
 * Fetch all newsletter performances
 */
export async function fetchAllNewsletterPerformances(): Promise<
  NewsletterPerformance[]
> {
  const posts = await prisma.post.findMany({
    where: {
      isNewsletter: true,
      emailsSent: { gt: 0 },
    },
    include: {
      emailSends: {
        include: {
          recipients: true,
        },
        take: 1,
        orderBy: { sentAt: "desc" },
      },
    },
    orderBy: { publishDate: "desc" },
  });

  return posts
    .filter((post) => post.emailSends.length > 0)
    .map((post) => {
      const primarySend = post.emailSends[0];
      const totalSent = post.emailsSent || 1;

      return {
        postId: post.id,
        postTitle: post.title,
        sentAt: primarySend.sentAt,
        totalSent: post.emailsSent,
        delivered: post.emailsDelivered,
        opened: post.emailsOpened,
        uniqueOpens: post.uniqueOpens,
        clicked: primarySend.recipients.filter((r) => r.clicked).length,
        bounced: primarySend.recipients.filter((r) => r.bounced).length,
        deliveryRate: (post.emailsDelivered / totalSent) * 100,
        openRate: (post.uniqueOpens / totalSent) * 100,
        clickRate:
          (primarySend.recipients.filter((r) => r.clicked).length / totalSent) *
          100,
      };
    });
}

/**
 * Recalculate member engagement score based on email activity
 */
export async function recalculateMemberEngagement(
  memberId: string,
): Promise<void> {
  const member = await prisma.member.findUnique({
    where: { id: memberId },
  });

  if (!member) return;

  const totalReceived = member.totalEmailsReceived || 1;
  const openRate = (member.totalEmailsOpened / totalReceived) * 100;
  const clickRate = (member.totalEmailsClicked / totalReceived) * 100;

  // Calculate engagement score (weighted formula)
  // Opens are worth 1 point, clicks are worth 3 points
  // Bounces reduce score, recent activity increases score
  let score = openRate * 0.4 + clickRate * 0.6;

  // Penalize bounces
  if (member.totalBounces > 0) {
    const bounceRate = (member.totalBounces / totalReceived) * 100;
    score = score * (1 - bounceRate / 100);
  }

  // Boost for recent activity
  if (member.lastEmailOpenedAt) {
    const daysSinceLastOpen = Math.floor(
      (Date.now() - member.lastEmailOpenedAt.getTime()) / (1000 * 60 * 60 * 24),
    );
    if (daysSinceLastOpen < 7) {
      score *= 1.2;
    } else if (daysSinceLastOpen < 30) {
      score *= 1.1;
    } else if (daysSinceLastOpen > 90) {
      score *= 0.8;
    }
  }

  // Cap score at 100
  score = Math.min(100, Math.max(0, score));

  await prisma.member.update({
    where: { id: memberId },
    data: {
      engagementScore: score,
      openRate: `${openRate.toFixed(1)}%`,
    },
  });
}

/**
 * Recalculate engagement for all members (batch job)
 */
export async function recalculateAllMemberEngagement(): Promise<void> {
  const members = await prisma.member.findMany({
    where: { unsubscribed: false },
    select: { id: true },
  });

  for (const member of members) {
    await recalculateMemberEngagement(member.id);
  }
}

/**
 * Create EmailSend record when sending a newsletter
 */
export async function createEmailSendRecord(
  resendEmailId: string,
  broadcastId: string | null,
  postId: string | null,
  subject: string,
  fromEmail: string,
  recipientCount: number,
): Promise<string> {
  const emailSend = await prisma.emailSend.create({
    data: {
      resendEmailId,
      broadcastId,
      postId,
      subject,
      fromEmail,
      sentAt: new Date(),
      status: "SENT",
    },
  });

  // Update post's emailsSent count
  if (postId) {
    await prisma.post.update({
      where: { id: postId },
      data: {
        emailsSent: recipientCount,
      },
    });
  }

  return emailSend.id;
}
