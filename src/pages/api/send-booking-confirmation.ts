import type { APIRoute } from 'astro';
import { Resend } from 'resend';

// Force this route to be server-rendered
export const prerender = false;

const resend = new Resend(import.meta.env.RESEND_API_KEY);

export const POST: APIRoute = async ({ request }) => {
    try {
        // Get the raw text first to check if body exists
        const rawBody = await request.text();
        console.log('Raw body length:', rawBody.length);
        console.log('Raw body preview:', rawBody.substring(0, 100));

        if (!rawBody || rawBody.trim() === '') {
            console.error('Empty request body received');
            return new Response(JSON.stringify({ error: 'Empty request body' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Parse JSON
        let body;
        try {
            body = JSON.parse(rawBody);
        } catch (parseError) {
            console.error('JSON parse error:', parseError);
            console.log('Failed to parse body:', rawBody);
            return new Response(JSON.stringify({ error: 'Invalid JSON in request body' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        console.log('Received booking request for:', body.email);

        // Extract form data from JSON
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

        // Validate required fields
        if (!name || !email || !visitDate || !visitTime || !groupSize || !tourType || !meetingPoint || !paymentMethod) {
            console.error('Missing required fields:', { name, email, visitDate, visitTime, groupSize, tourType, meetingPoint, paymentMethod });
            return new Response(JSON.stringify({ error: 'Missing required fields', received: body }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        console.log('Processing booking for:', email);

        // Get zones and interests (handle both array and single values)
        const zones = Array.isArray(body.zones) ? body.zones : (body.zones ? [body.zones] : []);
        const interests = Array.isArray(body.interests) ? body.interests : (body.interests ? [body.interests] : []);

        // Format date
        const date = new Date(visitDate);
        const formattedDate = date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // Format time
        const formattedTime = new Date(`2000-01-01T${visitTime}`).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });

        // Format meeting point
        const meetingPointMap: Record<string, string> = {
            'unhcr-office': 'UNHCR Office',
            'appfactory': 'Appfactory',
            'jrs': 'JRS (Jesuit Refugee Service)'
        };

        // Format payment method
        const paymentMethodMap: Record<string, string> = {
            'airtel-money': 'Airtel Money',
            'tnm-mpamba': 'TNM Mpamba',
            'cash': 'Cash'
        };

        // Format tour type
        const tourTypeMap: Record<string, string> = {
            'standard': 'Standard',
            'extended': 'Extended',
            'custom': 'Custom'
        };

        // Format interests
        const formattedInterests = interests.map((interest: any) =>
            String(interest).split('-').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
        );

        // Format zones
        const formattedZones = zones.map((zone: any) =>
            String(zone).split('-').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
        );

        // Determine pricing
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

        // Build email HTML
        const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Visit Dzaleka - Booking Confirmation</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 0; background-color: #f3f4f6;">
        <!-- Header with Logo -->
        <div style="background: #ffffff; padding: 30px 20px; text-align: center; border-bottom: 4px solid #2563eb;">
          <img src="https://services.dzaleka.com/images/dzaleka-digital-heritage.png" alt="Dzaleka Online Services" style="max-width: 180px; height: auto; margin-bottom: 10px;">
          <h1 style="color: #1e40af; margin: 10px 0 5px 0; font-size: 24px; font-weight: 700;">Visit Dzaleka</h1>
          <p style="color: #6b7280; margin: 0; font-size: 14px;">Booking Confirmation</p>
        </div>
        
        <!-- Main Content -->
        <div style="background: #ffffff; padding: 30px 20px;">
          <p style="font-size: 16px; margin-bottom: 20px; color: #1f2937;">Hi ${name},</p>
          
          <p style="font-size: 16px; margin-bottom: 20px; color: #4b5563;">Thanks for booking a tour with us. We've received your request and we're confirming the details below.</p>
          
          <!-- Tour Details -->
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
          
          <!-- Pricing -->
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
          
          <!-- Next Steps -->
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
        
        <!-- Footer -->
        <div style="background: #f3f4f6; color: #1f2937; padding: 30px 20px; text-align: center; border-top: 1px solid #e5e7eb;">
          <img src="https://services.dzaleka.com/images/dzaleka-digital-heritage.png" alt="Dzaleka" style="max-width: 120px; height: auto; margin-bottom: 15px;">
          <p style="margin: 10px 0 5px 0; font-size: 16px; font-weight: 600; color: #1f2937;">Dzaleka Online Services</p>
          <p style="margin: 5px 0 15px 0; font-size: 14px; color: #6b7280;">Dzaleka Refugee Camp, Dowa District, Malawi</p>
          
          <!-- Quick Links -->
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
            <div style="margin: 8px 0 0 0;">
              <a href="https://services.dzaleka.com/events" style="color: #2563eb; text-decoration: none; margin: 0 8px; font-size: 13px;">Events</a>
              <span style="color: #d1d5db;">•</span>
              <a href="https://services.dzaleka.com/jobs" style="color: #2563eb; text-decoration: none; margin: 0 8px; font-size: 13px;">Jobs</a>
              <span style="color: #d1d5db;">•</span>
              <a href="https://services.dzaleka.com/about" style="color: #2563eb; text-decoration: none; margin: 0 8px; font-size: 13px;">About</a>
              <span style="color: #d1d5db;">•</span>
              <a href="https://services.dzaleka.com/contact" style="color: #2563eb; text-decoration: none; margin: 0 8px; font-size: 13px;">Contact</a>
            </div>
          </div>
          
          <!-- Social Media -->
          <div style="margin: 20px 0;">
            <p style="margin: 0 0 10px 0; font-size: 13px; color: #6b7280; font-weight: 600;">Follow Us</p>
            <div>
              <a href="https://facebook.com/dzalekaconnect" style="display: inline-block; margin: 0 8px; color: #2563eb; text-decoration: none; font-size: 13px;">Facebook</a>
              <span style="color: #d1d5db;">•</span>
              <a href="https://twitter.com/dzalekaconnect" style="display: inline-block; margin: 0 8px; color: #2563eb; text-decoration: none; font-size: 13px;">Twitter</a>
              <span style="color: #d1d5db;">•</span>
              <a href="https://instagram.com/dzalekaconnect" style="display: inline-block; margin: 0 8px; color: #2563eb; text-decoration: none; font-size: 13px;">Instagram</a>
              <span style="color: #d1d5db;">•</span>
              <a href="https://linkedin.com/company/dzaleka-connect" style="display: inline-block; margin: 0 8px; color: #2563eb; text-decoration: none; font-size: 13px;">LinkedIn</a>
            </div>
          </div>
          
          <p style="margin: 15px 0 0 0; font-size: 12px; color: #9ca3af;">
            © ${new Date().getFullYear()} Dzaleka Online Services. All rights reserved.
          </p>
        </div>
      </body>
      </html>
    `;


        // Send email using Resend
        const { data, error } = await resend.emails.send({
            from: 'Dzaleka Online Services <booking@dzaleka.com>',
            to: email,
            bcc: ['dzalekaconnect@gmail.com', 'info@mail.dzaleka.com'],
            subject: `Visit Dzaleka - Booking Confirmation for ${formattedDate}`,
            html: emailHtml,
        });

        if (error) {
            console.error('Resend error:', error);
            return new Response(JSON.stringify({ error: 'Failed to send confirmation email' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        return new Response(JSON.stringify({ success: true, data }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Error processing booking:', error);
        return new Response(JSON.stringify({ error: 'Internal server error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};
