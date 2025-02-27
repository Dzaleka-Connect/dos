import { getAnalyticsData } from '../../../utils/analytics-utils';

export async function GET() {
  try {
    // For server-side, we'll return a default value
    return new Response(JSON.stringify({
      totalViews: 0
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: 'Failed to get page views',
      totalViews: 0
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
} 