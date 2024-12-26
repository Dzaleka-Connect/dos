import { f as createComponent, i as renderTemplate, m as maybeRenderHead, u as unescapeHTML } from './astro_80255e7d.mjs';
import 'clsx';

const html = "<h2 id=\"about-jesuit-worldwide-learning\">About Jesuit Worldwide Learning</h2>\n<p>Higher education access for marginalized communities.</p>\n<h3 id=\"services\">Services</h3>\n<ul>\n<li>Skills training</li>\n<li>Academic support</li>\n<li>Capacity building</li>\n<li>Educational resources</li>\n</ul>";

				const frontmatter = {"title":"Jesuit Worldwide Learning","category":"Education","description":"Higher education opportunities for refugees and marginalized communities.","location":{"address":"Dzaleka Refugee Camp","city":"Dowa","coordinates":{"lat":-13.7833,"lng":33.9833}},"contact":{"email":"jwlinfo@jwl.org","phone":"+41 22 525 38 58","hours":"Monday-Friday, 8:00 AM - 5:00 PM"},"socialMedia":{"facebook":"https://www.facebook.com/JesuitWorldwideLearning/","twitter":"https://twitter.com/jwl_global","instagram":"https://www.instagram.com/jesuitworldwidelearning","linkedin":"https://www.linkedin.com/company/jesuit-worldwide-learning/","website":"https://www.jwl.org/"},"logo":"https://www.jwl.org/static/images/logos/world.png","featured":true,"verified":true,"lastUpdated":"2024-12-24T00:00:00.000Z"};
				const file = "/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/jesuit-worldwide-learning.md";
				const url = undefined;
				function rawContent() {
					return "\n## About Jesuit Worldwide Learning\n\nHigher education access for marginalized communities.\n\n### Services\n- Skills training\n- Academic support\n- Capacity building\n- Educational resources\n";
				}
				function compiledContent() {
					return html;
				}
				function getHeadings() {
					return [{"depth":2,"slug":"about-jesuit-worldwide-learning","text":"About Jesuit Worldwide Learning"},{"depth":3,"slug":"services","text":"Services"}];
				}

				const Content = createComponent((result, _props, slots) => {
					const { layout, ...content } = frontmatter;
					content.file = file;
					content.url = url;

					return renderTemplate`${maybeRenderHead()}${unescapeHTML(html)}`;
				});

export { Content, compiledContent, Content as default, file, frontmatter, getHeadings, rawContent, url };
