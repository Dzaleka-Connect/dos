import { f as createComponent, i as renderTemplate, m as maybeRenderHead, u as unescapeHTML } from './astro_80255e7d.mjs';
import 'clsx';

const html = "<p>We are proud to highlight the remarkable journey of one of our community’s tech startups, demonstrating the innovative spirit and entrepreneurial drive within Dzaleka.</p>";

				const frontmatter = {"title":"Local Tech Startup Success Story","description":"Celebrating the achievements of a promising tech startup from our community","date":"2023-12-24T00:00:00.000Z","category":"success-story"};
				const file = "/Users/bakari/Downloads/dzaleka heritage archive/src/content/news/tech-startup-success.md";
				const url = undefined;
				function rawContent() {
					return "\nWe are proud to highlight the remarkable journey of one of our community's tech startups, demonstrating the innovative spirit and entrepreneurial drive within Dzaleka.";
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
