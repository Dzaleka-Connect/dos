import { f as createComponent, i as renderTemplate, m as maybeRenderHead, u as unescapeHTML } from './astro_80255e7d.mjs';
import 'clsx';

const html = "<h2 id=\"about-salama-africa\">About Salama Africa</h2>\n<p>A Charitable organization that aims at providing refugee youth a creative outlet.</p>\n<h3 id=\"our-services\">Our Services</h3>\n<ul>\n<li>Youth empowerment</li>\n<li>Skills development</li>\n<li>Leadership training</li>\n<li>Mentorship programs</li>\n</ul>\n<h3 id=\"contact-information\">Contact Information</h3>\n<ul>\n<li><strong>Address:</strong> Dzaleka Refugee Camp, Malawi</li>\n<li><strong>Phone:</strong> +265 993 456789</li>\n<li><strong>Email:</strong> <a href=\"mailto:salamarestaurant@gmail.com\">salamarestaurant@gmail.com</a></li>\n</ul>";

				const frontmatter = {"title":"Salama Africa","category":"Youth","description":"A Charitable organization that aims at providing refugee youth a creative outlet.","location":{"address":"Dzaleka Refugee Camp","city":"Dowa","coordinates":{"lat":-13.7833,"lng":33.9833}},"contact":{"email":"","phone":"","hours":"Monday-Friday, 8:00 AM - 5:00 PM"},"socialMedia":{"facebook":"https://facebook.com/salamaafrica","twitter":"","instagram":"https://www.instagram.com/salama.africa/","linkedin":"","website":"https://www.instagram.com/salama.africa/"},"logo":"https://www.imagineworldwide.org/wp-content/uploads/Salama2.jpg","featured":false,"lastUpdated":"2024-12-24T00:00:00.000Z"};
				const file = "/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/salama-africa.md";
				const url = undefined;
				function rawContent() {
					return "\n## About Salama Africa\n\nA Charitable organization that aims at providing refugee youth a creative outlet.\n\n### Our Services\n- Youth empowerment\n- Skills development\n- Leadership training\n- Mentorship programs\n\n### Contact Information\n- **Address:** Dzaleka Refugee Camp, Malawi\n- **Phone:** +265 993 456789\n- **Email:** salamarestaurant@gmail.com\n";
				}
				function compiledContent() {
					return html;
				}
				function getHeadings() {
					return [{"depth":2,"slug":"about-salama-africa","text":"About Salama Africa"},{"depth":3,"slug":"our-services","text":"Our Services"},{"depth":3,"slug":"contact-information","text":"Contact Information"}];
				}

				const Content = createComponent((result, _props, slots) => {
					const { layout, ...content } = frontmatter;
					content.file = file;
					content.url = url;

					return renderTemplate`${maybeRenderHead()}${unescapeHTML(html)}`;
				});

export { Content, compiledContent, Content as default, file, frontmatter, getHeadings, rawContent, url };
