import { withNewsRequest, NewsUnavailable } from './lib/news/public-client.mjs';
import { defineMiddleware } from 'astro:middleware';
import { discoveryLinks } from './data/agentDiscovery';
import { convertHtmlToMarkdown, estimateMarkdownTokens } from './utils/markdownForAgents';
import { withCdnCaching } from './utils/cdnCaching';

function appendVary(headers: Headers, value: string) {
  const existing = headers
    .get('Vary')
    ?.split(',')
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean) ?? [];

  if (!existing.includes(value.toLowerCase())) {
    headers.append('Vary', value);
  }
}

function appendDiscoveryHeaders(headers: Headers) {
  for (const link of discoveryLinks) {
    headers.append('Link', `<${link.href}>; rel="${link.rel}"; type="${link.type}"`);
  }
}

function isHtmlResponse(response: Response) {
  const contentType = response.headers.get('Content-Type')?.toLowerCase() ?? '';
  return contentType.includes('text/html');
}

function wantsMarkdown(request: Request) {
  const accept = request.headers.get('Accept')?.toLowerCase() ?? '';
  return request.method === 'GET' && accept.includes('text/markdown');
}

export const onRequest = defineMiddleware((context, next) => withNewsRequest(async () => {
  if (context.url.pathname.startsWith('/_emdash/')) return next();
  let response: Response;
  try { response = await next(); }
  catch (error) {
    if (!(error instanceof NewsUnavailable)) throw error;
    return new Response('News is temporarily unavailable. Please try again shortly.', {
      status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store', 'Retry-After': '30' },
    });
  }
  if (!context.isPrerendered) response = withCdnCaching(context.request, context.url.pathname, response, wantsMarkdown(context.request));

  if (!isHtmlResponse(response) || (response.status >= 300 && response.status < 400)) {
    return response;
  }

  const headers = new Headers(response.headers);
  appendVary(headers, 'Accept');
  appendDiscoveryHeaders(headers);

  if (!wantsMarkdown(context.request)) {
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  }

  const html = await response.text();
  const markdown = convertHtmlToMarkdown(html, { url: context.url });

  headers.set('Content-Type', 'text/markdown; charset=utf-8');
  headers.set('x-markdown-tokens', estimateMarkdownTokens(markdown).toString());
  headers.delete('Content-Length');
  headers.delete('Content-Encoding');

  return new Response(markdown, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}));
