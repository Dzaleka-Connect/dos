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
      name,
      email,
      tour_date,
      tour_guide,
      country,
      purpose,
      group_size,
      heard_about,
      overall_rating,
      guide_rating,
      enjoyed_most,
      improvements,
      would_recommend,
      visit_again,
      additional_comments,
      photo_consent,
      allow_testimonial,
    } = body;

    if (!name || !email) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Name and email are required' }),
      };
    }

    const formattedDate = tour_date ? new Date(tour_date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }) : 'Not specified';

    // Email to visitor
    const visitorEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 0; background-color: #f3f4f6;">
        <div style="background: #ffffff; padding: 30px 20px; text-align: center; border-bottom: 4px solid #16a34a;">
          <h1 style="color: #16a34a; margin: 10px 0 5px 0; font-size: 24px;">Visit Dzaleka</h1>
          <p style="color: #6b7280; margin: 0; font-size: 14px;">Thank You for Your Feedback</p>
        </div>

        <div style="background: #ffffff; padding: 30px 20px;">
          <p style="font-size: 16px; margin-bottom: 20px;">Hi ${name},</p>

          <p style="font-size: 16px; margin-bottom: 20px; color: #4b5563;">
            Thank you for taking the time to share your feedback about your visit to Dzaleka on ${formattedDate}.
          </p>

          <p style="font-size: 16px; margin-bottom: 20px; color: #4b5563;">
            Your input helps us improve our tours and provide better experiences for future visitors. We truly appreciate your support.
          </p>

          ${allow_testimonial ? `
          <div style="background: #f0fdf4; padding: 15px; border-radius: 6px; margin: 20px 0; border-left: 3px solid #16a34a;">
            <p style="margin: 0; color: #166534; font-size: 14px;">
              Thank you for allowing us to feature your feedback. If selected, we'll reach out before publishing.
            </p>
          </div>
          ` : ''}

          <p style="font-size: 16px; margin: 25px 0 10px 0; color: #4b5563;">
            We hope to see you again soon!
          </p>

          <p style="font-size: 15px; margin: 20px 0 0 0; color: #1f2937;">
            Best regards,<br>
            <strong>Visit Dzaleka Team</strong>
          </p>
        </div>

        <div style="background: #f3f4f6; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="margin: 0; font-size: 14px; color: #6b7280;">Dzaleka Online Services</p>
          <p style="margin: 5px 0 0 0; font-size: 12px; color: #9ca3af;">Dzaleka Refugee Camp, Dowa District, Malawi</p>
        </div>
      </body>
      </html>
    `;

    // Email to admin
    const adminEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #16a34a; border-bottom: 2px solid #16a34a; padding-bottom: 10px;">New Tour Feedback</h1>

        <h2 style="color: #1f2937; margin-top: 25px;">Visitor Details</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; color: #6b7280; width: 40%;">Name</td><td style="padding: 8px 0;"><strong>${name}</strong></td></tr>
          <tr><td style="padding: 8px 0; color: #6b7280;">Email</td><td style="padding: 8px 0;">${email}</td></tr>
          <tr><td style="padding: 8px 0; color: #6b7280;">Country</td><td style="padding: 8px 0;">${country || 'Not specified'}</td></tr>
          <tr><td style="padding: 8px 0; color: #6b7280;">Visit Date</td><td style="padding: 8px 0;">${formattedDate}</td></tr>
          <tr><td style="padding: 8px 0; color: #6b7280;">Tour Guide</td><td style="padding: 8px 0;">${tour_guide || 'Not specified'}</td></tr>
          <tr><td style="padding: 8px 0; color: #6b7280;">Purpose</td><td style="padding: 8px 0;">${purpose || 'Not specified'}</td></tr>
          <tr><td style="padding: 8px 0; color: #6b7280;">Group Size</td><td style="padding: 8px 0;">${group_size || 'Not specified'}</td></tr>
          <tr><td style="padding: 8px 0; color: #6b7280;">Heard About Us</td><td style="padding: 8px 0;">${heard_about || 'Not specified'}</td></tr>
        </table>

        <h2 style="color: #1f2937; margin-top: 25px;">Ratings</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; color: #6b7280; width: 40%;">Overall Experience</td><td style="padding: 8px 0;"><strong>${overall_rating || 'Not rated'}</strong></td></tr>
          <tr><td style="padding: 8px 0; color: #6b7280;">Tour Guide</td><td style="padding: 8px 0;"><strong>${guide_rating || 'Not rated'}</strong></td></tr>
          <tr><td style="padding: 8px 0; color: #6b7280;">Would Recommend</td><td style="padding: 8px 0;">${would_recommend || 'Not specified'}</td></tr>
          <tr><td style="padding: 8px 0; color: #6b7280;">Would Visit Again</td><td style="padding: 8px 0;">${visit_again || 'Not specified'}</td></tr>
        </table>

        <h2 style="color: #1f2937; margin-top: 25px;">Feedback</h2>

        ${enjoyed_most ? `
        <div style="margin: 15px 0;">
          <p style="color: #6b7280; margin: 0 0 5px 0; font-size: 14px;">What they enjoyed most:</p>
          <div style="background: #f0fdf4; padding: 15px; border-radius: 6px;">
            <p style="margin: 0; color: #166534;">${enjoyed_most}</p>
          </div>
        </div>
        ` : ''}

        ${improvements ? `
        <div style="margin: 15px 0;">
          <p style="color: #6b7280; margin: 0 0 5px 0; font-size: 14px;">Suggestions for improvement:</p>
          <div style="background: #fef3c7; padding: 15px; border-radius: 6px;">
            <p style="margin: 0; color: #92400e;">${improvements}</p>
          </div>
        </div>
        ` : ''}

        ${additional_comments ? `
        <div style="margin: 15px 0;">
          <p style="color: #6b7280; margin: 0 0 5px 0; font-size: 14px;">Additional comments:</p>
          <div style="background: #f3f4f6; padding: 15px; border-radius: 6px;">
            <p style="margin: 0;">${additional_comments}</p>
          </div>
        </div>
        ` : ''}

        <h2 style="color: #1f2937; margin-top: 25px;">Permissions</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; color: #6b7280; width: 40%;">Photo Consent</td><td style="padding: 8px 0;">${photo_consent ? '✅ Yes' : '❌ No'}</td></tr>
          <tr><td style="padding: 8px 0; color: #6b7280;">Testimonial Consent</td><td style="padding: 8px 0;">${allow_testimonial ? '✅ Yes' : '❌ No'}</td></tr>
        </table>

        <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #9ca3af; font-size: 12px;">
          Submitted on ${new Date().toLocaleString()}
        </p>
      </body>
      </html>
    `;

    // Send confirmation to visitor
    await resend.emails.send({
      from: 'Visit Dzaleka <booking@dzaleka.com>',
      to: email,
      subject: 'Thank You for Your Feedback - Visit Dzaleka',
      html: visitorEmailHtml,
    });

    // Send notification to admin
    await resend.emails.send({
      from: 'Visit Dzaleka <booking@dzaleka.com>',
      to: ['dzalekaconnect@gmail.com', 'info@mail.dzaleka.com'],
      subject: `Tour Feedback: ${overall_rating || 'New'} - ${name}`,
      html: adminEmailHtml,
      replyTo: email,
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ success: true }),
    };

  } catch (error) {
    console.error('Error processing feedback:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
