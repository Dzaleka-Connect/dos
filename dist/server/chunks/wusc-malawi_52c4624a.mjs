import { f as createComponent, i as renderTemplate, m as maybeRenderHead, u as unescapeHTML } from './astro_80255e7d.mjs';
import 'clsx';

const html = "<h2 id=\"about-wusc-malawi\">About WUSC Malawi</h2>\n<p>Educational opportunities and scholarships for refugees.</p>\n<h3 id=\"our-services\">Our Services</h3>\n<ul>\n<li>Skills training</li>\n<li>Academic support</li>\n<li>Capacity building</li>\n<li>Educational resources</li>\n</ul>\n<h3 id=\"contact-information\">Contact Information</h3>\n<ul>\n<li><strong>Address:</strong> Dzaleka Refugee Camp, Malawi</li>\n<li><strong>Phone:</strong> +265 1 772 275</li>\n<li><strong>Email:</strong> <a href=\"mailto:wuscmalawi@wusc.ca\">wuscmalawi@wusc.ca</a></li>\n<li><strong>Website:</strong> <a href=\"https://www.facebook.com/wuscmw/\">WUSC Malawi</a></li>\n</ul>\n<h3 id=\"social-media\">Social Media</h3>\n<ul>\n<li><a href=\"https://www.facebook.com/wuscmw/\">Facebook</a></li>\n<li><a href=\"https://twitter.com/WUSC_EUMC\">Twitter</a></li>\n</ul>";

				const frontmatter = {"title":"WUSC Malawi","category":"Education","description":"Educational opportunities and scholarships for refugees.","location":{"address":"Dzaleka Refugee Camp","city":"Dowa","coordinates":{"lat":-13.7833,"lng":33.9833}},"contact":{"email":"","phone":"","hours":"Monday-Friday, 8:00 AM - 5:00 PM"},"socialMedia":{"facebook":"","twitter":"","instagram":"","linkedin":"","website":""},"logo":"https://seepnetwork.org/files/galleries/wusc-logo.jpg","featured":false,"lastUpdated":"2024-12-24T00:00:00.000Z"};
				const file = "/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/wusc-malawi.md";
				const url = undefined;
				function rawContent() {
					return "\n## About WUSC Malawi\n\nEducational opportunities and scholarships for refugees.\n\n### Our Services\n- Skills training\n- Academic support\n- Capacity building\n- Educational resources\n\n### Contact Information\n- **Address:** Dzaleka Refugee Camp, Malawi\n- **Phone:** +265 1 772 275\n- **Email:** wuscmalawi@wusc.ca\n- **Website:** [WUSC Malawi](https://www.facebook.com/wuscmw/)\n\n### Social Media\n- [Facebook](https://www.facebook.com/wuscmw/)\n- [Twitter](https://twitter.com/WUSC_EUMC)\n";
				}
				function compiledContent() {
					return html;
				}
				function getHeadings() {
					return [{"depth":2,"slug":"about-wusc-malawi","text":"About WUSC Malawi"},{"depth":3,"slug":"our-services","text":"Our Services"},{"depth":3,"slug":"contact-information","text":"Contact Information"},{"depth":3,"slug":"social-media","text":"Social Media"}];
				}

				const Content = createComponent((result, _props, slots) => {
					const { layout, ...content } = frontmatter;
					content.file = file;
					content.url = url;

					return renderTemplate`${maybeRenderHead()}${unescapeHTML(html)}`;
				});

export { Content, compiledContent, Content as default, file, frontmatter, getHeadings, rawContent, url };
