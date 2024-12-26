import { f as createComponent, i as renderTemplate, m as maybeRenderHead, u as unescapeHTML } from './astro_80255e7d.mjs';
import 'clsx';

const html = "";

				const frontmatter = {"title":"Malawi Refugee Guide","description":"The Malawi Refugee Guide provides an overview of the historical and current circumstances of refugees at Dzaleka Refugee Camp. Designed to inform and educate, the guide also dispels myths and offers insights into life in the camp, covering key topics such as historical context, legal frameworks, living conditions, and the roles of stakeholders.","date":"2024-01-20T00:00:00.000Z","category":"Reports","fileType":"pdf","resourceUrl":"https://inuaadvocacy.org/wp-content/uploads/2024/12/MALAWI-REFUGEE-GUIDE-DEC-2024.pdf","downloadUrl":"/public/resources/pdf/MALAWI-REFUGEE-GUIDE-DEC-2024 (1).pdf","fileSize":"18 MB","lastUpdated":"2024-12-24T00:00:00.000Z","languages":["English"],"featured":true,"author":"INUA Advocacy"};
				const file = "/Users/bakari/Downloads/dzaleka heritage archive/src/content/resources/malawi-refugee-guide.md";
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
