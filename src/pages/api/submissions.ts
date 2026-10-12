import { protectedSubmission } from '../../lib/submissions/api-guard';
import type { APIRoute } from 'astro';
import { relaySubmission } from '../../lib/submissions/relay';

export const prerender = false;
const receive: APIRoute = ({ request, clientAddress }) => relaySubmission(request, clientAddress, process.env.DOS_SUBMISSION_SECRET);

export const POST = protectedSubmission(receive);
