import { f as createComponent, i as renderTemplate, m as maybeRenderHead, u as unescapeHTML } from './astro_80255e7d.mjs';
import 'clsx';

const html = "<h2 id=\"about-umoja-hand-craft-project\">About UMOJA Hand Craft Project</h2>\n<p>Handmade crafts and textiles by skilled refugee artisans.</p>\n<h3 id=\"our-services\">Our Services</h3>\n<ul>\n<li>Business development</li>\n<li>Skills training</li>\n<li>Market access</li>\n<li>Networking opportunities</li>\n</ul>\n<h3 id=\"contact-information\">Contact Information</h3>\n<ul>\n<li><strong>Address:</strong> Dzaleka Refugee Camp, Malawi</li>\n<li><strong>Phone:</strong> +265 991 234567</li>\n<li><strong>Email:</strong> <a href=\"mailto:info@umojacrafts.com\">info@umojacrafts.com</a></li>\n<li><strong>Website:</strong> <a href=\"http://umojacrafts.com\">UMOJA Hand Craft Project</a></li>\n</ul>\n<h3 id=\"social-media\">Social Media</h3>\n<ul>\n<li><a href=\"https://www.facebook.com/umojacrafts/\">Facebook</a></li>\n<li><a href=\"https://www.instagram.com/umojacrafts/\">Instagram</a></li>\n</ul>";

				const frontmatter = {"title":"UMOJA Hand Craft Project","category":"Entrepreneurship","description":"Handmade crafts and textiles by skilled refugee artisans.","location":{"address":"Dzaleka Refugee Camp","city":"Dowa","coordinates":{"lat":-13.7833,"lng":33.9833}},"contact":{"email":"","phone":"","hours":"Monday-Friday, 8:00 AM - 5:00 PM"},"socialMedia":{"facebook":"","twitter":"","instagram":"","linkedin":"","website":""},"logo":"https://emiliereynaud.com/clients/336/fichiers/photos/4f79b173ddcfb.jpg","featured":false,"lastUpdated":"2024-12-24T00:00:00.000Z"};
				const file = "/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/umoja-hand-craft-project.md";
				const url = undefined;
				function rawContent() {
					return "\n## About UMOJA Hand Craft Project\n\nHandmade crafts and textiles by skilled refugee artisans.\n\n### Our Services\n- Business development\n- Skills training\n- Market access\n- Networking opportunities\n\n### Contact Information\n- **Address:** Dzaleka Refugee Camp, Malawi\n- **Phone:** +265 991 234567\n- **Email:** info@umojacrafts.com\n- **Website:** [UMOJA Hand Craft Project](http://umojacrafts.com)\n\n### Social Media\n- [Facebook](https://www.facebook.com/umojacrafts/)\n- [Instagram](https://www.instagram.com/umojacrafts/)\n";
				}
				function compiledContent() {
					return html;
				}
				function getHeadings() {
					return [{"depth":2,"slug":"about-umoja-hand-craft-project","text":"About UMOJA Hand Craft Project"},{"depth":3,"slug":"our-services","text":"Our Services"},{"depth":3,"slug":"contact-information","text":"Contact Information"},{"depth":3,"slug":"social-media","text":"Social Media"}];
				}

				const Content = createComponent((result, _props, slots) => {
					const { layout, ...content } = frontmatter;
					content.file = file;
					content.url = url;

					return renderTemplate`${maybeRenderHead()}${unescapeHTML(html)}`;
				});

export { Content, compiledContent, Content as default, file, frontmatter, getHeadings, rawContent, url };
