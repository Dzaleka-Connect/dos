import { f as createComponent, i as renderTemplate, m as maybeRenderHead, u as unescapeHTML } from './astro_80255e7d.mjs';
import 'clsx';

const html = "<h2 id=\"about-dzaleka-connect\">About Dzaleka Connect</h2>\n<p>We support young creatives, celebrate diverse talent &#x26; recognise social impact leaders.</p>\n<h3 id=\"our-services\">Our Services</h3>\n<ul>\n<li>Business development</li>\n<li>Skills training</li>\n<li>Market access</li>\n<li>Networking opportunities</li>\n</ul>";

				const frontmatter = {"title":"Dzaleka Connect","category":"Entrepreneurship","description":"We support young creatives, celebrate diverse talent & recognise social impact leaders.","location":{"address":"Dzaleka Refugee Camp","city":"Dowa","coordinates":{"lat":-13.7833,"lng":33.9833}},"contact":{"email":"dzalekaconnect@gmail.com","phone":"","hours":"Monday-Friday, 8:00 AM - 5:00 PM"},"socialMedia":{"facebook":"https://www.facebook.com/DzalekaConnect","twitter":"https://twitter.com/dzalekaconnect","instagram":"https://www.instagram.com/dzalekaconnect","linkedin":"https://www.linkedin.com/company/dzalekaconnect","website":"https://dzalekaconnect.com/"},"logo":"https://dzalekaconnect.com/images/dzaleka_connect_logo.png","featured":false,"lastUpdated":"2024-12-24T00:00:00.000Z"};
				const file = "/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/dzaleka-connect.md";
				const url = undefined;
				function rawContent() {
					return "\n## About Dzaleka Connect\n\nWe support young creatives, celebrate diverse talent & recognise social impact leaders.\n\n### Our Services\n- Business development\n- Skills training\n- Market access\n- Networking opportunities\n\n";
				}
				function compiledContent() {
					return html;
				}
				function getHeadings() {
					return [{"depth":2,"slug":"about-dzaleka-connect","text":"About Dzaleka Connect"},{"depth":3,"slug":"our-services","text":"Our Services"}];
				}

				const Content = createComponent((result, _props, slots) => {
					const { layout, ...content } = frontmatter;
					content.file = file;
					content.url = url;

					return renderTemplate`${maybeRenderHead()}${unescapeHTML(html)}`;
				});

export { Content, compiledContent, Content as default, file, frontmatter, getHeadings, rawContent, url };
