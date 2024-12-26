import { f as createComponent, i as renderTemplate, m as maybeRenderHead, u as unescapeHTML } from './astro_80255e7d.mjs';
import 'clsx';

const html = "<h2 id=\"about-inside-dzaleka\">About Inside Dzaleka</h2>\n<p>Inside Dzaleka Is A Platform With The Aim To Educate, Entertain And Expose Dzaleka Refugee Camp To The World.</p>\n<h3 id=\"our-services\">Our Services</h3>\n<ul>\n<li>Youth empowerment</li>\n<li>Skills development</li>\n<li>Leadership training</li>\n<li>Mentorship programs</li>\n</ul>\n<h3 id=\"contact-information\">Contact Information</h3>\n<ul>\n<li><strong>Address:</strong> Dzaleka Refugee Camp, Malawi</li>\n<li><strong>Website:</strong> <a href=\"https://www.instagram.com/inside_dzaleka/\">Inside Dzaleka</a></li>\n</ul>";

				const frontmatter = {"title":"Inside Dzaleka","category":"Youth","description":"Inside Dzaleka Is A Platform With The Aim To Educate, Entertain And Expose Dzaleka Refugee Camp To The World.","location":{"address":"Dzaleka Refugee Camp","city":"Dowa","coordinates":{"lat":-13.7833,"lng":33.9833}},"contact":{"email":"","phone":"","hours":"Monday-Friday, 8:00 AM - 5:00 PM"},"socialMedia":{"facebook":"https://www.facebook.com/profile.php?id=61556556606413","twitter":"","instagram":"https://www.instagram.com/inside_dzaleka/","linkedin":"","website":"https://www.instagram.com/inside_dzaleka/"},"logo":"https://yt3.googleusercontent.com/-yMI73jA50BO6z23ePzzuWPZcQtCHeu3_y1LL8fmdvAgEog_GK4tnW_Ge099s3r8410b68NqLg=s160-c-k-c0x00ffffff-no-rj","featured":false,"lastUpdated":"2024-12-24T00:00:00.000Z"};
				const file = "/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/inside-dzaleka.md";
				const url = undefined;
				function rawContent() {
					return "\n## About Inside Dzaleka\n\nInside Dzaleka Is A Platform With The Aim To Educate, Entertain And Expose Dzaleka Refugee Camp To The World.\n\n### Our Services\n- Youth empowerment\n- Skills development\n- Leadership training\n- Mentorship programs\n\n### Contact Information\n- **Address:** Dzaleka Refugee Camp, Malawi\n- **Website:** [Inside Dzaleka](https://www.instagram.com/inside_dzaleka/)\n";
				}
				function compiledContent() {
					return html;
				}
				function getHeadings() {
					return [{"depth":2,"slug":"about-inside-dzaleka","text":"About Inside Dzaleka"},{"depth":3,"slug":"our-services","text":"Our Services"},{"depth":3,"slug":"contact-information","text":"Contact Information"}];
				}

				const Content = createComponent((result, _props, slots) => {
					const { layout, ...content } = frontmatter;
					content.file = file;
					content.url = url;

					return renderTemplate`${maybeRenderHead()}${unescapeHTML(html)}`;
				});

export { Content, compiledContent, Content as default, file, frontmatter, getHeadings, rawContent, url };
