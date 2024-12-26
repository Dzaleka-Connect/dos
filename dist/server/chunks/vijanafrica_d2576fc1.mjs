import { f as createComponent, i as renderTemplate, m as maybeRenderHead, u as unescapeHTML } from './astro_80255e7d.mjs';
import 'clsx';

const html = "<h2 id=\"about-vijanafrica\">About VijanAfrica</h2>\n<p>Youth empowerment and skills development programs.</p>\n<h3 id=\"our-services\">Our Services</h3>\n<ul>\n<li>Youth empowerment</li>\n<li>Skills development</li>\n<li>Leadership training</li>\n<li>Mentorship programs</li>\n</ul>\n<h3 id=\"contact-information\">Contact Information</h3>\n<ul>\n<li><strong>Address:</strong> Dzaleka Refugee Camp, Malawi</li>\n<li><strong>Phone:</strong> +265 999 456789</li>\n<li><strong>Email:</strong> <a href=\"mailto:info@vijanafrica.org\">info@vijanafrica.org</a></li>\n<li><strong>Website:</strong> <a href=\"https://www.vijanafrica.org/\">VijanAfrica</a></li>\n</ul>\n<h3 id=\"social-media\">Social Media</h3>\n<ul>\n<li><a href=\"https://www.facebook.com/vijanafrica/\">Facebook</a></li>\n<li><a href=\"https://www.instagram.com/vijanafrica/\">Instagram</a></li>\n<li><a href=\"https://twitter.com/vijanafrica\">Twitter</a></li>\n</ul>";

				const frontmatter = {"title":"VijanAfrica","category":"Youth","description":"Youth empowerment and skills development programs.","location":{"address":"Dzaleka Refugee Camp","city":"Dowa","coordinates":{"lat":-13.7833,"lng":33.9833}},"contact":{"email":"","phone":"","hours":"Monday-Friday, 8:00 AM - 5:00 PM"},"socialMedia":{"facebook":"","twitter":"","instagram":"","linkedin":"","website":""},"logo":"https://static.wixstatic.com/media/4cfe9c_154ca34509f44ec3968e735c46d4998f~mv2.png/v1/crop/x_9,y_112,w_478,h_290/fill/w_360,h_218,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/Vijana%20Africa%20Logogo.png","featured":false,"lastUpdated":"2024-12-24T00:00:00.000Z"};
				const file = "/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/vijanafrica.md";
				const url = undefined;
				function rawContent() {
					return "\n## About VijanAfrica\n\nYouth empowerment and skills development programs.\n\n### Our Services\n- Youth empowerment\n- Skills development\n- Leadership training\n- Mentorship programs\n\n### Contact Information\n- **Address:** Dzaleka Refugee Camp, Malawi\n- **Phone:** +265 999 456789\n- **Email:** info@vijanafrica.org\n- **Website:** [VijanAfrica](https://www.vijanafrica.org/)\n\n### Social Media\n- [Facebook](https://www.facebook.com/vijanafrica/)\n- [Instagram](https://www.instagram.com/vijanafrica/)\n- [Twitter](https://twitter.com/vijanafrica)\n";
				}
				function compiledContent() {
					return html;
				}
				function getHeadings() {
					return [{"depth":2,"slug":"about-vijanafrica","text":"About VijanAfrica"},{"depth":3,"slug":"our-services","text":"Our Services"},{"depth":3,"slug":"contact-information","text":"Contact Information"},{"depth":3,"slug":"social-media","text":"Social Media"}];
				}

				const Content = createComponent((result, _props, slots) => {
					const { layout, ...content } = frontmatter;
					content.file = file;
					content.url = url;

					return renderTemplate`${maybeRenderHead()}${unescapeHTML(html)}`;
				});

export { Content, compiledContent, Content as default, file, frontmatter, getHeadings, rawContent, url };
