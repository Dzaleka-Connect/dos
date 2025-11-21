import { Resend } from 'resend';
import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';

const resend = new Resend(process.env.RESEND_API_KEY);

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  // Handle CORS preflight
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
    const rawBody = event.body || '';
    console.log('Raw body length:', rawBody.length);

    if (!rawBody || rawBody.trim() === '') {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Empty request body' }),
      };
    }

    let body;
    try {
      body = JSON.parse(rawBody);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Invalid JSON in request body' }),
      };
    }

    console.log('Received booking request for:', body.email);

    const name = body.name as string;
    const email = body.email as string;
    const phone = body.phone as string;
    const visitDate = body.visitDate as string;
    const visitTime = body.visitTime as string;
    const groupSize = body.groupSize as string;
    const tourType = body.tourType as string;
    const meetingPoint = body.meetingPoint as string;
    const paymentMethod = body.paymentMethod as string;
    const accessibilityNeeds = body.accessibilityNeeds as string;
    const message = body.message as string;
    const referralSource = body.referralSource as string;

    if (!name || !email || !visitDate || !visitTime || !groupSize || !tourType || !meetingPoint || !paymentMethod) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Missing required fields', received: body }),
      };
    }

    const zones = Array.isArray(body.zones) ? body.zones : (body.zones ? [body.zones] : []);
    const interests = Array.isArray(body.interests) ? body.interests : (body.interests ? [body.interests] : []);

    const date = new Date(visitDate);
    const formattedDate = date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const formattedTime = new Date(`2000-01-01T${visitTime}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    const meetingPointMap: Record<string, string> = {
      'unhcr-office': 'UNHCR Office',
      'appfactory': 'Appfactory',
      'jrs': 'JRS (Jesuit Refugee Service)'
    };

    const paymentMethodMap: Record<string, string> = {
      'airtel-money': 'Airtel Money',
      'tnm-mpamba': 'TNM Mpamba',
      'cash': 'Cash'
    };

    const tourTypeMap: Record<string, string> = {
      'standard': 'Standard',
      'extended': 'Extended',
      'custom': 'Custom'
    };

    const formattedInterests = interests.map((interest: any) =>
      String(interest).split('-').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    );

    const formattedZones = zones.map((zone: any) =>
      String(zone).split('-').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    );

    let pricing = '';
    if (groupSize === '1') {
      pricing = 'MWK 15,000';
    } else if (groupSize === '2-5') {
      pricing = 'MWK 50,000';
    } else if (groupSize === '6-10') {
      pricing = 'MWK 80,000';
    } else {
      pricing = 'Contact us for pricing';
    }

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Visit Dzaleka - Booking Confirmation</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 0; background-color: #f3f4f6;">
        <div style="background: #ffffff; padding: 30px 20px; text-align: center; border-bottom: 4px solid #2563eb;">
          <img src="https://services.dzaleka.com/images/dzaleka-digital-heritage.png" alt="Dzaleka Online Services" style="max-width: 180px; height: auto; margin-bottom: 10px;">
          <h1 style="color: #1e40af; margin: 10px 0 5px 0; font-size: 24px; font-weight: 700;">Visit Dzaleka</h1>
          <p style="color: #6b7280; margin: 0; font-size: 14px;">Booking Confirmation</p>
        </div>

        <div style="background: #ffffff; padding: 30px 20px;">
          <p style="font-size: 16px; margin-bottom: 20px; color: #1f2937;">Hi ${name},</p>

          <p style="font-size: 16px; margin-bottom: 20px; color: #4b5563;">Thanks for booking a tour with us. We've received your request and we're confirming the details below.</p>

          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 3px solid #2563eb;">
            <h2 style="color: #1f2937; font-size: 18px; margin: 0 0 15px 0; font-weight: 600;">Tour Details</h2>

            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #6b7280; width: 35%;">Date</td>
                <td style="padding: 8px 0; color: #1f2937; font-weight: 500;">${formattedDate}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">Time</td>
                <td style="padding: 8px 0; color: #1f2937; font-weight: 500;">${formattedTime}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">Group Size</td>
                <td style="padding: 8px 0; color: #1f2937; font-weight: 500;">${groupSize} ${groupSize === '1' ? 'person' : 'people'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">Tour Type</td>
                <td style="padding: 8px 0; color: #1f2937; font-weight: 500;">${tourTypeMap[tourType] || tourType}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">Meeting Point</td>
                <td style="padding: 8px 0; color: #1f2937; font-weight: 500;">${meetingPointMap[meetingPoint] || meetingPoint}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">Payment Method</td>
                <td style="padding: 8px 0; color: #1f2937; font-weight: 500;">${paymentMethodMap[paymentMethod] || paymentMethod}</td>
              </tr>
            </table>
          </div>

          ${formattedInterests.length > 0 || formattedZones.length > 0 ? `
          <div style="margin: 25px 0;">
            <h3 style="color: #1f2937; font-size: 16px; margin: 0 0 10px 0; font-weight: 600;">Areas of Interest</h3>
            <ul style="margin: 0; padding-left: 20px; color: #4b5563; line-height: 1.8;">
              ${formattedInterests.map((interest: string) => `<li style="margin: 5px 0;">${interest}</li>`).join('')}
              ${formattedZones.map((zone: string) => `<li style="margin: 5px 0;">${zone}</li>`).join('')}
            </ul>
          </div>
          ` : ''}

          ${message ? `
          <div style="margin: 25px 0;">
            <h3 style="color: #1f2937; font-size: 16px; margin: 0 0 10px 0; font-weight: 600;">Your Message</h3>
            <div style="background: #f9fafb; padding: 15px; border-radius: 6px; border-left: 3px solid #d1d5db;">
              <p style="color: #4b5563; margin: 0; line-height: 1.6; white-space: pre-wrap;">${message}</p>
            </div>
          </div>
          ` : ''}

          <div style="background: #fffbeb; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 3px solid #f59e0b;">
            <h3 style="color: #1f2937; font-size: 16px; margin: 0 0 10px 0; font-weight: 600;">Pricing</h3>
            <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">Standard rates (up to 2 hours):</p>
            <table style="width: 100%; font-size: 14px;">
              <tr>
                <td style="padding: 4px 0; color: #6b7280;">1 person</td>
                <td style="padding: 4px 0; color: #1f2937; text-align: right;">MWK 15,000</td>
              </tr>
              <tr>
                <td style="padding: 4px 0; color: #6b7280;">2-5 people</td>
                <td style="padding: 4px 0; color: #1f2937; text-align: right;">MWK 50,000</td>
              </tr>
              <tr>
                <td style="padding: 4px 0; color: #6b7280;">6-10 people</td>
                <td style="padding: 4px 0; color: #1f2937; text-align: right;">MWK 80,000</td>
              </tr>
              <tr>
                <td style="padding: 4px 0; color: #6b7280;">Extra hour</td>
                <td style="padding: 4px 0; color: #1f2937; text-align: right;">MWK 10,000</td>
              </tr>
              <tr style="border-top: 1px solid #fbbf24;">
                <td style="padding: 8px 0 0 0; color: #1f2937; font-weight: 600;">Your cost</td>
                <td style="padding: 8px 0 0 0; color: #1f2937; font-weight: 600; text-align: right;">${pricing}</td>
              </tr>
            </table>
          </div>

          ${accessibilityNeeds ? `
          <div style="margin: 25px 0;">
            <h3 style="color: #1f2937; font-size: 16px; margin: 0 0 10px 0; font-weight: 600;">Accessibility</h3>
            <p style="color: #4b5563; margin: 0; line-height: 1.6;">${accessibilityNeeds}</p>
          </div>
          ` : `
          <div style="margin: 25px 0;">
            <h3 style="color: #1f2937; font-size: 16px; margin: 0 0 10px 0; font-weight: 600;">Accessibility</h3>
            <p style="color: #4b5563; margin: 0; line-height: 1.6;">No specific accessibility needs noted. Let us know if anything changes.</p>
          </div>
          `}

          <div style="background: #fef3c7; padding: 15px; border-radius: 6px; margin: 25px 0;">
            <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.6;">
              <strong>What's next:</strong> We'll send you a follow-up email with your itinerary and tour guide details.
            </p>
          </div>

          <p style="font-size: 15px; margin: 20px 0 5px 0; color: #4b5563;">Before your visit, check out:</p>
          <ul style="margin: 5px 0 20px 0; padding-left: 20px; color: #4b5563;">
            <li style="margin: 5px 0;">
              <a href="https://services.dzaleka.com/visit/guidelines" style="color: #2563eb; text-decoration: none;">Visitor Guidelines</a>
            </li>
            <li style="margin: 5px 0;">
              <a href="https://services.dzaleka.com/visit/travel-guide" style="color: #2563eb; text-decoration: none;">Travel Guide</a>
            </li>
          </ul>

          <p style="font-size: 15px; margin: 25px 0 5px 0; color: #4b5563;">Questions? Just reply to this email.</p>

          <p style="font-size: 15px; margin: 20px 0 0 0; color: #1f2937;">
            Best,<br>
            <strong>Dzaleka Online Services</strong>
          </p>
        </div>

        <div style="background: #f3f4f6; color: #1f2937; padding: 30px 20px; text-align: center; border-top: 1px solid #e5e7eb;">
          <img src="https://services.dzaleka.com/images/dzaleka-digital-heritage.png" alt="Dzaleka" style="max-width: 120px; height: auto; margin-bottom: 15px;">
          <p style="margin: 10px 0 5px 0; font-size: 16px; font-weight: 600; color: #1f2937;">Dzaleka Online Services</p>
          <p style="margin: 5px 0 15px 0; font-size: 14px; color: #6b7280;">Dzaleka Refugee Camp, Dowa District, Malawi</p>

          <div style="margin: 20px 0; padding: 15px 0; border-top: 1px solid #e5e7eb; border-bottom: 1px solid #e5e7eb;">
            <p style="margin: 0 0 10px 0; font-size: 13px; color: #6b7280; font-weight: 600;">Quick Links</p>
            <div style="margin: 5px 0;">
              <a href="https://services.dzaleka.com" style="color: #2563eb; text-decoration: none; margin: 0 8px; font-size: 13px;">Home</a>
              <span style="color: #d1d5db;">•</span>
              <a href="https://services.dzaleka.com/visit" style="color: #2563eb; text-decoration: none; margin: 0 8px; font-size: 13px;">Visit</a>
              <span style="color: #d1d5db;">•</span>
              <a href="https://services.dzaleka.com/services" style="color: #2563eb; text-decoration: none; margin: 0 8px; font-size: 13px;">Services</a>
              <span style="color: #d1d5db;">•</span>
              <a href="https://services.dzaleka.com/news" style="color: #2563eb; text-decoration: none; margin: 0 8px; font-size: 13px;">News</a>
            </div>
          </div>

          <p style="margin: 15px 0 0 0; font-size: 12px; color: #9ca3af;">
            © ${new Date().getFullYear()} Dzaleka Online Services. All rights reserved.
          </p>
        </div>
      </body>
      </html>
    `;

    const { data, error } = await resend.emails.send({
      from: 'Dzaleka Online Services <booking@dzaleka.com>',
      to: email,
      bcc: ['dzalekaconnect@gmail.com', 'info@mail.dzaleka.com'],
      subject: `Visit Dzaleka - Booking Confirmation for ${formattedDate}`,
      html: emailHtml,
    });

    if (error) {
      console.error('Resend error:', error);
      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Failed to send confirmation email' }),
      };
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ success: true, data }),
    };

  } catch (error) {
    console.error('Error processing booking:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
