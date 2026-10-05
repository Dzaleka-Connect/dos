import type { APIRoute } from 'astro';
import { relaySubmission } from '../../lib/submissions/relay';

export const prerender = false;
export const POST: APIRoute = ({ request, clientAddress }) => relaySubmission(request, clientAddress, process.env.DOS_SUBMISSION_SECRET);
