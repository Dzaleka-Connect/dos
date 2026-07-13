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
    const {
      type,
      title,
      category,
      description,
      price,
      priceAmount,
      currency,
      priceType,
      condition,
      availability,
      imageUrl,
      vendor,
      deliveryOptions,
      shipping,
      paymentMethods,
      tags,
    } = body;

    if (!title || !type || !category || !description || !vendor?.name || !vendor?.phone || !vendor?.location) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: false, message: 'Missing required fields' }),
      };
    }

    // Send notification email to admin
    await resend.emails.send({
      from: 'Dzaleka Marketplace <marketplace@dzaleka.com>',
      to: 'dzalekaconnect@gmail.com',
      subject: `New Marketplace Listing: ${title}`,
      html: `
        <h1>New Marketplace Submission</h1>
        <h2>Listing Details</h2>
        <table style="border-collapse: collapse; width: 100%;">
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Type</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${type}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Title</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${title}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Category</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${category}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Price</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${price || 'Not specified'} (${priceType})</td></tr>
          ${priceAmount ? `<tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Structured Price</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${priceAmount} ${currency}</td></tr>` : ''}
          ${availability ? `<tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Availability</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${availability}</td></tr>` : ''}
          ${condition ? `<tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Condition</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${condition}</td></tr>` : ''}
          ${imageUrl ? `<tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Image</strong></td><td style="padding: 8px; border: 1px solid #ddd;"><a href="${imageUrl}">${imageUrl}</a></td></tr>` : ''}
        </table>

        <h3>Description</h3>
        <p style="white-space: pre-wrap;">${description}</p>

        <h2>Vendor Information</h2>
        <table style="border-collapse: collapse; width: 100%;">
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Name</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${vendor.name}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Phone</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${vendor.phone}</td></tr>
          ${vendor.whatsapp ? `<tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>WhatsApp</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${vendor.whatsapp}</td></tr>` : ''}
          ${vendor.email ? `<tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Email</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${vendor.email}</td></tr>` : ''}
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Location</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${vendor.location}</td></tr>
        </table>

        ${deliveryOptions?.length ? `<p><strong>Delivery Options:</strong> ${deliveryOptions.join(', ')}</p>` : ''}
        ${shipping ? `<p><strong>Delivery Details:</strong> ${shipping.cost} ${shipping.currency} to ${shipping.country}; ${shipping.handlingDays} preparation day(s), ${shipping.transitDays} delivery day(s)</p>` : ''}
        ${paymentMethods?.length ? `<p><strong>Payment Methods:</strong> ${paymentMethods.join(', ')}</p>` : ''}
        ${tags?.length ? `<p><strong>Tags:</strong> ${tags.join(', ')}</p>` : ''}

        <hr />
        <p style="color: #666;">This listing needs to be reviewed and added to the marketplace content.</p>
      `
    });

    // Send confirmation to vendor if email provided
    if (vendor.email) {
      await resend.emails.send({
        from: 'Dzaleka Marketplace <marketplace@dzaleka.com>',
        to: vendor.email,
        subject: `Listing Received: ${title}`,
        html: `
          <h1>Thank You for Your Submission!</h1>
          <p>Hi ${vendor.name},</p>
          <p>We've received your listing for <strong>${title}</strong>.</p>
          <p>Our team will review it shortly. Once approved, your listing will appear on the Dzaleka Marketplace.</p>
          <p>We'll notify you when your listing goes live.</p>
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
      body: JSON.stringify({ success: true, message: 'Listing submitted successfully' }),
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
