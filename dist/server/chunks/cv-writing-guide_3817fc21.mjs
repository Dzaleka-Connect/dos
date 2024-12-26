import { f as createComponent, i as renderTemplate, m as maybeRenderHead, u as unescapeHTML } from './astro_80255e7d.mjs';
import 'clsx';

const html = "";

				const frontmatter = {"title":"CV Writing Guide","description":"Learn how to create a compelling CV that highlights your skills and experience effectively.","date":"2024-01-10T00:00:00.000Z","category":"Career Development","fileType":"pdf","resourceUrl":"/guides/cv-writing-guide.pdf","downloadUrl":"/downloads/cv-writing-guide.pdf","fileSize":"1.2 MB","lastUpdated":"2024-02-10T00:00:00.000Z","languages":["English","French"],"featured":true,"author":"Career Services Department"};
				const file = "/Users/bakari/Downloads/dzaleka heritage archive/src/content/resources/cv-writing-guide.md";
				const url = undefined;
				function rawContent() {
					return "";
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
