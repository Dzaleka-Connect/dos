import { f as createComponent, i as renderTemplate, m as maybeRenderHead, u as unescapeHTML } from './astro_80255e7d.mjs';
import 'clsx';

const html = "<h2 id=\"about-dzaleka-youth-organization\">About Dzaleka Youth Organization</h2>\n<p>Youth development and community engagement programs.</p>\n<h3 id=\"our-services\">Our Services</h3>\n<ul>\n<li>Youth empowerment</li>\n<li>Skills development</li>\n<li>Leadership training</li>\n<li>Mentorship programs</li>\n</ul>\n<h3 id=\"contact-information\">Contact Information</h3>\n<ul>\n<li><strong>Address:</strong> Dzaleka Refugee Camp, Malawi</li>\n<li><strong>Phone:</strong> +265 886 829747</li>\n<li><strong>Website:</strong> <a href=\"https://www.linkedin.com/company/dzleka-youth-congress/\">Dzaleka Youth Organization</a></li>\n</ul>\n<h3 id=\"social-media\">Social Media</h3>\n<ul>\n<li><a href=\"https://www.facebook.com/dzalekayouth/\">Facebook</a></li>\n<li><a href=\"https://www.linkedin.com/company/dzleka-youth-congress/\">Linkedin</a></li>\n</ul>";

				const frontmatter = {"title":"Dzaleka Youth Organization","category":"Youth","description":"Youth development and community engagement programs.","location":{"address":"Dzaleka Refugee Camp","city":"Dowa","coordinates":{"lat":-13.7833,"lng":33.9833}},"contact":{"email":"","phone":"","hours":"Monday-Friday, 8:00 AM - 5:00 PM"},"socialMedia":{"facebook":"","twitter":"","instagram":"","linkedin":"","website":""},"logo":"https://media.licdn.com/dms/image/C560BAQHFajclPh7zjQ/company-logo_200_200/0/1630621931598?e=1731542400&v=beta&t=D6k9N8MMcl1_wr0o6roE72KMdLO2cixr1SMXF2fIvFs","featured":false,"lastUpdated":"2024-12-24T00:00:00.000Z"};
				const file = "/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/dzaleka-youth-organization.md";
				const url = undefined;
				function rawContent() {
					return "\n## About Dzaleka Youth Organization\n\nYouth development and community engagement programs.\n\n### Our Services\n- Youth empowerment\n- Skills development\n- Leadership training\n- Mentorship programs\n\n### Contact Information\n- **Address:** Dzaleka Refugee Camp, Malawi\n- **Phone:** +265 886 829747\n- **Website:** [Dzaleka Youth Organization](https://www.linkedin.com/company/dzleka-youth-congress/)\n\n### Social Media\n- [Facebook](https://www.facebook.com/dzalekayouth/)\n- [Linkedin](https://www.linkedin.com/company/dzleka-youth-congress/)\n";
				}
				function compiledContent() {
					return html;
				}
				function getHeadings() {
					return [{"depth":2,"slug":"about-dzaleka-youth-organization","text":"About Dzaleka Youth Organization"},{"depth":3,"slug":"our-services","text":"Our Services"},{"depth":3,"slug":"contact-information","text":"Contact Information"},{"depth":3,"slug":"social-media","text":"Social Media"}];
				}

				const Content = createComponent((result, _props, slots) => {
					const { layout, ...content } = frontmatter;
					content.file = file;
					content.url = url;

					return renderTemplate`${maybeRenderHead()}${unescapeHTML(html)}`;
				});

export { Content, compiledContent, Content as default, file, frontmatter, getHeadings, rawContent, url };
