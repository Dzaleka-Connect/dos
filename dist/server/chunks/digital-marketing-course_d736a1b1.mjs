import { f as createComponent, i as renderTemplate, m as maybeRenderHead, u as unescapeHTML } from './astro_80255e7d.mjs';
import 'clsx';

const html = "";

				const frontmatter = {"title":"Digital Marketing Course Materials","description":"Comprehensive course materials covering social media marketing, SEO, and content strategy.","date":"2024-01-15T00:00:00.000Z","category":"Education","fileType":"zip","resourceUrl":"/courses/digital-marketing-2024.zip","downloadUrl":"/downloads/digital-marketing-2024.zip","fileSize":"450 MB","lastUpdated":"2024-02-20T00:00:00.000Z","languages":["English"],"featured":true,"author":"TakenoLab Digital Team"};
				const file = "/Users/bakari/Downloads/dzaleka heritage archive/src/content/resources/digital-marketing-course.md";
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
