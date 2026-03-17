const domain = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

const BASE_STYLES = `
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background-color: #f8f4f0;
  margin: 0;
  padding: 0;
`;

const CONTAINER = `
  max-width: 600px;
  margin: 40px auto;
  background: #ffffff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 24px rgba(0,0,0,0.08);
`;

const HEADER = `
  background: linear-gradient(135deg, #c0392b 0%, #8e1a0e 100%);
  padding: 36px 40px;
  text-align: center;
`;

const LOGO_TEXT = `
  color: #ffffff;
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -0.5px;
  margin: 0;
`;

const TAGLINE = `
  color: rgba(255,255,255,0.75);
  font-size: 13px;
  margin: 4px 0 0 0;
`;

const BODY = `
  padding: 40px 40px 32px;
`;

const GREETING = `
  font-size: 22px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 12px 0;
`;

const PARAGRAPH = `
  font-size: 15px;
  line-height: 1.7;
  color: #555555;
  margin: 0 0 20px 0;
`;

const BUTTON = `
  display: inline-block;
  background: linear-gradient(135deg, #c0392b 0%, #8e1a0e 100%);
  color: #ffffff;
  text-decoration: none;
  padding: 14px 32px;
  border-radius: 50px;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0.3px;
`;

const DIVIDER = `
  border: none;
  border-top: 1px solid #f0e8e4;
  margin: 32px 0;
`;

const FOOTER = `
  background: #faf6f4;
  padding: 24px 40px;
  text-align: center;
  font-size: 12px;
  color: #999999;
  line-height: 1.6;
`;

const HIGHLIGHT_BOX = `
  background: #fff5f4;
  border-left: 4px solid #c0392b;
  border-radius: 8px;
  padding: 16px 20px;
  margin: 20px 0;
`;

function baseLayout(content: string, previewText?: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ${previewText ? `<meta name="description" content="${previewText}">` : ""}
  <title>Matrimony</title>
</head>
<body style="${BASE_STYLES}">
  <div style="${CONTAINER}">
    <!-- Header -->
    <div style="${HEADER}">
      <p style="${LOGO_TEXT}">💍 Matrimony</p>
      <p style="${TAGLINE}">Where Hearts Find Their Perfect Match</p>
    </div>
    <!-- Body -->
    <div style="${BODY}">
      ${content}
    </div>
    <!-- Footer -->
    <div style="${FOOTER}">
      <p>© ${new Date().getFullYear()} Matrimony. All rights reserved.</p>
      <p>You're receiving this email because you have an account on <a href="${domain}" style="color:#c0392b;text-decoration:none;">Matrimony</a>.</p>
      <p><a href="${domain}/dashboard/settings" style="color:#c0392b;text-decoration:none;">Manage Notifications</a> &nbsp;|&nbsp; <a href="${domain}" style="color:#c0392b;text-decoration:none;">Visit Site</a></p>
    </div>
  </div>
</body>
</html>`;
}

/* ───────────────────────────────────────────── */
/*  1. WELCOME EMAIL                             */
/* ───────────────────────────────────────────── */
export function welcomeEmailTemplate(name: string): string {
  const firstName = name.split(" ")[0];
  return baseLayout(`
    <h1 style="${GREETING}">Welcome to Matrimony, ${firstName}! 🎉</h1>
    <p style="${PARAGRAPH}">
      We're so happy to have you here. Your journey to finding your perfect life partner starts today.
      Thousands of verified profiles are waiting to connect with you.
    </p>
    <div style="${HIGHLIGHT_BOX}">
      <p style="margin:0;font-size:14px;color:#333;font-weight:600;">✅ Your account is ready — here's how to get started:</p>
      <ul style="margin:10px 0 0 0;padding-left:18px;font-size:14px;color:#555;line-height:1.8;">
        <li>Complete your profile to attract better matches</li>
        <li>Upload at least one clear photo</li>
        <li>Set your partner preferences</li>
        <li>Send your first interest!</li>
      </ul>
    </div>
    <div style="text-align:center;margin:32px 0;">
      <a href="${domain}/profile/edit" style="${BUTTON}">Complete My Profile</a>
    </div>
    <hr style="${DIVIDER}">
    <p style="${PARAGRAPH}">
      If you have any questions, simply reply to this email — we're always happy to help.
    </p>
    <p style="font-size:15px;color:#555;">With love,<br><strong>The Matrimony Team</strong></p>
  `, `Welcome to Matrimony, ${firstName}!`);
}

/* ───────────────────────────────────────────── */
/*  2. INTEREST RECEIVED                         */
/* ───────────────────────────────────────────── */
export function interestReceivedEmailTemplate(
  name: string,
  senderName: string,
  senderProfileUrl?: string
): string {
  const firstName = name.split(" ")[0];
  const senderFirst = senderName.split(" ")[0];
  return baseLayout(`
    <h1 style="${GREETING}">You have a new interest! 💌</h1>
    <p style="${PARAGRAPH}">
      Hi ${firstName}, great news — <strong>${senderName}</strong> has sent you an interest request.
      They'd love to connect with you and learn more about you!
    </p>
    <div style="text-align:center;margin:24px 0;">
      <div style="width:80px;height:80px;border-radius:50%;background:linear-gradient(135deg,#c0392b,#8e1a0e);margin:0 auto 16px;display:flex;align-items:center;justify-content:center;font-size:32px;line-height:80px;color:#fff;">
        💑
      </div>
      <p style="font-size:18px;font-weight:600;color:#1a1a1a;margin:0;">${senderName}</p>
      <p style="font-size:13px;color:#999;margin:4px 0 0;">has sent you an Interest</p>
    </div>
    <div style="${HIGHLIGHT_BOX}">
      <p style="margin:0;font-size:14px;color:#555;">🕐 Respond soon — showing someone you're interested keeps the connection alive!</p>
    </div>
    <div style="text-align:center;margin:32px 0;display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
      <a href="${domain}/dashboard/interests/received" style="${BUTTON}">View Interest</a>
    </div>
    <hr style="${DIVIDER}">
    <p style="${PARAGRAPH}">You can accept or decline this interest from your <a href="${domain}/dashboard/interests/received" style="color:#c0392b;">interests dashboard</a>.</p>
  `, `${senderName} sent you an interest`);
}

/* ───────────────────────────────────────────── */
/*  3. INTEREST ACCEPTED                         */
/* ───────────────────────────────────────────── */
export function interestAcceptedEmailTemplate(
  name: string,
  acceptorName: string
): string {
  const firstName = name.split(" ")[0];
  return baseLayout(`
    <h1 style="${GREETING}">Your interest was accepted! 🎊</h1>
    <p style="${PARAGRAPH}">
      Wonderful news, ${firstName}! <strong>${acceptorName}</strong> has accepted your interest.
      This is the beginning of something beautiful — reach out and start a conversation!
    </p>
    <div style="text-align:center;font-size:48px;margin:24px 0;">🥂</div>
    <div style="${HIGHLIGHT_BOX}">
      <p style="margin:0;font-size:14px;color:#333;font-weight:600;">What's next?</p>
      <ul style="margin:10px 0 0 0;padding-left:18px;font-size:14px;color:#555;line-height:1.8;">
        <li>Send <strong>${acceptorName.split(" ")[0]}</strong> a message to break the ice</li>
        <li>View their full profile to learn more</li>
        <li>Consider unlocking their contact details</li>
      </ul>
    </div>
    <div style="text-align:center;margin:32px 0;">
      <a href="${domain}/messages" style="${BUTTON}">Send a Message Now</a>
    </div>
    <hr style="${DIVIDER}">
    <p style="${PARAGRAPH}">Best of luck on your journey. We're rooting for you! 💪</p>
    <p style="font-size:15px;color:#555;">With love,<br><strong>The Matrimony Team</strong></p>
  `, `${acceptorName} accepted your interest!`);
}

/* ───────────────────────────────────────────── */
/*  4. NEW MESSAGE                               */
/* ───────────────────────────────────────────── */
export function newMessageEmailTemplate(
  name: string,
  senderName: string,
  messagePreview: string
): string {
  const firstName = name.split(" ")[0];
  const preview = messagePreview.length > 120
    ? messagePreview.substring(0, 120) + "..."
    : messagePreview;
  return baseLayout(`
    <h1 style="${GREETING}">You have a new message! 💬</h1>
    <p style="${PARAGRAPH}">
      Hi ${firstName}, <strong>${senderName}</strong> just sent you a message on Matrimony.
    </p>
    <div style="background:#f9f4f3;border-radius:12px;padding:20px 24px;margin:20px 0;position:relative;">
      <p style="font-size:13px;font-weight:600;color:#c0392b;margin:0 0 8px;">${senderName}</p>
      <p style="font-size:15px;color:#333;margin:0;line-height:1.7;font-style:italic;">"${preview}"</p>
    </div>
    <div style="text-align:center;margin:32px 0;">
      <a href="${domain}/messages" style="${BUTTON}">Reply to ${senderName.split(" ")[0]}</a>
    </div>
    <hr style="${DIVIDER}">
    <p style="${PARAGRAPH}">Don't keep them waiting — reply now and keep the conversation going! 😊</p>
  `, `${senderName} sent you a message`);
}

/* ───────────────────────────────────────────── */
/*  5. PROFILE VIEWED                            */
/* ───────────────────────────────────────────── */
export function profileViewedEmailTemplate(
  name: string,
  viewerName: string
): string {
  const firstName = name.split(" ")[0];
  return baseLayout(`
    <h1 style="${GREETING}">Someone viewed your profile! 👀</h1>
    <p style="${PARAGRAPH}">
      Hi ${firstName}, <strong>${viewerName}</strong> just visited your profile. Looks like you've caught someone's eye!
    </p>
    <div style="text-align:center;font-size:48px;margin:24px 0;">🔍</div>
    <div style="${HIGHLIGHT_BOX}">
      <p style="margin:0;font-size:14px;color:#555;">
        💡 <strong>Tip:</strong> A complete profile with photos gets 5× more responses. 
        Make sure your profile is looking its best to turn this view into a connection!
      </p>
    </div>
    <div style="text-align:center;margin:32px 0;">
      <a href="${domain}/dashboard/who-viewed-me" style="${BUTTON}">See Who Viewed You</a>
    </div>
    <hr style="${DIVIDER}">
    <p style="${PARAGRAPH}">
      You can also send <strong>${viewerName.split(" ")[0]}</strong> an interest if you like their profile! 
      <a href="${domain}/matches" style="color:#c0392b;">Browse Matches →</a>
    </p>
  `, `${viewerName} viewed your profile`);
}

/* ───────────────────────────────────────────── */
/*  6. VERIFICATION APPROVED (enhanced)         */
/* ───────────────────────────────────────────── */
export function verificationApprovedEmailTemplate(name: string): string {
  const firstName = name.split(" ")[0];
  return baseLayout(`
    <h1 style="${GREETING}">Your profile is now Verified! ✅</h1>
    <p style="${PARAGRAPH}">
      Congratulations ${firstName}! Your profile has been reviewed and verified by our team.
      You'll now display a <strong>✓ Verified Badge</strong> on your profile.
    </p>
    <div style="text-align:center;font-size:64px;margin:24px 0;">🏅</div>
    <div style="${HIGHLIGHT_BOX}">
      <p style="margin:0;font-size:14px;color:#333;font-weight:600;">Benefits of being Verified:</p>
      <ul style="margin:10px 0 0 0;padding-left:18px;font-size:14px;color:#555;line-height:1.8;">
        <li>✅ Verified badge on your profile</li>
        <li>📈 Prioritized in match suggestions</li>
        <li>🔒 Higher trust from other members</li>
        <li>💌 More interest requests on average</li>
      </ul>
    </div>
    <div style="text-align:center;margin:32px 0;">
      <a href="${domain}/dashboard" style="${BUTTON}">Go to My Dashboard</a>
    </div>
  `, "Your Matrimony profile is now verified!");
}

/* ───────────────────────────────────────────── */
/*  7. VERIFICATION REJECTED (enhanced)         */
/* ───────────────────────────────────────────── */
export function verificationRejectedEmailTemplate(
  name: string,
  reason?: string
): string {
  const firstName = name.split(" ")[0];
  return baseLayout(`
    <h1 style="${GREETING}">Verification Update</h1>
    <p style="${PARAGRAPH}">
      Hi ${firstName}, we've reviewed your verification documents and unfortunately we're unable to approve your request at this time.
    </p>
    ${reason ? `
    <div style="${HIGHLIGHT_BOX}">
      <p style="margin:0;font-size:14px;color:#333;font-weight:600;">Reason:</p>
      <p style="margin:8px 0 0;font-size:14px;color:#555;">${reason}</p>
    </div>` : ""}
    <p style="${PARAGRAPH}">
      Please update your documents and re-submit your verification request. Make sure documents are:
    </p>
    <ul style="font-size:14px;color:#555;line-height:1.8;padding-left:18px;margin:0 0 20px;">
      <li>Clear and legible</li>
      <li>Valid and not expired</li>
      <li>Matching the name on your profile</li>
    </ul>
    <div style="text-align:center;margin:32px 0;">
      <a href="${domain}/verification" style="${BUTTON}">Re-submit Verification</a>
    </div>
    <hr style="${DIVIDER}">
    <p style="${PARAGRAPH}">If you have any questions, reply to this email and our team will assist you.</p>
  `, "Update on your Matrimony verification");
}
