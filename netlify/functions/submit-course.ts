import { Resend } from 'resend';
import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';

const resend = new Resend(process.env.RESEND_API_KEY);

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const body = JSON.parse(event.body || '{}');

    const {
      title,
      author,
      authorEmail,
      description,
      category,
      level,
      duration,
      content,
      videoUrl,
      externalLink,
      tags,
    } = body;

    if (!title || !author || !authorEmail || !description || !category || !level || !duration || !content) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Missing required fields' }),
      };
    }

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Generate markdown frontmatter
    const tagsYaml = tags && tags.length > 0
      ? `tags:\n${tags.map((t: string) => `  - ${t}`).join('\n')}`
      : '';

    const markdown = `---
title: "${title.replace(/"/g, '\\"')}"
author: "${author.replace(/"/g, '\\"')}"
authorEmail: "${authorEmail}"
description: "${description.replace(/"/g, '\\"')}"
category: "${category}"
duration: "${duration}"
level: "${level}"
${tagsYaml}
${videoUrl ? `videoUrl: "${videoUrl}"` : ''}
${externalLink ? `externalLink: "${externalLink}"` : ''}
featured: false
status: "pending"
datePublished: ${new Date().toISOString().split('T')[0]}
---

${content}
`;

    // Email to admin with the markdown content
    const adminEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"></head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">New Course Submission</h1>

        <h2 style="color: #1f2937; margin-top: 25px;">Course Details</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; color: #6b7280; width: 30%;">Title</td><td style="padding: 8px 0;"><strong>${title}</strong></td></tr>
          <tr><td style="padding: 8px 0; color: #6b7280;">Author</td><td style="padding: 8px 0;">${author}</td></tr>
          <tr><td style="padding: 8px 0; color: #6b7280;">Email</td><td style="padding: 8px 0;"><a href="mailto:${authorEmail}">${authorEmail}</a></td></tr>
          <tr><td style="padding: 8px 0; color: #6b7280;">Category</td><td style="padding: 8px 0;">${category}</td></tr>
          <tr><td style="padding: 8px 0; color: #6b7280;">Level</td><td style="padding: 8px 0;">${level}</td></tr>
          <tr><td style="padding: 8px 0; color: #6b7280;">Duration</td><td style="padding: 8px 0;">${duration}</td></tr>
          ${tags && tags.length > 0 ? `<tr><td style="padding: 8px 0; color: #6b7280;">Tags</td><td style="padding: 8px 0;">${tags.join(', ')}</td></tr>` : ''}
          ${videoUrl ? `<tr><td style="padding: 8px 0; color: #6b7280;">Video URL</td><td style="padding: 8px 0;"><a href="${videoUrl}">${videoUrl}</a></td></tr>` : ''}
          ${externalLink ? `<tr><td style="padding: 8px 0; color: #6b7280;">External Link</td><td style="padding: 8px 0;"><a href="${externalLink}">${externalLink}</a></td></tr>` : ''}
        </table>

        <h2 style="color: #1f2937; margin-top: 25px;">Description</h2>
        <p style="background: #f3f4f6; padding: 15px; border-radius: 6px;">${description}</p>

        <h2 style="color: #1f2937; margin-top: 25px;">Suggested Filename</h2>
        <p><code style="background: #fef3c7; padding: 4px 8px; border-radius: 4px;">${slug}.md</code></p>

        <h2 style="color: #1f2937; margin-top: 25px;">Markdown Content</h2>
        <pre style="background: #1f2937; color: #e5e7eb; padding: 15px; border-radius: 6px; overflow-x: auto; font-size: 12px; white-space: pre-wrap;">${markdown.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>

        <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #9ca3af; font-size: 12px;">
          To publish: Save the markdown content as <code>src/content/courses/${slug}.md</code> and change status to "published"
        </p>
      </body>
      </html>
    `;

    // Email to author
    const authorEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"></head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2563eb;">Dzaleka E-Learning</h1>
        </div>

        <p>Hi ${author},</p>

        <p>Thank you for submitting your course <strong>"${title}"</strong> to Dzaleka E-Learning!</p>

        <p>Your course has been received and is now pending review. Our team will review the content and notify you once it's published.</p>

        <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #1e40af;">Course Summary</h3>
          <p><strong>Title:</strong> ${title}</p>
          <p><strong>Category:</strong> ${category}</p>
          <p><strong>Level:</strong> ${level}</p>
          <p><strong>Duration:</strong> ${duration}</p>
        </div>

        <p>If you have any questions, just reply to this email.</p>

        <p>Best regards,<br><strong>Dzaleka E-Learning Team</strong></p>
      </body>
      </html>
    `;

    // Send email to admin
    await resend.emails.send({
      from: 'Dzaleka E-Learning <booking@dzaleka.com>',
      to: ['dzalekaconnect@gmail.com', 'info@mail.dzaleka.com'],
      subject: `New Course Submission: ${title}`,
      html: adminEmailHtml,
      replyTo: authorEmail,
    });

    // Send confirmation to author
    await resend.emails.send({
      from: 'Dzaleka E-Learning <booking@dzaleka.com>',
      to: authorEmail,
      subject: 'Course Submitted - Dzaleka E-Learning',
      html: authorEmailHtml,
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ success: true, slug }),
    };

  } catch (error) {
    console.error('Error processing course submission:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
