import { f as createComponent, i as renderTemplate, m as maybeRenderHead, u as unescapeHTML } from './astro_80255e7d.mjs';
import 'clsx';

const html = "<h2 id=\"about-kibebe\">About Kibebe</h2>\n<p>Supporting refugee artisans and craftspeople.</p>\n<h3 id=\"our-services\">Our Services</h3>\n<ul>\n<li>Business development</li>\n<li>Skills training</li>\n<li>Market access</li>\n<li>Networking opportunities</li>\n</ul>";

				const frontmatter = {"title":"Kibebe","category":"Entrepreneurship","description":"Supporting refugee artisans and craftspeople.","location":{"address":"Dzaleka Refugee Camp","city":"Dowa","coordinates":{"lat":-13.7833,"lng":33.9833}},"contact":{"email":"kibebemarketing@gmail.com","phone":"+265 996 68 15 20","hours":"Monday-Friday, 8:00 AM - 5:00 PM"},"socialMedia":{"facebook":"https://www.facebook.com/Kibebemalawi/","twitter":"","instagram":"https://www.instagram.com/kibebe_malawi/","linkedin":"","website":"https://kibebe.com/"},"logo":"https://kibebe.com/cdn/shop/files/Kibebe_Logo-Line-2_120x@2x.png?v=1613709261","featured":false,"lastUpdated":"2024-12-24T00:00:00.000Z"};
				const file = "/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/kibebe.md";
				const url = undefined;
				function rawContent() {
					return "\n## About Kibebe\n\nSupporting refugee artisans and craftspeople.\n\n### Our Services\n- Business development\n- Skills training\n- Market access\n- Networking opportunities\n\n";
				}
				function compiledContent() {
					return html;
				}
				function getHeadings() {
					return [{"depth":2,"slug":"about-kibebe","text":"About Kibebe"},{"depth":3,"slug":"our-services","text":"Our Services"}];
				}

				const Content = createComponent((result, _props, slots) => {
					const { layout, ...content } = frontmatter;
					content.file = file;
					content.url = url;

					return renderTemplate`${maybeRenderHead()}${unescapeHTML(html)}`;
				});

export { Content, compiledContent, Content as default, file, frontmatter, getHeadings, rawContent, url };
