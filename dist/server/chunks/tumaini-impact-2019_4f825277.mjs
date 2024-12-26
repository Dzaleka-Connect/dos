import { f as createComponent, i as renderTemplate, m as maybeRenderHead, u as unescapeHTML } from './astro_80255e7d.mjs';
import 'clsx';

const html = "";

				const frontmatter = {"title":"Tumaini Festival Impact Report 2019","description":"Analysis of the social and economic impact of the 2019 Tumaini Festival on Dzaleka community.","date":"2020-01-15T00:00:00.000Z","category":"Reports","fileType":"pdf","resourceUrl":"/public/resources/pdf/Tumaini-Letu-2019-Impact-Report.pdf","downloadUrl":"https://tumainiletu.org/wp-content/uploads/2021/10/Tumaini-Letu-2019-Impact-Report.pdf","fileSize":"3.8 MB","lastUpdated":"2020-01-15T00:00:00.000Z","languages":["English"],"featured":false,"author":"Tumaini Letu Research Team"};
				const file = "/Users/bakari/Downloads/dzaleka heritage archive/src/content/resources/tumaini-impact-2019.md";
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
