import { f as createComponent, i as renderTemplate, m as maybeRenderHead, u as unescapeHTML } from './astro_80255e7d.mjs';
import 'clsx';

const html = "";

				const frontmatter = {"title":"Refugee Relocation Intentions","description":"The documents below are the final outcome of research we carried out recently in Dzaleka, in partnership with the University of Malawi, with funding from Southern New Hampshire University.","date":"2024-02-01T00:00:00.000Z","category":"Research & Report","featured":true,"author":"INUA Advocacy in partnership with the University of Malawi","fileType":"pdf","fileSize":"5.4MB","downloadUrl":"research-brief-february-2022-refugees-relocation-intentions-inua.pdf","resourceUrl":"https://inuaadvocacy.org/wp-content/uploads/2022/03/Research-Brief-February-2022-Refugees-Relocation-Intentions-INUA.pdf","lastUpdated":"2024-12-24T00:00:00.000Z","languages":["English"],"tags":["research","relocation","refugees"]};
				const file = "/Users/bakari/Downloads/dzaleka heritage archive/src/content/resources/research-report-refugee-relocation-intentions.md";
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
