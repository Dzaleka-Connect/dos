import type { APIRoute } from 'astro';
import { Resend } from 'resend';

export const prerender = false;

const resend = new Resend(import.meta.env.RESEND_API_KEY || 're_dummy_key');

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const {
      submissionType,
      placeName,
      category,
      zone,
      operator,
      openingHours,
      phone,
      description,
      lat,
      lng,
      submitterName,
      submitterRole,
      submitterEmail,
    } = body;

    // Validate required fields
    if (!placeName || !description) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Missing required place name or description',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const refCode = `DZK-OSM-${Math.floor(100000 + Math.random() * 900000)}`;

    // Send email notification to camp dataset administrators if Resend key is configured
    try {
      if (import.meta.env.RESEND_API_KEY) {
        await resend.emails.send({
          from: 'Dzaleka Online Services <onboarding@dzaleka.com>',
          to: 'dzalekaconnect@gmail.com',
          subject: `[Dzaleka Map Submission] ${submissionType === 'update' ? 'Update' : 'New Place'}: ${placeName}`,
          html: `
            <div style="font-family: sans-serif; padding: 20px; color: #0f172a;">
              <h2 style="color: #059669; margin-top: 0;">New Dzaleka Map Location Node Submission</h2>
              <p>A new community place proposal was submitted for OpenStreetMap verification.</p>
              <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
                <tr><td style="padding: 6px; font-weight: bold; width: 140px;">Reference Code:</td><td style="padding: 6px; font-family: monospace;">${refCode}</td></tr>
                <tr><td style="padding: 6px; font-weight: bold;">Place Name:</td><td style="padding: 6px;">${placeName}</td></tr>
                <tr><td style="padding: 6px; font-weight: bold;">Submission Type:</td><td style="padding: 6px;">${submissionType}</td></tr>
                <tr><td style="padding: 6px; font-weight: bold;">Category:</td><td style="padding: 6px;">${category}</td></tr>
                <tr><td style="padding: 6px; font-weight: bold;">Zone / Sector:</td><td style="padding: 6px;">${zone}</td></tr>
                <tr><td style="padding: 6px; font-weight: bold;">Operator:</td><td style="padding: 6px;">${operator || 'N/A'}</td></tr>
                <tr><td style="padding: 6px; font-weight: bold;">Opening Hours:</td><td style="padding: 6px;">${openingHours || 'N/A'}</td></tr>
                <tr><td style="padding: 6px; font-weight: bold;">Contact Phone:</td><td style="padding: 6px;">${phone || 'N/A'}</td></tr>
                <tr><td style="padding: 6px; font-weight: bold;">GPS Coordinates:</td><td style="padding: 6px; font-family: monospace;">${lat}, ${lng}</td></tr>
                <tr><td style="padding: 6px; font-weight: bold;">Submitted By:</td><td style="padding: 6px;">${submitterName || 'Anonymous'} (${submitterRole})</td></tr>
                <tr><td style="padding: 6px; font-weight: bold;">Email:</td><td style="padding: 6px;">${submitterEmail || 'Not provided'}</td></tr>
              </table>
              <div style="background-color: #f8fafc; border-left: 4px solid #059669; padding: 12px; margin-top: 12px;">
                <strong>Description & Services:</strong><br />
                <p style="margin: 4px 0 0 0; white-space: pre-wrap;">${description}</p>
              </div>
            </div>
          `,
        });
      }
    } catch (emailErr) {
      console.warn('Map submission email notification error (non-fatal):', emailErr);
    }

    return new Response(
      JSON.stringify({
        success: true,
        referenceCode: refCode,
        message: 'Location submission received and queued for review.',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Map submission error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Internal server error processing map submission.',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
