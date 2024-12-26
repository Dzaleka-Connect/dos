import { f as createComponent, i as renderTemplate, m as maybeRenderHead, u as unescapeHTML } from './astro_80255e7d.mjs';
import 'clsx';

const html = "<h2 id=\"about-dzaleka-blood-donors-services\">About Dzaleka Blood Donors Services</h2>\n<p>Free blood donation services for refugees and host community.</p>\n<h3 id=\"our-services\">Our Services</h3>\n<ul>\n<li>Medical services</li>\n<li>Health education</li>\n<li>Mental health support</li>\n<li>Community health</li>\n</ul>\n<h3 id=\"contact-information\">Contact Information</h3>\n<ul>\n<li><strong>Address:</strong> Dzaleka Refugee Camp, Malawi</li>\n<li><strong>Phone:</strong> +265 999 638207</li>\n<li><strong>Website:</strong> <a href=\"https://dzalekablooddonors.wixsite.com/savelives\">Dzaleka Blood Donors Services</a></li>\n</ul>\n<h3 id=\"social-media\">Social Media</h3>\n<ul>\n<li><a href=\"https://www.facebook.com/dzalekablooddonors/\">Facebook</a></li>\n<li><a href=\"https://www.instagram.com/dzalekablooddonors/\">Instagram</a></li>\n</ul>";

				const frontmatter = {"title":"Dzaleka Blood Donors Services","category":"Health","description":"Free blood donation services for refugees and host community.","location":{"address":"Dzaleka Refugee Camp","city":"Dowa","coordinates":{"lat":-13.7833,"lng":33.9833}},"contact":{"email":"","phone":"","hours":"Monday-Friday, 8:00 AM - 5:00 PM"},"socialMedia":{"facebook":"","twitter":"","instagram":"","linkedin":"","website":""},"logo":"https://media.licdn.com/dms/image/v2/C4D0BAQFnxhVBLwYfeA/company-logo_200_200/company-logo_200_200/0/1655977946891?e=1731542400&v=beta&t=3z2fsso5JIz-DiLc5yOa6mFHfUDUISAF6u1pZ6YzGYw","featured":false,"lastUpdated":"2024-12-24T00:00:00.000Z"};
				const file = "/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/dzaleka-blood-donors-services.md";
				const url = undefined;
				function rawContent() {
					return "\n## About Dzaleka Blood Donors Services\n\nFree blood donation services for refugees and host community.\n\n### Our Services\n- Medical services\n- Health education\n- Mental health support\n- Community health\n\n### Contact Information\n- **Address:** Dzaleka Refugee Camp, Malawi\n- **Phone:** +265 999 638207\n- **Website:** [Dzaleka Blood Donors Services](https://dzalekablooddonors.wixsite.com/savelives)\n\n### Social Media\n- [Facebook](https://www.facebook.com/dzalekablooddonors/)\n- [Instagram](https://www.instagram.com/dzalekablooddonors/)\n";
				}
				function compiledContent() {
					return html;
				}
				function getHeadings() {
					return [{"depth":2,"slug":"about-dzaleka-blood-donors-services","text":"About Dzaleka Blood Donors Services"},{"depth":3,"slug":"our-services","text":"Our Services"},{"depth":3,"slug":"contact-information","text":"Contact Information"},{"depth":3,"slug":"social-media","text":"Social Media"}];
				}

				const Content = createComponent((result, _props, slots) => {
					const { layout, ...content } = frontmatter;
					content.file = file;
					content.url = url;

					return renderTemplate`${maybeRenderHead()}${unescapeHTML(html)}`;
				});

export { Content, compiledContent, Content as default, file, frontmatter, getHeadings, rawContent, url };
