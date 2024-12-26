import { f as createComponent, i as renderTemplate, m as maybeRenderHead, u as unescapeHTML } from './astro_80255e7d.mjs';
import 'clsx';

const html = "<h2 id=\"about-village-book-builders\">About Village Book Builders</h2>\n<p>Connecting rural communities with quality educational resources.</p>\n<h3 id=\"our-services\">Our Services</h3>\n<ul>\n<li>Skills training</li>\n<li>Academic support</li>\n<li>Capacity building</li>\n<li>Educational resources</li>\n</ul>\n<h3 id=\"contact-information\">Contact Information</h3>\n<ul>\n<li><strong>Address:</strong> Dzaleka Refugee Camp, Malawi</li>\n<li><strong>Email:</strong> <a href=\"mailto:info@villagebookbuilders.org\">info@villagebookbuilders.org</a></li>\n<li><strong>Website:</strong> <a href=\"http://www.joinourvillage.org\">Village Book Builders</a></li>\n</ul>\n<h3 id=\"social-media\">Social Media</h3>\n<ul>\n<li><a href=\"https://www.facebook.com/villagebookbuilders/\">Facebook</a></li>\n<li><a href=\"https://www.instagram.com/villagebookbuilders/\">Instagram</a></li>\n<li><a href=\"https://www.linkedin.com/company/village-book-builders/\">Linkedin</a></li>\n</ul>";

				const frontmatter = {"title":"Village Book Builders","category":"Education","description":"Connecting rural communities with quality educational resources.","location":{"address":"Dzaleka Refugee Camp","city":"Dowa","coordinates":{"lat":-13.7833,"lng":33.9833}},"contact":{"email":"","phone":"","hours":"Monday-Friday, 8:00 AM - 5:00 PM"},"socialMedia":{"facebook":"","twitter":"","instagram":"","linkedin":"","website":""},"logo":"https://joinourvillage.org/wp-content/uploads/2020/02/village_libraries_logo_blue.png","featured":false,"lastUpdated":"2024-12-24T00:00:00.000Z"};
				const file = "/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/village-book-builders.md";
				const url = undefined;
				function rawContent() {
					return "\n## About Village Book Builders\n\nConnecting rural communities with quality educational resources.\n\n### Our Services\n- Skills training\n- Academic support\n- Capacity building\n- Educational resources\n\n### Contact Information\n- **Address:** Dzaleka Refugee Camp, Malawi\n- **Email:** info@villagebookbuilders.org\n- **Website:** [Village Book Builders](http://www.joinourvillage.org)\n\n### Social Media\n- [Facebook](https://www.facebook.com/villagebookbuilders/)\n- [Instagram](https://www.instagram.com/villagebookbuilders/)\n- [Linkedin](https://www.linkedin.com/company/village-book-builders/)\n";
				}
				function compiledContent() {
					return html;
				}
				function getHeadings() {
					return [{"depth":2,"slug":"about-village-book-builders","text":"About Village Book Builders"},{"depth":3,"slug":"our-services","text":"Our Services"},{"depth":3,"slug":"contact-information","text":"Contact Information"},{"depth":3,"slug":"social-media","text":"Social Media"}];
				}

				const Content = createComponent((result, _props, slots) => {
					const { layout, ...content } = frontmatter;
					content.file = file;
					content.url = url;

					return renderTemplate`${maybeRenderHead()}${unescapeHTML(html)}`;
				});

export { Content, compiledContent, Content as default, file, frontmatter, getHeadings, rawContent, url };
