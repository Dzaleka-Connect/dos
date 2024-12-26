import { f as createComponent, i as renderTemplate, m as maybeRenderHead, u as unescapeHTML } from './astro_80255e7d.mjs';
import 'clsx';

const html = "<h2 id=\"about-refugee-led-organisation-network-malawi\">About Refugee-Led Organisation Network Malawi</h2>\n<p>The network brings together refugee-led organisations together and form one voice in topics that matters</p>\n<h3 id=\"our-services\">Our Services</h3>\n<ul>\n<li>Business development</li>\n<li>Skills training</li>\n<li>Market access</li>\n<li>Networking opportunities</li>\n</ul>\n<h3 id=\"contact-information\">Contact Information</h3>\n<ul>\n<li><strong>Address:</strong> Dzaleka Refugee Camp, Malawi</li>\n</ul>";

				const frontmatter = {"title":"Refugee-Led Organisation Network Malawi","category":"Entrepreneurship","description":"The network brings together refugee-led organisations together and form one voice in topics that matters","location":{"address":"Dzaleka Refugee Camp","city":"Dowa","coordinates":{"lat":-13.7833,"lng":33.9833}},"contact":{"email":"","phone":"","hours":"Monday-Friday, 8:00 AM - 5:00 PM"},"socialMedia":{"facebook":"https://www.facebook.com/relonmalawi","twitter":"","instagram":"","linkedin":"","website":"https://relon-malawi.com"},"logo":"https://scontent.fbne5-1.fna.fbcdn.net/v/t39.30808-6/257576430_218080243788740_661002312818466504_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=ttbxD_Nt-YgQ7kNvgEqI6Lw&_nc_zt=23&_nc_ht=scontent.fbne5-1.fna&_nc_gid=AhgvWCiphkOi6uMewXkfS7Z&oh=00_AYAHOTiIYNkp2NYgW8hOQXN7kz3s-y0jnwlfoqLSi9GNxQ&oe=6729D5C2","featured":false,"lastUpdated":"2024-12-24T00:00:00.000Z"};
				const file = "/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/refugee-led-organisation-network-malawi.md";
				const url = undefined;
				function rawContent() {
					return "\n## About Refugee-Led Organisation Network Malawi\n\nThe network brings together refugee-led organisations together and form one voice in topics that matters\n\n### Our Services\n- Business development\n- Skills training\n- Market access\n- Networking opportunities\n\n### Contact Information\n- **Address:** Dzaleka Refugee Camp, Malawi\n";
				}
				function compiledContent() {
					return html;
				}
				function getHeadings() {
					return [{"depth":2,"slug":"about-refugee-led-organisation-network-malawi","text":"About Refugee-Led Organisation Network Malawi"},{"depth":3,"slug":"our-services","text":"Our Services"},{"depth":3,"slug":"contact-information","text":"Contact Information"}];
				}

				const Content = createComponent((result, _props, slots) => {
					const { layout, ...content } = frontmatter;
					content.file = file;
					content.url = url;

					return renderTemplate`${maybeRenderHead()}${unescapeHTML(html)}`;
				});

export { Content, compiledContent, Content as default, file, frontmatter, getHeadings, rawContent, url };
