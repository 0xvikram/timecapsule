// Email utility for TimeCapsule using Gmail SMTP
import nodemailer from "nodemailer";

export interface EmailData {
  to: string;
  subject: string;
  html: string;
}

// Create Gmail SMTP transporter
const createTransporter = () => {
  console.log("📧 [EMAIL] Creating transporter...");
  console.log("📧 [EMAIL] GMAIL_USER exists:", !!process.env.GMAIL_USER);
  console.log(
    "📧 [EMAIL] GMAIL_USER value:",
    process.env.GMAIL_USER || "NOT SET"
  );
  console.log(
    "📧 [EMAIL] GMAIL_APP_PASSWORD exists:",
    !!process.env.GMAIL_APP_PASSWORD
  );
  console.log(
    "📧 [EMAIL] GMAIL_APP_PASSWORD length:",
    process.env.GMAIL_APP_PASSWORD?.length || 0
  );

  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.log(
      "📧 [EMAIL] ❌ Missing credentials - cannot create transporter"
    );
    return null;
  }

  console.log(
    "📧 [EMAIL] ✅ Credentials found, creating nodemailer transporter..."
  );

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
};

export async function sendEmail(data: EmailData): Promise<boolean> {
  console.log("📧 [EMAIL] ========== SEND EMAIL START ==========");
  console.log("📧 [EMAIL] To:", data.to);
  console.log("📧 [EMAIL] Subject:", data.subject);

  const transporter = createTransporter();

  if (!transporter) {
    console.log("📧 [EMAIL] ❌ No transporter - email service not configured");
    console.log(
      "📧 [EMAIL] Set GMAIL_USER and GMAIL_APP_PASSWORD environment variables"
    );
    return false;
  }

  try {
    const fromName = process.env.EMAIL_FROM_NAME || "TimeCapsule";
    const fromEmail = process.env.GMAIL_USER;

    console.log("📧 [EMAIL] From:", `${fromName} <${fromEmail}>`);
    console.log("📧 [EMAIL] Attempting to send via Gmail SMTP...");

    const result = await transporter.sendMail({
      from: `${fromName} <${fromEmail}>`,
      to: data.to,
      subject: data.subject,
      html: data.html,
    });

    console.log("📧 [EMAIL] ✅ Email sent successfully!");
    console.log("📧 [EMAIL] Message ID:", result.messageId);
    console.log("📧 [EMAIL] Response:", result.response);
    console.log("📧 [EMAIL] ========== SEND EMAIL END ==========");
    return true;
  } catch (error: unknown) {
    console.log("📧 [EMAIL] ❌ Error sending email!");
    console.log("📧 [EMAIL] Error type:", typeof error);
    console.log(
      "📧 [EMAIL] Error name:",
      error instanceof Error ? error.name : "Unknown"
    );
    console.log(
      "📧 [EMAIL] Error message:",
      error instanceof Error ? error.message : String(error)
    );
    if (error instanceof Error && error.stack) {
      console.log("📧 [EMAIL] Stack trace:", error.stack);
    }
    console.log(
      "📧 [EMAIL] Full error:",
      JSON.stringify(error, Object.getOwnPropertyNames(error as object), 2)
    );
    console.log("📧 [EMAIL] ========== SEND EMAIL END ==========");
    return false;
  }
}

export function generateCapsuleCreatedEmail(params: {
  userName: string;
  capsuleTitle: string;
  unlockDate: string;
  capsuleUrl: string;
  isPublic: boolean;
}): EmailData {
  const { userName, capsuleTitle, unlockDate, capsuleUrl, isPublic } = params;

  const formattedDate = new Date(unlockDate).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return {
    to: "", // Will be set by caller
    subject: `🔒 Your TimeCapsule "${capsuleTitle}" has been sealed!`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <div style="background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%); border-radius: 24px; padding: 40px; border: 1px solid #333;">
      
      <!-- Logo -->
      <div style="text-align: center; margin-bottom: 32px;">
        <div style="display: inline-block; background: #facc15; width: 60px; height: 60px; border-radius: 16px; line-height: 60px; font-size: 28px;">
          ⏳
        </div>
      </div>

      <!-- Header -->
      <h1 style="color: #ffffff; font-size: 28px; font-weight: 900; text-align: center; margin: 0 0 8px 0; font-style: italic;">
        TRANSMISSION SEALED
      </h1>
      <p style="color: #facc15; font-size: 12px; text-align: center; margin: 0 0 32px 0; letter-spacing: 4px; text-transform: uppercase;">
        TimeCapsule Created Successfully
      </p>

      <!-- Greeting -->
      <p style="color: #ffffff; font-size: 16px; margin: 0 0 24px 0;">
        Hey ${userName || "Time Traveler"},
      </p>

      <!-- Message -->
      <p style="color: #a3a3a3; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
        Your time capsule has been successfully sealed and is now locked in the temporal vault.
      </p>

      <!-- Capsule Card -->
      <div style="background: rgba(250, 204, 21, 0.1); border: 2px solid rgba(250, 204, 21, 0.3); border-radius: 16px; padding: 24px; margin: 0 0 24px 0;">
        <h2 style="color: #facc15; font-size: 24px; font-weight: 900; margin: 0 0 16px 0; font-style: italic;">
          "${capsuleTitle}"
        </h2>
        <div style="display: flex; gap: 16px; flex-wrap: wrap;">
          <div style="flex: 1; min-width: 120px;">
            <p style="color: #666; font-size: 10px; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 4px 0;">
              Unlocks On
            </p>
            <p style="color: #ffffff; font-size: 14px; font-weight: 700; margin: 0;">
              ${formattedDate}
            </p>
          </div>
          <div style="flex: 1; min-width: 120px;">
            <p style="color: #666; font-size: 10px; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 4px 0;">
              Visibility
            </p>
            <p style="color: ${
              isPublic ? "#22c55e" : "#facc15"
            }; font-size: 14px; font-weight: 700; margin: 0;">
              ${isPublic ? "🌍 Public" : "🔐 Private"}
            </p>
          </div>
        </div>
      </div>

      <!-- CTA Button -->
      <div style="text-align: center; margin: 32px 0;">
        <a href="${capsuleUrl}" style="display: inline-block; background: #facc15; color: #000000; font-size: 14px; font-weight: 900; text-decoration: none; padding: 16px 32px; border-radius: 40px; text-transform: uppercase; letter-spacing: 2px;">
          View Your Capsule
        </a>
      </div>

      <!-- Footer -->
      <p style="color: #666; font-size: 12px; text-align: center; margin: 32px 0 0 0;">
        We'll remind you when it's time to unlock your memories.
      </p>
    </div>

    <!-- Bottom text -->
    <p style="color: #444; font-size: 11px; text-align: center; margin: 24px 0 0 0;">
      TimeCapsule — Lock moments. Unlock memories.
    </p>
  </div>
</body>
</html>
    `,
  };
}

export function generateReminderEmail(params: {
  userName: string;
  capsuleTitle: string;
  unlockDate: string;
  capsuleUrl: string;
  daysLeft: number;
}): EmailData {
  const { userName, capsuleTitle, unlockDate, capsuleUrl, daysLeft } = params;

  const formattedDate = new Date(unlockDate).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return {
    to: "", // Will be set by caller
    subject: `⏰ ${daysLeft} day${
      daysLeft !== 1 ? "s" : ""
    } until "${capsuleTitle}" unlocks!`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <div style="background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%); border-radius: 24px; padding: 40px; border: 1px solid #333;">
      
      <!-- Logo -->
      <div style="text-align: center; margin-bottom: 32px;">
        <div style="display: inline-block; background: #facc15; width: 60px; height: 60px; border-radius: 16px; line-height: 60px; font-size: 28px;">
          ⏰
        </div>
      </div>

      <!-- Header -->
      <h1 style="color: #facc15; font-size: 48px; font-weight: 900; text-align: center; margin: 0 0 8px 0; font-style: italic;">
        ${daysLeft}
      </h1>
      <p style="color: #ffffff; font-size: 14px; text-align: center; margin: 0 0 32px 0; letter-spacing: 2px; text-transform: uppercase;">
        day${daysLeft !== 1 ? "s" : ""} until unlock
      </p>

      <!-- Greeting -->
      <p style="color: #ffffff; font-size: 16px; margin: 0 0 24px 0;">
        Hey ${userName || "Time Traveler"},
      </p>

      <!-- Message -->
      <p style="color: #a3a3a3; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
        Your time capsule is almost ready to reveal! Get excited — your past self has a message waiting for you.
      </p>

      <!-- Capsule Card -->
      <div style="background: rgba(250, 204, 21, 0.1); border: 2px solid rgba(250, 204, 21, 0.3); border-radius: 16px; padding: 24px; margin: 0 0 24px 0;">
        <h2 style="color: #facc15; font-size: 24px; font-weight: 900; margin: 0 0 16px 0; font-style: italic;">
          "${capsuleTitle}"
        </h2>
        <p style="color: #666; font-size: 10px; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 4px 0;">
          Unlocks On
        </p>
        <p style="color: #ffffff; font-size: 16px; font-weight: 700; margin: 0;">
          ${formattedDate}
        </p>
      </div>

      <!-- CTA Button -->
      <div style="text-align: center; margin: 32px 0;">
        <a href="${capsuleUrl}" style="display: inline-block; background: #facc15; color: #000000; font-size: 14px; font-weight: 900; text-decoration: none; padding: 16px 32px; border-radius: 40px; text-transform: uppercase; letter-spacing: 2px;">
          View Capsule
        </a>
      </div>
    </div>

    <!-- Bottom text -->
    <p style="color: #444; font-size: 11px; text-align: center; margin: 24px 0 0 0;">
      TimeCapsule — Lock moments. Unlock memories.
    </p>
  </div>
</body>
</html>
    `,
  };
}
