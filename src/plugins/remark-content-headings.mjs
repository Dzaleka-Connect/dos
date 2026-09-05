// Page templates provide the h1; authored content starts at the section level.
export default function remarkContentHeadings() {
  return (tree, file) => {
    const path = file.path?.replaceAll('\\', '/');
    if (!path?.includes('/src/content/')) return;
    // These record templates already display the title above the gallery.
    // Remove only a matching opening title; retain authored section headings.
    if (/\/src\/content\/(photos|sites|artworks)\//.test(path)) {
      const first = tree.children?.[0];
      const title = file.data?.astro?.frontmatter?.title;
      const text = node => node.value ?? node.children?.map(text).join('') ?? '';
      const normalize = value => value.trim().replace(/\s+/g, ' ');
      if (typeof title === 'string' && first?.type === 'heading' && first.depth === 1 && normalize(text(first)) === normalize(title)) tree.children.shift();
    }
    const visit = node => {
      if (node.type === 'heading' && node.depth === 1) node.depth = 2;
      node.children?.forEach(visit);
    };
    visit(tree);
  };
}
