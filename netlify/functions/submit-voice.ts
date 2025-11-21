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
    const { title, author, category, excerpt, content, tags, image, email } = body;

    if (!title || !author || !content) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: false,
          message: 'Missing required fields'
        }),
      };
    }

    try {
      await resend.emails.send({
        from: 'Dzaleka Online Services <onboarding@dzaleka.com>',
        to: 'dzalekaconnect@gmail.com',
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
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        success: true,
        message: 'Story submitted successfully'
      }),
    };

  } catch (error) {
    console.error('Submission error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: false,
        message: 'Internal server error'
      }),
    };
  }
};
