import type { APIRoute } from 'astro';
import { checkSubmission } from './guard';
export function protectedSubmission(handler: APIRoute): APIRoute {
  return async context => {
    const rejected = await checkSubmission(context.request.clone(), context.clientAddress);
    return rejected || handler(context);
  };
}
