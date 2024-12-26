import { f as createComponent, i as renderTemplate, m as maybeRenderHead, u as unescapeHTML } from './astro_80255e7d.mjs';
import 'clsx';

const html = "";

				const frontmatter = {"title":"Tumaini Festival Impact Report 2020","description":"Analysis of the social and economic impact of the 2020 Virtual Tumaini Festival.","date":"2021-01-15T00:00:00.000Z","category":"Reports","fileType":"pdf","resourceUrl":"/public/resources/pdf/Tumaini-Letu-Impact-Report-2020-2.pdf","downloadUrl":"https://tumainiletu.org/wp-content/uploads/2022/01/Tumaini-Letu-Impact-Report-2020-2.pdf","fileSize":"4.2 MB","lastUpdated":"2021-01-15T00:00:00.000Z","languages":["English"],"featured":false,"author":"Tumaini Letu Research Team"};
				const file = "/Users/bakari/Downloads/dzaleka heritage archive/src/content/resources/tumaini-impact-2020.md";
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
