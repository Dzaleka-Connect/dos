import { f as createComponent, i as renderTemplate, m as maybeRenderHead, u as unescapeHTML } from './astro_80255e7d.mjs';
import 'clsx';

const html = "<h2 id=\"about-jrs-malawi\">About JRS Malawi</h2>\n<p>Emergency assistance, education, and psychosocial support for refugees in Dzaleka Camp.</p>\n<h3 id=\"our-services\">Our Services</h3>\n<ul>\n<li>Emergency assistance</li>\n<li>Basic needs support</li>\n<li>Protection services</li>\n<li>Community support</li>\n</ul>\n<h3 id=\"contact-information\">Contact Information</h3>\n<ul>\n<li><strong>Address:</strong> Dzaleka Refugee Camp, Malawi</li>\n<li><strong>Phone:</strong> +265 1 471 102</li>\n<li><strong>Email:</strong> <a href=\"mailto:mwi.director@jrs.net\">mwi.director@jrs.net</a></li>\n</ul>";

				const frontmatter = {"title":"JRS Malawi","category":"Humanitarian Aid","description":"Emergency assistance, education, and psychosocial support for refugees in Dzaleka Camp.","location":{"address":"Dzaleka Refugee Camp","city":"Dowa","coordinates":{"lat":-13.7833,"lng":33.9833}},"contact":{"email":"mwi.director@jrs.net","phone":"+265 1 471 102","hours":"Monday-Friday, 8:00 AM - 5:00 PM"},"socialMedia":{"facebook":"https://www.facebook.com/JRSMalawi/","twitter":"https://twitter.com/jrsusa","instagram":"https://www.instagram.com/jrsusa/","linkedin":"","website":"https://jrs.net/en/country/malawi/"},"logo":"https://assets.impactpool.org/logos/jrs---jesuit-refugee-service-3aff204a-4b51-4324-8e33-5c4c091d58af.svg","featured":false,"lastUpdated":"2024-12-24T00:00:00.000Z"};
				const file = "/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/jrs-malawi.md";
				const url = undefined;
				function rawContent() {
					return "\n## About JRS Malawi\n\nEmergency assistance, education, and psychosocial support for refugees in Dzaleka Camp.\n\n### Our Services\n- Emergency assistance\n- Basic needs support\n- Protection services\n- Community support\n\n### Contact Information\n- **Address:** Dzaleka Refugee Camp, Malawi\n- **Phone:** +265 1 471 102\n- **Email:** mwi.director@jrs.net\n";
				}
				function compiledContent() {
					return html;
				}
				function getHeadings() {
					return [{"depth":2,"slug":"about-jrs-malawi","text":"About JRS Malawi"},{"depth":3,"slug":"our-services","text":"Our Services"},{"depth":3,"slug":"contact-information","text":"Contact Information"}];
				}

				const Content = createComponent((result, _props, slots) => {
					const { layout, ...content } = frontmatter;
					content.file = file;
					content.url = url;

					return renderTemplate`${maybeRenderHead()}${unescapeHTML(html)}`;
				});

export { Content, compiledContent, Content as default, file, frontmatter, getHeadings, rawContent, url };
