import { f as createComponent, i as renderTemplate, m as maybeRenderHead, u as unescapeHTML } from './astro_80255e7d.mjs';
import 'clsx';

const html = "<h2 id=\"about-fraternity-without-borders\">About Fraternity Without Borders</h2>\n<p>Supporting refugee rights and community integration.</p>\n<h3 id=\"our-services\">Our Services</h3>\n<ul>\n<li>Rights protection</li>\n<li>Legal support</li>\n<li>Policy advocacy</li>\n<li>Community engagement</li>\n</ul>\n<h3 id=\"contact-information\">Contact Information</h3>\n<ul>\n<li><strong>Address:</strong> Dzaleka Refugee Camp, Malawi</li>\n<li><strong>Phone:</strong> +55 67 3325-8091</li>\n<li><strong>Email:</strong> <a href=\"mailto:contato@fraternidadesemfronteiras.org.br\">contato@fraternidadesemfronteiras.org.br</a></li>\n<li><strong>Website:</strong> <a href=\"https://www.fraternidadesemfronteiras.org.br/\">Fraternity Without Borders</a></li>\n</ul>\n<h3 id=\"social-media\">Social Media</h3>\n<ul>\n<li><a href=\"https://www.facebook.com/fraternidadesemfronteiras/\">Facebook</a></li>\n<li><a href=\"https://www.instagram.com/fraternidadesemfronteiras/\">Instagram</a></li>\n</ul>";

				const frontmatter = {"title":"Fraternity Without Borders","category":"Advocacy","description":"Supporting refugee rights and community integration.","location":{"address":"Dzaleka Refugee Camp","city":"Dowa","coordinates":{"lat":-13.7833,"lng":33.9833}},"contact":{"email":"","phone":"","hours":"Monday-Friday, 8:00 AM - 5:00 PM"},"socialMedia":{"facebook":"","twitter":"","instagram":"","linkedin":"","website":""},"logo":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwR3227nKHXrNQ2l_SsuetsksJl-PQGx5XQA&s","featured":false,"lastUpdated":"2024-12-24T00:00:00.000Z"};
				const file = "/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/fraternity-without-borders.md";
				const url = undefined;
				function rawContent() {
					return "\n## About Fraternity Without Borders\n\nSupporting refugee rights and community integration.\n\n### Our Services\n- Rights protection\n- Legal support\n- Policy advocacy\n- Community engagement\n\n### Contact Information\n- **Address:** Dzaleka Refugee Camp, Malawi\n- **Phone:** +55 67 3325-8091\n- **Email:** contato@fraternidadesemfronteiras.org.br\n- **Website:** [Fraternity Without Borders](https://www.fraternidadesemfronteiras.org.br/)\n\n### Social Media\n- [Facebook](https://www.facebook.com/fraternidadesemfronteiras/)\n- [Instagram](https://www.instagram.com/fraternidadesemfronteiras/)\n";
				}
				function compiledContent() {
					return html;
				}
				function getHeadings() {
					return [{"depth":2,"slug":"about-fraternity-without-borders","text":"About Fraternity Without Borders"},{"depth":3,"slug":"our-services","text":"Our Services"},{"depth":3,"slug":"contact-information","text":"Contact Information"},{"depth":3,"slug":"social-media","text":"Social Media"}];
				}

				const Content = createComponent((result, _props, slots) => {
					const { layout, ...content } = frontmatter;
					content.file = file;
					content.url = url;

					return renderTemplate`${maybeRenderHead()}${unescapeHTML(html)}`;
				});

export { Content, compiledContent, Content as default, file, frontmatter, getHeadings, rawContent, url };
