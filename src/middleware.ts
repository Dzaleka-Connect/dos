import { defineMiddleware } from 'astro:middleware';
import { discoveryLinks } from './data/agentDiscovery';
import { convertHtmlToMarkdown, estimateMarkdownTokens } from './utils/markdownForAgents';

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

export const onRequest = defineMiddleware(async (context, next) => {
  const response = await next();

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
});
