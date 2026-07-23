import nodemailer from "nodemailer";

// Retrieve configuration from environment variables
const SMTP_HOST = process.env.SMTP_HOST || "";
const SMTP_PORT = parseInt(process.env.SMTP_PORT || "587");
const SMTP_USER = process.env.SMTP_USER || "";
const SMTP_PASS = process.env.SMTP_PASS || "";
const SMTP_SECURE = process.env.SMTP_SECURE === "true";
const SMTP_FROM = process.env.SMTP_FROM || '"Cre8tiveCove Alerts" <alerts@cre8tivecove.com>';
const TARGET_EMAIL = "hello@cre8tivecove.com";

let transporter: nodemailer.Transporter | null = null;

// Initialize Transporter
try {
  if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_SECURE,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS
      }
    });
    console.log(`[Email Service] Mail transporter initialized with SMTP Host: ${SMTP_HOST}`);
  } else {
    console.warn("[Email Service] SMTP configuration missing in environment variables. Email notifications will fall back to console logging.");
  }
} catch (error) {
  console.error("[Email Service] Failed to initialize email transporter:", error);
}

/**
 * Clean wrapper to send an email, falling back to clean console log if no SMTP configuration.
 */
async function sendMail(options: nodemailer.SendMailOptions): Promise<void> {
  const mailOptions = {
    ...options,
    from: SMTP_FROM,
    to: TARGET_EMAIL
  };

  if (transporter) {
    try {
      await transporter.sendMail(mailOptions);
      console.log(`[Email Service] Email sent successfully to ${TARGET_EMAIL}: Subject: "${options.subject}"`);
    } catch (error) {
      console.error(`[Email Service] Failed to send email to ${TARGET_EMAIL}:`, error);
      logMailFallback(mailOptions);
    }
  } else {
    logMailFallback(mailOptions);
  }
}

/**
 * Logs a beautifully formatted mock email to the console if SMTP is unconfigured.
 */
function logMailFallback(options: nodemailer.SendMailOptions): void {
  console.log("\n=================== [MOCK EMAIL ALERTS] ===================");
  console.log(`FROM:    ${options.from}`);
  console.log(`TO:      ${options.to}`);
  console.log(`SUBJECT: ${options.subject}`);
  if (options.attachments && options.attachments.length > 0) {
    console.log(`ATTACHMENTS: ${options.attachments.map((a: any) => a.filename || a.path).join(", ")}`);
  }
  console.log("----------------------- [BODY START] -----------------------");
  console.log(options.text || options.html);
  console.log("------------------------ [BODY END] ------------------------");
  console.log("============================================================\n");
}

/**
 * Formats a generic HTML body block with the Cre8tiveCove brand styling.
 */
function buildBrandedHtmlTemplate(title: string, detailsHtml: string, contentLabel: string, contentBody: string): string {
  const formattedContentBody = contentBody.replace(/\n/g, "<br />");
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        background-color: #FAF9F6;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        color: #111111;
        -webkit-font-smoothing: antialiased;
      }
      .wrapper {
        width: 100%;
        table-layout: fixed;
        background-color: #FAF9F6;
        padding: 40px 0;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        background-color: #FFFFFF;
        border: 1px solid rgba(0, 0, 0, 0.05);
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
      }
      .header {
        background-color: #111111;
        padding: 30px;
        text-align: center;
        border-bottom: 3px solid #C8A96B;
      }
      .logo {
        font-size: 22px;
        font-weight: 800;
        color: #FFFFFF;
        letter-spacing: 0.15em;
        text-transform: uppercase;
        margin: 0;
      }
      .logo span {
        color: #C8A96B;
      }
      .content {
        padding: 40px 30px;
      }
      .title {
        font-size: 20px;
        font-weight: 700;
        margin-top: 0;
        margin-bottom: 24px;
        color: #111111;
        border-left: 4px solid #C8A96B;
        padding-left: 12px;
        line-height: 1.2;
      }
      .table-container {
        margin-bottom: 30px;
      }
      .details-table {
        width: 100%;
        border-collapse: collapse;
      }
      .details-table th, .details-table td {
        padding: 12px 14px;
        text-align: left;
        font-size: 13px;
        border-bottom: 1px solid #EEEEEE;
      }
      .details-table th {
        font-weight: 700;
        color: #777777;
        width: 30%;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
      .details-table td {
        color: #111111;
        font-weight: 500;
      }
      .message-box {
        background-color: #F9F9F8;
        border: 1px solid #ECEBE6;
        border-radius: 8px;
        padding: 20px;
        margin-top: 25px;
      }
      .message-title {
        font-size: 11px;
        font-weight: 700;
        text-transform: uppercase;
        color: #C8A96B;
        letter-spacing: 0.1em;
        margin-top: 0;
        margin-bottom: 10px;
      }
      .message-text {
        font-size: 13px;
        line-height: 1.6;
        color: #333333;
        margin: 0;
      }
      .footer {
        background-color: #111111;
        padding: 20px 30px;
        text-align: center;
        font-size: 11px;
        color: #666666;
        border-top: 1px solid rgba(255, 255, 255, 0.05);
      }
      .footer a {
        color: #C8A96B;
        text-decoration: none;
      }
    </style>
  </head>
  <body>
    <div class="wrapper">
      <div class="container">
        <div class="header">
          <div class="logo">Cre8tive<span>Cove</span></div>
        </div>
        <div class="content">
          <div class="title">${title}</div>
          <div class="table-container">
            <table class="details-table">
              ${detailsHtml}
            </table>
          </div>
          ${contentBody ? `
            <div class="message-box">
              <div class="message-title">${contentLabel}</div>
              <p class="message-text">${formattedContentBody}</p>
            </div>
          ` : ""}
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} Cre8tiveCove. All rights reserved. <br />
          Generated by <a href="https://cre8tivecove.com">Cre8tiveCove Site System</a>.
        </div>
      </div>
    </div>
  </body>
  </html>
  `;
}

export const emailService = {
  /**
   * Sends a notification email when a client submits the contact / inquiry form.
   */
  sendInquiryEmail: async (inquiry: {
    name: string;
    company: string | null;
    service: string;
    budget: string | null;
    message: string;
    submittedAt?: Date;
  }) => {
    const title = "New Client Inquiry Received";
    const detailsHtml = `
      <tr>
        <th>Client Name</th>
        <td>${inquiry.name}</td>
      </tr>
      <tr>
        <th>Company</th>
        <td>${inquiry.company || "Not Specified"}</td>
      </tr>
      <tr>
        <th>Service Requested</th>
        <td>${inquiry.service}</td>
      </tr>
      <tr>
        <th>Estimated Budget</th>
        <td>${inquiry.budget || "Not Specified"}</td>
      </tr>
      <tr>
        <th>Submitted At</th>
        <td>${inquiry.submittedAt ? new Date(inquiry.submittedAt).toLocaleString() : new Date().toLocaleString()}</td>
      </tr>
    `;

    const htmlBody = buildBrandedHtmlTemplate(title, detailsHtml, "Project Details & Message", inquiry.message);

    await sendMail({
      subject: `[New Inquiry] ${inquiry.name} - ${inquiry.service}`,
      text: `New Client Inquiry:\nName: ${inquiry.name}\nCompany: ${inquiry.company || "None"}\nService: ${inquiry.service}\nBudget: ${inquiry.budget || "None"}\nMessage: ${inquiry.message}`,
      html: htmlBody
    });
  },

  /**
   * Sends a notification email when a candidate applies for a job posting.
   */
  sendJobApplicationEmail: async (
    application: {
      name: string;
      email: string;
      phone: string | null;
      coverNote: string | null;
      submittedAt?: Date;
    },
    jobTitle: string,
    absoluteResumePath: string | null
  ) => {
    const title = "New Job Application Received";
    const detailsHtml = `
      <tr>
        <th>Candidate Name</th>
        <td>${application.name}</td>
      </tr>
      <tr>
        <th>Email Address</th>
        <td>${application.email}</td>
      </tr>
      <tr>
        <th>Phone Number</th>
        <td>${application.phone || "Not Provided"}</td>
      </tr>
      <tr>
        <th>Job Applied For</th>
        <td>${jobTitle}</td>
      </tr>
      <tr>
        <th>Submitted At</th>
        <td>${application.submittedAt ? new Date(application.submittedAt).toLocaleString() : new Date().toLocaleString()}</td>
      </tr>
    `;

    const htmlBody = buildBrandedHtmlTemplate(
      title,
      detailsHtml,
      "Cover Note / Candidate Message",
      application.coverNote || "No cover note provided by candidate."
    );

    const attachments: any[] = [];
    if (absoluteResumePath) {
      attachments.push({
        path: absoluteResumePath
      });
    }

    await sendMail({
      subject: `[Job Application] ${application.name} - ${jobTitle}`,
      text: `New Job Application:\nCandidate Name: ${application.name}\nEmail: ${application.email}\nPhone: ${application.phone || "None"}\nJob: ${jobTitle}\nCover Note: ${application.coverNote || "None"}`,
      html: htmlBody,
      attachments
    });
  }
};
