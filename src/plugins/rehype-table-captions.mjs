// Give each Markdown table a caption for screen readers, taken from the
// heading just before it. Tables that already have a caption are left alone.
const text = (node) => node.type === 'text' ? node.value : (node.children || []).map(text).join('');

export default function rehypeTableCaptions() {
  return (tree) => {
    const visit = (parent) => {
      let heading = null;
      for (const node of parent.children || []) {
        if (node.type !== 'element') continue;
        if (/^h[2-6]$/.test(node.tagName)) heading = text(node).trim();
        else if (node.tagName === 'table') {
          const hasCaption = node.children.some((child) => child.type === 'element' && child.tagName === 'caption');
          if (!hasCaption && heading) {
            node.children.unshift({ type: 'element', tagName: 'caption', properties: { className: ['sr-only'] }, children: [{ type: 'text', value: heading }] });
          }
        } else visit(node);
      }
    };
    visit(tree);
  };
}
