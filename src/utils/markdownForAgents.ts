import { parseHTML } from 'linkedom';

type ConvertOptions = {
  url: URL;
};

const BLOCK_TAGS = new Set([
  'ARTICLE',
  'ASIDE',
  'BLOCKQUOTE',
  'DIV',
  'FIGURE',
  'FOOTER',
  'HEADER',
  'LI',
  'MAIN',
  'NAV',
  'OL',
  'P',
  'PRE',
  'SECTION',
  'TABLE',
  'TBODY',
  'TD',
  'TH',
  'THEAD',
  'TR',
  'UL',
]);

const INLINE_TAGS = new Set([
  'A',
  'B',
  'CODE',
  'EM',
  'I',
  'SPAN',
  'SMALL',
  'STRONG',
  'SUB',
  'SUP',
]);

function normalizeText(value: string) {
  return value.replace(/\s+/g, ' ').trim();
}

function absolutize(url: string | null | undefined, baseUrl: URL) {
  if (!url) {
    return '';
  }

  try {
    return new URL(url, baseUrl).toString();
  } catch {
    return url;
  }
}

function renderInline(node: any, baseUrl: URL): string {
  if (!node) {
    return '';
  }

  if (node.nodeType === 3) { // Text node
    return node.nodeValue?.replace(/\s+/g, ' ') ?? '';
  }

  if (node.nodeType !== 1) { // Not an element
    return '';
  }

  const tag = node.tagName.toUpperCase();
  const children = () => Array.from(node.childNodes).map((child: any) => renderInline(child, baseUrl)).join('');

  switch (tag) {
    case 'A': {
      const text = normalizeText(children()) || absolutize(node.getAttribute('href'), baseUrl);
      const href = absolutize(node.getAttribute('href'), baseUrl);
      return href ? `[${text}](${href})` : text;
    }
    case 'STRONG':
    case 'B': {
      const text = normalizeText(children());
      return text ? `**${text}**` : '';
    }
    case 'EM':
    case 'I': {
      const text = normalizeText(children());
      return text ? `*${text}*` : '';
    }
    case 'CODE': {
      const text = normalizeText(node.textContent);
      return text ? `\`${text.replace(/`/g, '\\`')}\`` : '';
    }
    case 'BR':
      return '\n';
    case 'IMG': {
      const alt = normalizeText(node.getAttribute('alt') || 'Image');
      const src = absolutize(node.getAttribute('src'), baseUrl);
      return src ? `![${alt}](${src})` : alt;
    }
    default:
      return children();
  }
}

function renderList(node: any, baseUrl: URL, depth = 0): string {
  const ordered = node.tagName.toUpperCase() === 'OL';
  const items = Array.from(node.children)
    .filter((child: any) => child.tagName.toUpperCase() === 'LI')
    .map((item: any, index) => {
      const prefix = ordered ? `${index + 1}. ` : '- ';
      const inline = normalizeText(
        Array.from(item.childNodes)
          .filter((child: any) => {
            const tag = child.nodeType === 1 ? child.tagName.toUpperCase() : '';
            return !['OL', 'UL'].includes(tag);
          })
          .map((child: any) => renderInline(child, baseUrl))
          .join(' ')
      );

      const nested = Array.from(item.children)
        .filter((child: any) => ['OL', 'UL'].includes(child.tagName.toUpperCase()))
        .map((child) => renderList(child, baseUrl, depth + 1))
        .filter(Boolean)
        .join('\n');

      const line = `${'  '.repeat(depth)}${prefix}${inline}`.trimEnd();
      return nested ? `${line}\n${nested}` : line;
    });

  return items.join('\n');
}

function renderTable(node: any, baseUrl: URL): string {
  const rows = Array.from(node.querySelectorAll('tr'))
    .map((row: any) =>
      Array.from(row.querySelectorAll('th, td'))
        .map((cell: any) => normalizeText(cell.textContent) || renderInline(cell, baseUrl))
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

function renderBlock(node: any, baseUrl: URL): string {
  if (!node) {
    return '';
  }

  if (node.nodeType === 3) {
    return normalizeText(node.nodeValue || '');
  }

  if (node.nodeType !== 1) {
    return '';
  }

  const tag = node.tagName.toUpperCase();

  if (INLINE_TAGS.has(tag)) {
    return normalizeText(renderInline(node, baseUrl));
  }

  switch (tag) {
    case 'H1':
    case 'H2':
    case 'H3':
    case 'H4':
    case 'H5':
    case 'H6': {
      const level = Number(tag.slice(1));
      const text = normalizeText(node.textContent);
      return text ? `${'#'.repeat(level)} ${text}` : '';
    }
    case 'P': {
      return normalizeText(
        Array.from(node.childNodes)
          .map((child) => renderInline(child, baseUrl))
          .join(' ')
      );
    }
    case 'UL':
    case 'OL':
      return renderList(node, baseUrl);
    case 'BLOCKQUOTE': {
      const content = Array.from(node.childNodes)
        .map((child: any) => renderBlock(child, baseUrl))
        .filter(Boolean)
        .join('\n')
        .split('\n')
        .map((line) => `> ${line}`)
        .join('\n');
      return content;
    }
    case 'PRE': {
      const code = node.querySelector('code');
      const text = code ? code.textContent : node.textContent;
      const language = code?.getAttribute('class')?.match(/language-([\w-]+)/)?.[1] || '';
      return `\`\`\`${language}\n${text.trim()}\n\`\`\``;
    }
    case 'HR':
      return '---';
    case 'IMG': {
      return renderInline(node, baseUrl);
    }
    case 'TABLE':
      return renderTable(node, baseUrl);
    default: {
      const children = Array.from(node.childNodes)
        .map((child: any) => renderBlock(child, baseUrl))
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
  const { document } = parseHTML(html);

  // Clean up
  const toRemove = document.querySelectorAll('script, style, noscript, template, header[role="banner"], footer, nav[aria-label="Primary"], nav[aria-label="Footer"], .sr-only');
  toRemove.forEach(el => el.remove());

  const titleNode = document.querySelector('title');
  const title = normalizeText(titleNode?.textContent || '').replace(/\s+\|\s+Dzaleka Online Services$/, '');
  const main = document.querySelector('#main-content');
  const root = main || document.body;

  const blocks = Array.from(root.childNodes)
    .map((node: any) => renderBlock(node, options.url))
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
