import { load } from 'cheerio';

type ConvertOptions = {
  url: URL;
};

const BLOCK_TAGS = new Set([
  'article',
  'aside',
  'blockquote',
  'div',
  'figure',
  'footer',
  'header',
  'li',
  'main',
  'nav',
  'ol',
  'p',
  'pre',
  'section',
  'table',
  'tbody',
  'td',
  'th',
  'thead',
  'tr',
  'ul',
]);

const INLINE_TAGS = new Set([
  'a',
  'b',
  'code',
  'em',
  'i',
  'span',
  'small',
  'strong',
  'sub',
  'sup',
]);

function normalizeText(value: string) {
  return value.replace(/\s+/g, ' ').trim();
}

function absolutize(url: string | undefined, baseUrl: URL) {
  if (!url) {
    return '';
  }

  try {
    return new URL(url, baseUrl).toString();
  } catch {
    return url;
  }
}

function escapeMarkdown(value: string) {
  return value.replace(/([\\`*_{}\[\]()#+\-.!|>])/g, '\\$1');
}

function renderInline($: ReturnType<typeof load>, node: any, baseUrl: URL): string {
  if (!node) {
    return '';
  }

  if (node.type === 'text') {
    return node.data?.replace(/\s+/g, ' ') ?? '';
  }

  if (node.type !== 'tag') {
    return '';
  }

  const tag = node.tagName?.toLowerCase();
  const children = () => node.children?.map((child: any) => renderInline($, child, baseUrl)).join('') ?? '';

  switch (tag) {
    case 'a': {
      const text = normalizeText(children()) || absolutize(node.attribs?.href, baseUrl);
      const href = absolutize(node.attribs?.href, baseUrl);
      return href ? `[${text}](${href})` : text;
    }
    case 'strong':
    case 'b': {
      const text = normalizeText(children());
      return text ? `**${text}**` : '';
    }
    case 'em':
    case 'i': {
      const text = normalizeText(children());
      return text ? `*${text}*` : '';
    }
    case 'code': {
      const text = normalizeText($(node).text());
      return text ? `\`${text.replace(/`/g, '\\`')}\`` : '';
    }
    case 'br':
      return '\n';
    case 'img': {
      const alt = normalizeText(node.attribs?.alt || 'Image');
      const src = absolutize(node.attribs?.src, baseUrl);
      return src ? `![${alt}](${src})` : alt;
    }
    default:
      return children();
  }
}

function renderList($: ReturnType<typeof load>, node: any, baseUrl: URL, depth = 0): string {
  const ordered = node.tagName?.toLowerCase() === 'ol';
  const items = $(node)
    .children('li')
    .toArray()
    .map((item, index) => {
      const prefix = ordered ? `${index + 1}. ` : '- ';
      const inline = normalizeText(
        $(item)
          .contents()
          .toArray()
          .filter((child) => {
            const tag = child.type === 'tag' ? child.tagName?.toLowerCase() : '';
            return !['ol', 'ul'].includes(tag || '');
          })
          .map((child) => renderInline($, child, baseUrl))
          .join(' ')
      );

      const nested = $(item)
        .children('ol, ul')
        .toArray()
        .map((child) => renderList($, child, baseUrl, depth + 1))
        .filter(Boolean)
        .join('\n');

      const line = `${'  '.repeat(depth)}${prefix}${inline}`.trimEnd();
      return nested ? `${line}\n${nested}` : line;
    });

  return items.join('\n');
}

function renderTable($: ReturnType<typeof load>, node: any, baseUrl: URL): string {
  const rows = $(node)
    .find('tr')
    .toArray()
    .map((row) =>
      $(row)
        .children('th, td')
        .toArray()
        .map((cell) => normalizeText($(cell).text()) || renderInline($, cell, baseUrl))
    )
    .filter((row) => row.length > 0);

  if (rows.length === 0) {
    return '';
  }

  const [header, ...body] = rows;
  const headerLine = `| ${header.join(' | ')} |`;
  const divider = `| ${header.map(() => '---').join(' | ')} |`;
  const bodyLines = body.map((row) => `| ${row.join(' | ')} |`);
  return [headerLine, divider, ...bodyLines].join('\n');
}

function renderBlock($: ReturnType<typeof load>, node: any, baseUrl: URL): string {
  if (!node) {
    return '';
  }

  if (node.type === 'text') {
    return normalizeText(node.data || '');
  }

  if (node.type !== 'tag') {
    return '';
  }

  const tag = node.tagName?.toLowerCase();

  if (INLINE_TAGS.has(tag)) {
    return normalizeText(renderInline($, node, baseUrl));
  }

  switch (tag) {
    case 'h1':
    case 'h2':
    case 'h3':
    case 'h4':
    case 'h5':
    case 'h6': {
      const level = Number(tag.slice(1));
      const text = normalizeText($(node).text());
      return text ? `${'#'.repeat(level)} ${text}` : '';
    }
    case 'p': {
      return normalizeText(
        $(node)
          .contents()
          .toArray()
          .map((child) => renderInline($, child, baseUrl))
          .join(' ')
      );
    }
    case 'ul':
    case 'ol':
      return renderList($, node, baseUrl);
    case 'blockquote': {
      const content = $(node)
        .contents()
        .toArray()
        .map((child) => renderBlock($, child, baseUrl))
        .filter(Boolean)
        .join('\n')
        .split('\n')
        .map((line) => `> ${line}`)
        .join('\n');
      return content;
    }
    case 'pre': {
      const code = $(node).find('code').first();
      const text = code.length ? code.text() : $(node).text();
      const language = code.attr('class')?.match(/language-([\w-]+)/)?.[1] || '';
      return `\`\`\`${language}\n${text.trim()}\n\`\`\``;
    }
    case 'hr':
      return '---';
    case 'img': {
      return renderInline($, node, baseUrl);
    }
    case 'table':
      return renderTable($, node, baseUrl);
    default: {
      const children = $(node)
        .contents()
        .toArray()
        .map((child) => renderBlock($, child, baseUrl))
        .filter(Boolean);

      if (children.length === 0) {
        return '';
      }

      if (BLOCK_TAGS.has(tag)) {
        return children.join('\n\n');
      }

      return normalizeText(children.join(' '));
    }
  }
}

export function convertHtmlToMarkdown(html: string, options: ConvertOptions) {
  const $ = load(html);

  $('script, style, noscript, template').remove();
  $('header[role="banner"], footer, nav[aria-label="Primary"], nav[aria-label="Footer"]').remove();
  $('.sr-only').remove();

  const title = normalizeText($('title').first().text()).replace(/\s+\|\s+Dzaleka Online Services$/, '');
  const main = $('#main-content').first();
  const root = main.length ? main : $('body').first();

  const blocks = root
    .contents()
    .toArray()
    .map((node) => renderBlock($, node, options.url))
    .flatMap((chunk) => chunk.split('\n\n'))
    .map((chunk) => chunk.trim())
    .filter(Boolean);

  const frontmatter = [
    '---',
    `title: ${JSON.stringify(title || 'Dzaleka Online Services')}`,
    `url: ${JSON.stringify(options.url.toString())}`,
    '---',
    '',
  ].join('\n');

  return `${frontmatter}${blocks.join('\n\n')}\n`;
}

export function estimateMarkdownTokens(markdown: string) {
  return Math.max(1, Math.ceil(markdown.length / 4));
}
