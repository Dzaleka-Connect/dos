import { f as createComponent, i as renderTemplate, m as maybeRenderHead, u as unescapeHTML } from './astro_80255e7d.mjs';
import 'clsx';

const html = "<h2 id=\"about-takenolab\">About Takenolab</h2>\n<p>Supporting refugee entrepreneurs and innovation initiatives.</p>\n<h3 id=\"our-services\">Our Services</h3>\n<ul>\n<li>Business development</li>\n<li>Skills training</li>\n<li>Market access</li>\n<li>Networking opportunities</li>\n</ul>\n<h3 id=\"contact-information\">Contact Information</h3>\n<ul>\n<li><strong>Address:</strong> Dzaleka Refugee Camp, Malawi</li>\n<li><strong>Phone:</strong> +265 991 123456</li>\n<li><strong>Email:</strong> <a href=\"mailto:info@takenolab.com\">info@takenolab.com</a></li>\n</ul>";

				const frontmatter = {"title":"Takenolab","category":"Entrepreneurship","description":"Supporting refugee entrepreneurs and innovation initiatives.","location":{"address":"Dzaleka Refugee Camp","city":"Dowa","coordinates":{"lat":-13.7833,"lng":33.9833}},"contact":{"email":"","phone":"","hours":"Monday-Friday, 8:00 AM - 5:00 PM"},"socialMedia":{"facebook":"https://www.facebook.com/takenolab/","twitter":"https://twitter.com/takenolab","instagram":"https://www.instagram.com/takenolab/","linkedin":"","website":"https://takenolab.com/"},"logo":"https://media.licdn.com/dms/image/v2/C4E0BAQGBjVJzSTJtgQ/company-logo_400_400/company-logo_400_400/0/1668553422687/takenolab_logo?e=2147483647&v=beta&t=FU6wn557OB-2uncAqU5PLLhnA0PvqiDPqhNlPCJ_h0k","featured":false,"lastUpdated":"2024-12-24T00:00:00.000Z"};
				const file = "/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/takenolab.md";
				const url = undefined;
				function rawContent() {
					return "\n## About Takenolab\n\nSupporting refugee entrepreneurs and innovation initiatives.\n\n### Our Services\n- Business development\n- Skills training\n- Market access\n- Networking opportunities\n\n### Contact Information\n- **Address:** Dzaleka Refugee Camp, Malawi\n- **Phone:** +265 991 123456\n- **Email:** info@takenolab.com\n";
				}
				function compiledContent() {
					return html;
				}
				function getHeadings() {
					return [{"depth":2,"slug":"about-takenolab","text":"About Takenolab"},{"depth":3,"slug":"our-services","text":"Our Services"},{"depth":3,"slug":"contact-information","text":"Contact Information"}];
				}

				const Content = createComponent((result, _props, slots) => {
					const { layout, ...content } = frontmatter;
					content.file = file;
					content.url = url;

					return renderTemplate`${maybeRenderHead()}${unescapeHTML(html)}`;
				});

export { Content, compiledContent, Content as default, file, frontmatter, getHeadings, rawContent, url };
