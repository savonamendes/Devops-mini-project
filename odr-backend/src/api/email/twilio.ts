import { Request, Response } from "express";
import sgMail from "@sendgrid/mail";
import prisma from "../../lib/prisma";
import * as Enum from  "../../utils/enum";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

// // Test email endpoint
// export default async function testTwilioHandler(req: Request, res: Response) {
//   try {
//     console.log("test api call");

//     const msg = {
//       to: [
//         "nirmalrajgn@gmail.com",
//         "basker@crekodr.com",
//       ],
//       from: process.env.SENDGRID_FROM_EMAIL!, // ✅ Must be verified in SendGrid
//       subject: "Hello from ODR Lab 🚀",
//       text: "This is a plain text email.",
//       html: `
//       <html>
//         <head>
//           <meta charset="UTF-8" />
//           <title>Idea Collaboration Invitation</title>
//         </head>
//         <body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color:#f7f7f7;">
//           <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#f7f7f7; padding:30px 0;">
//             <tr>
//               <td align="center">
//                 <table width="600" border="0" cellspacing="0" cellpadding="0" style="background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 2px 6px rgba(0,0,0,0.1);">
//                   <!-- Header -->
//                   <tr>
//                     <td align="center" style="background-color:#4a90e2; padding:20px;">
//                       <h1 style="margin:0; color:#ffffff; font-size:24px;">Idea Approved & Published</h1>
//                     </td>
//                   </tr>
//                   <!-- Body -->
//                   <tr>
//                     <td style="padding:30px; color:#333333; font-size:16px; line-height:1.6;">
//                       <p style="margin-top:0;">Hello,</p>
//                       <p>
//                         We’re excited to let you know that the idea submitted by 
//                         <strong style="color:#4a90e2;">{{user1}}</strong> has been
//                         <strong>approved and published</strong> by the admin.
//                       </p>
//                       <p>
//                         You have been invited as a <strong>collaborator</strong> on this idea by 
//                         <strong style="color:#4a90e2;">{{user1}}</strong>.
//                       </p>
//                       <p style="margin-bottom:30px;">
//                         Click the button below to view and collaborate on the idea:
//                       </p>
//                       <!-- CTA Button -->
//                       <table border="0" cellspacing="0" cellpadding="0" align="center">
//                         <tr>
//                           <td align="center" bgcolor="#4a90e2" style="border-radius:6px;">
//                             <a href="{{ideaLink}}" target="_blank" 
//                               style="display:inline-block; padding:12px 24px; font-size:16px; color:#ffffff; text-decoration:none; font-weight:bold; border-radius:6px; background-color:#4a90e2;">
//                               View Idea
//                             </a>
//                           </td>
//                         </tr>
//                       </table>
//                     </td>
//                   </tr>
//                   <!-- Footer -->
//                   <tr>
//                     <td style="padding:20px; background-color:#f0f0f0; text-align:center; font-size:12px; color:#888888;">
//                       <p style="margin:0;">You’re receiving this email because you were invited as a collaborator.</p>
//                       <p style="margin:0;">&copy; {{year}} Your App Name. All rights reserved.</p>
//                     </td>
//                   </tr>
//                 </table>
//               </td>
//             </tr>
//           </table>
//         </body>
//       </html>
//       `,
//     };

//     const response = await sgMail.send(msg);
//     console.log("Email sent:", response[0].statusCode);

//     return res.json({
//       success: true,
//       message: "Email sent successfully",
//     });
//   } catch (error: any) {
//     console.error("Error sending email:", error.response?.body || error.message);
//     return res.status(500).json({ success: false, error: error.message });
//   }
// }

// Bulk email endpoint
export  async function sendBulkEmailHandler(req: Request, res: Response) {
  try {
    const { userIds, templateName } = req.body;

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ success: false, error: "userIds array required" });
    }
    if (!templateName) {
      return res.status(400).json({ success: false, error: "templateName required" });
    }

    // 1️⃣ Fetch template by name
    const template = await prisma.emailTemplate.findUnique({
      where: { name: templateName },
    });

    if (!template) {
      return res.status(404).json({ success: false, error: "Template not found" });
    }

    // 2️⃣ Fetch users by IDs
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
    });

    if (users.length === 0) {
      return res.status(404).json({ success: false, error: "No users found" });
    }

    // 3️⃣ Send emails + store communication logs
    const results: any[] = [];
    for (const user of users) {
      const msg = {
        to: user.email,
        from: process.env.SENDGRID_FROM_EMAIL!,
        subject: template.mailsubject, // ✅ correct field
        text: template.mailcontent,    // ✅ correct field
        html: `<div>${template.mailcontent}</div>`,
      };

      try {
        const response = await sgMail.send(msg);

        // Save to communication table
        await prisma.communication.create({
          data: {
            msgContent: template.mailcontent,
            msgSubject: template.mailsubject,
            recipient: user.email,
            userId: user.id,
          },
        });

        results.push({ userId: user.id, status: "sent", code: response[0].statusCode });
      } catch (err: any) {
        console.error(`Error sending email to ${user.email}:`, err.message);
        results.push({ userId: user.id, status: "failed", error: err.message });
      }
    }

    return res.json({
      success: true,
      results,
    });
  } catch (error: any) {
    console.error("Bulk email error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}



export async function sendTemplatedEmail(userId: string, templateName: string) {
  // 1️⃣ Fetch template
  const template = await prisma.emailTemplate.findUnique({
    where: { name: templateName },
  });
  if (!template) throw new Error(`Email template '${templateName}' not found`);

  // 2️⃣ Fetch user
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!user || !user.email) throw new Error(`User with id ${userId} not found or has no email`);

  // 3️⃣ Build message
  const msg = {
    to: user.email,
    from: process.env.SENDGRID_FROM_EMAIL!,
    subject: template.mailsubject,
    text: template.mailcontent,
    html: `<div>${template.mailcontent}</div>`,
  };

  // 4️⃣ Send email
  const response = await sgMail.send(msg);

  // 5️⃣ Log to Communication table
  await prisma.communication.create({
    data: {
      msgContent: template.mailcontent,
      msgSubject: template.mailsubject,
      recipient: user.email,
      userId: user.id,
    },
  });

  return response[0].statusCode;
}


export async function sendTemplatedEmails(userIds: string[], templateName: string) {
  // 1️⃣ Fetch template
  const template = await prisma.emailTemplate.findUnique({
    where: { name: templateName },
  });
  if (!template) throw new Error(`Email template '${templateName}' not found`);

  // 2️⃣ Fetch users
  const users = await prisma.user.findMany({
    where: { id: { in: userIds } },
  });

  if (!users || users.length === 0) {
    throw new Error(`No valid users found for IDs: ${userIds.join(", ")}`);
  }

  const results: { userId: string; status: string; code?: number; error?: string }[] = [];

  // 3️⃣ Loop through users and send emails
  for (const user of users) {
    if (!user.email) {
      results.push({ userId: user.id, status: "failed", error: "No email found" });
      continue;
    }

    const msg = {
      to: user.email,
      from: process.env.SENDGRID_FROM_EMAIL!,
      subject: template.mailsubject,
      text: template.mailcontent,
      html: `<div>${template.mailcontent}</div>`,
    };

    try {
      const response = await sgMail.send(msg);

      // 4️⃣ Log to Communication table
      await prisma.communication.create({
        data: {
          msgContent: template.mailcontent,
          msgSubject: template.mailsubject,
          recipient: user.email,
          userId: user.id,
        },
      });

      results.push({ userId: user.id, status: "sent", code: response[0].statusCode });
    } catch (err: any) {
      console.error(`Error sending email to ${user.email}:`, err.message);
      results.push({ userId: user.id, status: "failed", error: err.message });
    }
  }

  return results;
}

export async function sendEmail(
  userIds: string[],
  templateName: string,
  ideaId: string
) {
  let userIdToInviteIdMap: Record<string, string> = {};
  const template = await prisma.emailTemplate.findUnique({
    where: { name: templateName },
  });
  if (!template) throw new Error(`Email template '${templateName}' not found`);

  // 2️⃣ Fetch users
  let publisherUser = null;
  if (templateName === Enum.EmailTemplate.COLLABORATOR_REQUEST && ideaId) {
    const idea = await prisma.idea.findUnique({
      where: { id: ideaId },
    });
    if (idea) {
      publisherUser = await prisma.user.findUnique({
        where: { id: idea.ownerId },
      });

      const collabInvites = await prisma.ideaCollabInviteStatus.findMany({
        where: { ideaId: ideaId },
      });
      userIdToInviteIdMap = collabInvites.reduce((acc, invite) => {
        acc[invite.userId] = invite.id;
        return acc;
      }, {} as Record<string, string>);
    }
  }
  const users = await prisma.user.findMany({
    where: { id: { in: userIds } },
  });

  if (!users || users.length === 0) {
    throw new Error(`No valid users found for IDs: ${userIds.join(", ")}`);
  }

  const results: { userId: string; status: string; code?: number; error?: string }[] = [];

  // 🔹 Improved applyTemplate
  const applyTemplate = (content: string, user: any) => {
    let output = content;
    // Correctly get the invite ID for the current user from the map
    const invitecollab_id = userIdToInviteIdMap[user.id] ?? '';

    // Default dynamic replacements
    const replacements: Record<string, string> = {
      username: user?.name ?? "",
      publisherName: publisherUser?.name ?? "",
      year: new Date().getFullYear().toString(),
      ideaLink: `${Enum.DomainURL.ACCEPTIDEAURL}${ideaId}?invite=${invitecollab_id}`,
    };

    // Replace placeholders in template
    for (const [key, value] of Object.entries(replacements)) {
      const regex = new RegExp(`{{${key}}}`, "g");
      output = output.replace(regex, value);
    }

    return output;
  };

  // 3️⃣ Loop through users and send emails
  for (const user of users) {
    if (!user.email) {
      results.push({ userId: user.id, status: "failed", error: "No email found" });
      continue;
    }

    const subject = applyTemplate(template.mailsubject, user);
    const content = applyTemplate(template.mailcontent, user);

    const msg = {
      to: user.email,
      from: process.env.SENDGRID_FROM_EMAIL!,
      subject,
      text: content,
      html: `<div>${content}</div>`,
    };

    try {
      const response = await sgMail.send(msg);
      const messageId = response[0]?.headers["x-message-id"] || null;

      // 4️⃣ Log SUCCESS in Communication table
      await prisma.communication.create({
        data: {
          msgContent: content,
          msgSubject: subject,
          recipient: user.email,
          userId: user.id,
          status: Enum.EmailStatus.SUCCESS,
          messageId: messageId,
        },
      });

      results.push({ userId: user.id, status: "sent", code: response[0].statusCode });
    } catch (err: any) {
      console.error(`Error sending email to ${user.email}:`, err.message);

      // 4️⃣ Log FAILURE in Communication table
      await prisma.communication.create({
        data: {
          // Corrected: Log the personalized content that failed to send
          msgContent: content,
          msgSubject: subject,
          recipient: user.email,
          userId: user.id,
          status: Enum.EmailStatus.FAILED,
          reason: err.message,
        },
      });

      results.push({ userId: user.id, status: "failed", error: err.message });
    }
  }

  return results;
}