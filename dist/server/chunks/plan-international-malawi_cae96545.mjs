import { f as createComponent, i as renderTemplate, m as maybeRenderHead, u as unescapeHTML } from './astro_80255e7d.mjs';
import 'clsx';

const html = "<h2 id=\"about-plan-international-malawi\">About Plan International Malawi</h2>\n<p>Supporting children’s rights and equality for girls.</p>\n<h3 id=\"our-services\">Our Services</h3>\n<ul>\n<li>Emergency assistance</li>\n<li>Basic needs support</li>\n<li>Protection services</li>\n<li>Community support</li>\n</ul>\n<h3 id=\"contact-information\">Contact Information</h3>\n<ul>\n<li><strong>Address:</strong> Dzaleka Refugee Camp, Malawi</li>\n<li><strong>Phone:</strong> +265 1 712 210</li>\n<li><strong>Email:</strong> <a href=\"mailto:malawi.co@plan-international.org\">malawi.co@plan-international.org</a></li>\n</ul>";

				const frontmatter = {"title":"Plan International Malawi","category":"Humanitarian Aid","description":"Supporting children's rights and equality for girls.","location":{"address":"Dzaleka Refugee Camp","city":"Dowa","coordinates":{"lat":-13.7833,"lng":33.9833}},"contact":{"email":"malawi.co@plan-international.org","phone":"+265 1 712 210","hours":"Monday-Friday, 8:00 AM - 5:00 PM"},"socialMedia":{"facebook":"https://www.facebook.com/PlanMalawi/","twitter":"https://twitter.com/PlanMalawi","instagram":"https://www.instagram.com/planinternational/","linkedin":"","website":"https://plan-international.org/malawi/"},"logo":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSR8IEXWC2ytgxr9MQGJq8H35-9QqB_7nTkZA&s","featured":false,"lastUpdated":"2024-12-24T00:00:00.000Z"};
				const file = "/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/plan-international-malawi.md";
				const url = undefined;
				function rawContent() {
					return "\n## About Plan International Malawi\n\nSupporting children's rights and equality for girls.\n\n### Our Services\n- Emergency assistance\n- Basic needs support\n- Protection services\n- Community support\n\n### Contact Information\n- **Address:** Dzaleka Refugee Camp, Malawi\n- **Phone:** +265 1 712 210\n- **Email:** malawi.co@plan-international.org\n";
				}
				function compiledContent() {
					return html;
				}
				function getHeadings() {
					return [{"depth":2,"slug":"about-plan-international-malawi","text":"About Plan International Malawi"},{"depth":3,"slug":"our-services","text":"Our Services"},{"depth":3,"slug":"contact-information","text":"Contact Information"}];
				}

				const Content = createComponent((result, _props, slots) => {
					const { layout, ...content } = frontmatter;
					content.file = file;
					content.url = url;

					return renderTemplate`${maybeRenderHead()}${unescapeHTML(html)}`;
				});

export { Content, compiledContent, Content as default, file, frontmatter, getHeadings, rawContent, url };
