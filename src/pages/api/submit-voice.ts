import type { APIRoute } from 'astro';
import { Resend } from 'resend';

export const prerender = false;

const resend = new Resend(import.meta.env.RESEND_API_KEY);

export const POST: APIRoute = async ({ request }) => {
    try {
        const body = await request.json();
        const { title, author, category, excerpt, content, tags, image, email } = body;

        // Validate required fields
        if (!title || !author || !content) {
            return new Response(JSON.stringify({
                success: false,
                message: 'Missing required fields'
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Send email notification
        try {
            await resend.emails.send({
                from: 'Dzaleka Online Services <onboarding@dzaleka.com>',
                to: 'dzalekaconnect@gmail.com', // admin email
                subject: `New Community Voice Submission: ${title}`,
                html: `
          <h1>New Story Submission</h1>
          <p><strong>Title:</strong> ${title}</p>
          <p><strong>Author:</strong> ${author}</p>
          <p><strong>Category:</strong> ${category}</p>
          <p><strong>Email:</strong> ${email || 'Not provided'}</p>
          <p><strong>Tags:</strong> ${tags?.join(', ') || 'None'}</p>
          <p><strong>Excerpt:</strong> ${excerpt}</p>
          <hr />
          <h2>Content:</h2>
          <div style="white-space: pre-wrap;">${content}</div>
          ${image ? `<p><strong>Image URL:</strong> <a href="${image}">${image}</a></p>` : ''}
        `
            });
        } catch (emailError) {
            console.error('Error sending email:', emailError);
            // Continue even if email fails, as we might want to log to DB in future
        }

        return new Response(JSON.stringify({
            success: true,
            message: 'Story submitted successfully'
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Submission error:', error);
        return new Response(JSON.stringify({
            success: false,
            message: 'Internal server error'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};
