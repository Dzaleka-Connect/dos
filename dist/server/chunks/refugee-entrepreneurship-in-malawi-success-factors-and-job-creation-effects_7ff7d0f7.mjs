import { f as createComponent, i as renderTemplate, m as maybeRenderHead, u as unescapeHTML } from './astro_80255e7d.mjs';
import 'clsx';

const html = "";

				const frontmatter = {"title":"Refugee Entrepreneurship in Malawi - Success Factors and Job Creation Effects","description":"A research report examining the factors contributing to successful refugee-led businesses in Malawi and their impact on job creation.","date":"2024-01-25T00:00:00.000Z","category":"Research","fileType":"pdf","resourceUrl":"https://inuaadvocacy.org/wp-content/uploads/2022/02/FDeLeo_Refugee_Entrepreneurship_In_Malawi.pdf","downloadUrl":"/public/resources/pdf/FDeLeo_Refugee_Entrepreneurship_In_Malawi.pdf","fileSize":"3.2 MB","lastUpdated":"2024-01-25T00:00:00.000Z","languages":["English"],"featured":true,"author":"INUA Advocacy, Florisa De Leo"};
				const file = "/Users/bakari/Downloads/dzaleka heritage archive/src/content/resources/refugee-entrepreneurship-in-malawi-success-factors-and-job-creation-effects.md";
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
