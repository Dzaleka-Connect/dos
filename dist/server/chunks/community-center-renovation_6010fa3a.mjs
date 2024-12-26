import { f as createComponent, i as renderTemplate, m as maybeRenderHead, u as unescapeHTML } from './astro_80255e7d.mjs';
import 'clsx';

const html = "<p>We are excited to announce the commencement of renovations at our community center. This project aims to improve facilities and create a more welcoming space for community gatherings and activities.</p>";

				const frontmatter = {"title":"Community Center Renovation Project","description":"Exciting updates on the renovation of our community center to better serve the Dzaleka community","date":"2023-12-25T00:00:00.000Z","category":"announcement"};
				const file = "/Users/bakari/Downloads/dzaleka heritage archive/src/content/news/community-center-renovation.md";
				const url = undefined;
				function rawContent() {
					return "\nWe are excited to announce the commencement of renovations at our community center. This project aims to improve facilities and create a more welcoming space for community gatherings and activities.";
				}
				function compiledContent() {
					return html;
				}
				function getHeadings() {
					return [];
				}

				const Content = createComponent((result, _props, slots) => {
					const { layout, ...content } = frontmatter;
					content.file = file;
					content.url = url;

					return renderTemplate`${maybeRenderHead()}${unescapeHTML(html)}`;
				});

export { Content, compiledContent, Content as default, file, frontmatter, getHeadings, rawContent, url };
