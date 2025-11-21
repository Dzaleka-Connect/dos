import { Resend } from 'resend';
import type { Handler, HandlerEvent } from '@netlify/functions';

const resend = new Resend(process.env.RESEND_API_KEY);

export const handler: Handler = async (event: HandlerEvent) => {
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
    const { type, name, description, owner, location, hours, menu, paymentMethods, deliveryOptions, logo, coverImage } = body;

    if (!type || !name || !description || !owner?.name || !owner?.phone || !location?.address) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: false, message: 'Missing required fields' }),
      };
    }

    // Format hours for email
    const hoursHtml = hours?.map((h: any) =>
      `<tr><td style="padding: 4px 8px; border: 1px solid #ddd;">${h.day}</td><td style="padding: 4px 8px; border: 1px solid #ddd;">${h.closed ? 'Closed' : `${h.open} - ${h.close}`}</td></tr>`
    ).join('') || '';

    // Format menu for email
    const menuHtml = menu?.map((cat: any) => `
      <h4 style="margin: 16px 0 8px 0;">${cat.category}</h4>
      <ul style="margin: 0; padding-left: 20px;">
        ${cat.items?.map((item: any) => `<li>${item.name} - MWK ${item.price}${item.description ? ` (${item.description})` : ''}</li>`).join('') || ''}
      </ul>
    `).join('') || '';

    // Send notification email to admin
    await resend.emails.send({
      from: 'Dzaleka Marketplace <marketplace@dzaleka.com>',
      to: 'dzalekaconnect@gmail.com',
      subject: `New Business Registration: ${name}`,
      html: `
        <h1>New Business Registration</h1>

        <h2>Business Details</h2>
        <table style="border-collapse: collapse; width: 100%;">
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Type</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${type}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Name</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${name}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Description</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${description}</td></tr>
          ${logo ? `<tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Logo</strong></td><td style="padding: 8px; border: 1px solid #ddd;"><a href="${logo}">${logo}</a></td></tr>` : ''}
          ${coverImage ? `<tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Cover Image</strong></td><td style="padding: 8px; border: 1px solid #ddd;"><a href="${coverImage}">${coverImage}</a></td></tr>` : ''}
        </table>

        <h2>Owner Information</h2>
        <table style="border-collapse: collapse; width: 100%;">
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Name</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${owner.name}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Phone</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${owner.phone}</td></tr>
          ${owner.whatsapp ? `<tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>WhatsApp</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${owner.whatsapp}</td></tr>` : ''}
          ${owner.email ? `<tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Email</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${owner.email}</td></tr>` : ''}
        </table>

        <h2>Location</h2>
        <p><strong>Address:</strong> ${location.address}</p>
        ${location.zone ? `<p><strong>Zone:</strong> ${location.zone}</p>` : ''}
        ${location.landmark ? `<p><strong>Landmark:</strong> ${location.landmark}</p>` : ''}

        ${hoursHtml ? `
        <h2>Business Hours</h2>
        <table style="border-collapse: collapse;">
          ${hoursHtml}
        </table>
        ` : ''}

        ${menuHtml ? `
        <h2>Menu</h2>
        ${menuHtml}
        ` : ''}

        ${paymentMethods?.length ? `<p><strong>Payment Methods:</strong> ${paymentMethods.join(', ')}</p>` : ''}
        ${deliveryOptions?.length ? `<p><strong>Delivery Options:</strong> ${deliveryOptions.join(', ')}</p>` : ''}

        <hr />
        <p style="color: #666;">This business needs to be reviewed and added to the stores collection.</p>
      `
    });

    // Send confirmation to owner if email provided
    if (owner.email) {
      await resend.emails.send({
        from: 'Dzaleka Marketplace <marketplace@dzaleka.com>',
        to: owner.email,
        subject: `Business Registration Received: ${name}`,
        html: `
          <h1>Thank You for Registering!</h1>
          <p>Hi ${owner.name},</p>
          <p>We've received your registration for <strong>${name}</strong>.</p>
          <p>Our team will review your business and get it published soon. We'll notify you when your store page is live.</p>
          <br />
          <p>Best regards,<br />Dzaleka Online Services</p>
        `
      });
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ success: true, message: 'Business registered successfully' }),
    };

  } catch (error) {
    console.error('Submission error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: false, message: 'Internal server error' }),
    };
  }
};
