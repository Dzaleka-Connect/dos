import { f as createComponent, i as renderTemplate, m as maybeRenderHead, u as unescapeHTML } from './astro_80255e7d.mjs';
import 'clsx';

const html = "<h2 id=\"about-world-food-programme\">About World Food Programme</h2>\n<p>Food assistance for refugees in Malawi.</p>\n<h3 id=\"services\">Services</h3>\n<ul>\n<li>Emergency assistance</li>\n<li>Basic needs support</li>\n<li>Protection services</li>\n<li>Community support</li>\n</ul>";

				const frontmatter = {"title":"World Food Programme","category":"Humanitarian Aid","description":"Leading humanitarian organization providing food assistance and improving food security.","location":{"address":"United Nations World Food Programme Family Dental Clinic, Area 14 Compound City Centre, P.O. Box 30571","city":"Lilongwe","coordinates":{"lat":-13.7833,"lng":33.9833}},"contact":{"email":"WFP.Lilongwe@wfp.org","phone":"+ 265 (0) 1 774 666","hours":"Monday-Friday, 8:00 AM - 5:00 PM"},"socialMedia":{"facebook":"","twitter":"https://twitter.com/WFP_Malawi","instagram":"","linkedin":"","website":"https://www.wfp.org/countries/malawi"},"logo":"https://cdn-images-1.medium.com/max/1200/1*1ZF1lEpi9odcxZz2jgmI6g.png","featured":true,"verified":true,"lastUpdated":"2024-12-24T00:00:00.000Z"};
				const file = "/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/world-food-programme.md";
				const url = undefined;
				function rawContent() {
					return "\n## About World Food Programme\n\nFood assistance for refugees in Malawi.\n\n###  Services\n- Emergency assistance\n- Basic needs support\n- Protection services\n- Community support\n";
				}
				function compiledContent() {
					return html;
				}
				function getHeadings() {
					return [{"depth":2,"slug":"about-world-food-programme","text":"About World Food Programme"},{"depth":3,"slug":"services","text":"Services"}];
				}

				const Content = createComponent((result, _props, slots) => {
					const { layout, ...content } = frontmatter;
					content.file = file;
					content.url = url;

					return renderTemplate`${maybeRenderHead()}${unescapeHTML(html)}`;
				});

export { Content, compiledContent, Content as default, file, frontmatter, getHeadings, rawContent, url };
