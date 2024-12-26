import { f as createComponent, i as renderTemplate, m as maybeRenderHead, u as unescapeHTML } from './astro_80255e7d.mjs';
import 'clsx';

const html = "<h2 id=\"about-dzaleka-art-project\">About Dzaleka Art Project</h2>\n<p>Promoting refugee artists and cultural expression.</p>\n<h3 id=\"our-services\">Our Services</h3>\n<ul>\n<li>Cultural events</li>\n<li>Arts programs</li>\n<li>Heritage preservation</li>\n<li>Community engagement</li>\n</ul>\n<h3 id=\"contact-information\">Contact Information</h3>\n<ul>\n<li><strong>Address:</strong> Dzaleka Refugee Camp, Malawi</li>\n<li><strong>Phone:</strong> +265 992 123456</li>\n<li><strong>Email:</strong> <a href=\"mailto:info@dzalekaartproject.com\">info@dzalekaartproject.com</a></li>\n<li><strong>Website:</strong> <a href=\"https://www.dzalekaartproject.com/\">Dzaleka Art Project</a></li>\n</ul>\n<h3 id=\"social-media\">Social Media</h3>\n<ul>\n<li><a href=\"https://www.facebook.com/dzalekaartproject/\">Facebook</a></li>\n<li><a href=\"https://www.instagram.com/dzalekaartproject/\">Instagram</a></li>\n</ul>";

				const frontmatter = {"title":"Dzaleka Art Project","category":"Cultural","description":"Promoting refugee artists and cultural expression.","location":{"address":"Dzaleka Refugee Camp","city":"Dowa","coordinates":{"lat":-13.7833,"lng":33.9833}},"contact":{"email":"","phone":"","hours":"Monday-Friday, 8:00 AM - 5:00 PM"},"socialMedia":{"facebook":"","twitter":"","instagram":"","linkedin":"","website":""},"logo":"https://www.dzalekaartproject.com/images/visual%20arts%20images/Art1080x1080.jpg","featured":false,"lastUpdated":"2024-12-24T00:00:00.000Z"};
				const file = "/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/dzaleka-art-project.md";
				const url = undefined;
				function rawContent() {
					return "\n## About Dzaleka Art Project\n\nPromoting refugee artists and cultural expression.\n\n### Our Services\n- Cultural events\n- Arts programs\n- Heritage preservation\n- Community engagement\n\n### Contact Information\n- **Address:** Dzaleka Refugee Camp, Malawi\n- **Phone:** +265 992 123456\n- **Email:** info@dzalekaartproject.com\n- **Website:** [Dzaleka Art Project](https://www.dzalekaartproject.com/)\n\n### Social Media\n- [Facebook](https://www.facebook.com/dzalekaartproject/)\n- [Instagram](https://www.instagram.com/dzalekaartproject/)\n";
				}
				function compiledContent() {
					return html;
				}
				function getHeadings() {
					return [{"depth":2,"slug":"about-dzaleka-art-project","text":"About Dzaleka Art Project"},{"depth":3,"slug":"our-services","text":"Our Services"},{"depth":3,"slug":"contact-information","text":"Contact Information"},{"depth":3,"slug":"social-media","text":"Social Media"}];
				}

				const Content = createComponent((result, _props, slots) => {
					const { layout, ...content } = frontmatter;
					content.file = file;
					content.url = url;

					return renderTemplate`${maybeRenderHead()}${unescapeHTML(html)}`;
				});

export { Content, compiledContent, Content as default, file, frontmatter, getHeadings, rawContent, url };
