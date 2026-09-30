import { lexer } from 'marked';
import { prosemirrorToPortableText } from 'emdash';

function inline(tokens) {
  return tokens.flatMap((token) => {
    if (token.type === 'br') return [{ type: 'hardBreak' }];
    if (token.type === 'text' || token.type === 'escape') {
      return token.tokens ? inline(token.tokens) : token.text ? [{ type: 'text', text: token.text }] : [];
    }
    const mark = { strong: 'bold', em: 'italic', del: 'strike', codespan: 'code', link: 'link' }[token.type];
    if (!mark) throw new Error(`Unsupported inline Markdown: ${token.type}`);
    const nodes = token.tokens ? inline(token.tokens) : [{ type: 'text', text: token.text }];
    return nodes.map((node) => ({ ...node, marks: [...(node.marks || []), {
      type: mark, ...(mark === 'link' ? { attrs: { href: token.href, target: null } } : {}),
    }] }));
  });
}

function blocks(tokens) {
  return tokens.flatMap((token) => {
    switch (token.type) {
      case 'space': return [];
      case 'paragraph': {
        // A paragraph holding only images becomes image blocks (remote images keep their original URL).
        const parts = (token.tokens || []).filter((part) => !(part.type === 'text' && !part.text.trim()) && part.type !== 'br');
        if (parts.length && parts.every((part) => part.type === 'image')) {
          return parts.map((image) => ({ type: 'image', attrs: { provider: 'external', src: image.href, alt: image.text || '', ...(image.title ? { caption: image.title } : {}) } }));
        }
        return [{ type: 'paragraph', content: inline(token.tokens || [token]) }];
      }
      case 'text': return [{ type: 'paragraph', content: inline(token.tokens || [token]) }];
      case 'heading': return [{ type: 'heading', attrs: { level: token.depth }, content: inline(token.tokens) }];
      case 'hr': return [{ type: 'horizontalRule' }];
      case 'code': return [{ type: 'codeBlock', attrs: { language: token.lang || '' }, content: token.text ? [{ type: 'text', text: token.text }] : [] }];
      case 'blockquote': return [{ type: 'blockquote', content: blocks(token.tokens) }];
      case 'list':
        if (token.items.some((item) => item.task)) throw new Error('Task lists need manual import review');
        return [{ type: token.ordered ? 'orderedList' : 'bulletList', attrs: { start: token.start || 1 }, content: token.items.map((item) => ({ type: 'listItem', content: blocks(item.tokens) })) }];
      case 'table': return [{ type: 'table', content: [token.header, ...token.rows].map((row, index) => ({
        type: 'tableRow', content: row.map((cell, column) => ({
          type: index === 0 ? 'tableHeader' : 'tableCell',
          attrs: { colspan: 1, rowspan: 1, textAlign: token.align[column] || null },
          content: [{ type: 'paragraph', content: inline(cell.tokens) }],
        })),
      })) }];
      case 'html': {
        // Video iframes become EmDash embeds; any other raw HTML still needs a person to review it.
        const src = token.raw.match(/^\s*<iframe\b[^>]*\ssrc="([^"]+)"[^>]*>\s*<\/iframe>\s*$/i)?.[1];
        const video = src && /^https:\/\/(www\.)?(youtube\.com\/embed\/|youtube-nocookie\.com\/embed\/|player\.vimeo\.com\/video\/)/.test(src);
        if (!video) throw new Error('Unsupported Markdown block: html. Review before importing.');
        return [{ type: 'embed', attrs: { url: src, provider: src.includes('vimeo') ? 'vimeo' : 'youtube' } }];
      }
      default: throw new Error(`Unsupported Markdown block: ${token.type}. Review before importing.`);
    }
  });
}

export function importMarkdown(markdown) {
  return prosemirrorToPortableText({ type: 'doc', content: blocks(lexer(markdown)) });
}
