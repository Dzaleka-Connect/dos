import { f as createComponent, i as renderTemplate, m as maybeRenderHead, u as unescapeHTML } from './astro_80255e7d.mjs';
import 'clsx';

const html = "";

				const frontmatter = {"title":"A Glimpse into Dzaleka Life","description":"A photo documentary showcasing daily life, resilience, and community spirit in Dzaleka Refugee Camp.","date":"2023-12-10T00:00:00.000Z","category":"Documentary","fileType":"pdf","resourceUrl":"/documentaries/dzaleka-life-2024.pdf","downloadUrl":"/downloads/dzaleka-life-2024.pdf","fileSize":"25 MB","lastUpdated":"2024-02-15T00:00:00.000Z","languages":["English","French","Swahili"],"featured":true,"author":"Dzaleka Media Team"};
				const file = "/Users/bakari/Downloads/dzaleka heritage archive/src/content/resources/glimpse-into-dzaleka-life.md";
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
