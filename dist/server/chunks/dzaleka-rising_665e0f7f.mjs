import { f as createComponent, i as renderTemplate, m as maybeRenderHead, u as unescapeHTML } from './astro_80255e7d.mjs';
import 'clsx';

const html = "<h2 id=\"about-dzaleka-rising\">About Dzaleka Rising</h2>\n<p>A project found by Dzaleka youths that aims in removing the market barriers.</p>\n<h3 id=\"our-services\">Our Services</h3>\n<ul>\n<li>Youth empowerment</li>\n<li>Skills development</li>\n<li>Leadership training</li>\n<li>Mentorship programs</li>\n</ul>\n<h3 id=\"contact-information\">Contact Information</h3>\n<ul>\n<li><strong>Address:</strong> Dzaleka Refugee Camp, Malawi</li>\n<li><strong>Phone:</strong> +265 980 400179</li>\n</ul>";

				const frontmatter = {"title":"Dzaleka Rising","description":"Empowering youth through education, arts, and leadership development.","category":"Youth Programs","logo":"https://yt3.googleusercontent.com/ytc/AIdro_m1YT7tJnEg4gHWvDuVLDdTRXn3xs1aOHSI4W_Q5j1PQQ=s900-c-k-c0x00ffffff-no-rj","location":{"address":"Youth Center, Dzaleka Refugee Camp","city":"Dowa","coordinates":{"lat":-13.7833,"lng":33.9833}},"contact":{"email":"info@dzalekarising.org","phone":"+265 991 234567","hours":"Monday-Friday, 9:00 AM - 5:00 PM"},"socialMedia":{"facebook":"https://facebook.com/dzalekarising","twitter":"https://twitter.com/dzalekarising","instagram":"https://instagram.com/dzalekarising","linkedin":"https://www.linkedin.com/company/dzaleka-rising/","website":"https://dzalekarising.org"},"featured":true,"status":"active","lastUpdated":"2024-12-24T00:00:00.000Z"};
				const file = "/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/dzaleka-rising.md";
				const url = undefined;
				function rawContent() {
					return "\n## About Dzaleka Rising\n\nA project found by Dzaleka youths that aims in removing the market barriers.\n\n### Our Services\n- Youth empowerment\n- Skills development\n- Leadership training\n- Mentorship programs\n\n### Contact Information\n- **Address:** Dzaleka Refugee Camp, Malawi\n- **Phone:** +265 980 400179\n";
				}
				function compiledContent() {
					return html;
				}
				function getHeadings() {
					return [{"depth":2,"slug":"about-dzaleka-rising","text":"About Dzaleka Rising"},{"depth":3,"slug":"our-services","text":"Our Services"},{"depth":3,"slug":"contact-information","text":"Contact Information"}];
				}

				const Content = createComponent((result, _props, slots) => {
					const { layout, ...content } = frontmatter;
					content.file = file;
					content.url = url;

					return renderTemplate`${maybeRenderHead()}${unescapeHTML(html)}`;
				});

export { Content, compiledContent, Content as default, file, frontmatter, getHeadings, rawContent, url };
