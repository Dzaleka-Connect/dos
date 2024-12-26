import { f as createComponent, i as renderTemplate, m as maybeRenderHead, u as unescapeHTML } from './astro_80255e7d.mjs';
import 'clsx';

const html = "<h2 id=\"about-tumaini-letu\">About Tumaini Letu</h2>\n<p>Cultural events and festivals promoting refugee talents and cultural exchange.</p>\n<h3 id=\"our-services\">Our Services</h3>\n<ul>\n<li>Cultural events</li>\n<li>Arts programs</li>\n<li>Heritage preservation</li>\n<li>Community engagement</li>\n</ul>\n<h3 id=\"contact-information\">Contact Information</h3>\n<ul>\n<li><strong>Address:</strong> Dzaleka Refugee Camp, Malawi</li>\n<li><strong>Phone:</strong> +265 993 380983</li>\n<li><strong>Email:</strong> <a href=\"mailto:info@tumainiletu.org\">info@tumainiletu.org</a></li>\n<li><strong>Website:</strong> <a href=\"https://tumainiletu.org/our_work/\">Tumaini Letu</a></li>\n</ul>\n<h3 id=\"social-media\">Social Media</h3>\n<ul>\n<li><a href=\"https://www.facebook.com/tumainifestival/\">Facebook</a></li>\n<li><a href=\"https://twitter.com/TumainiFestival\">Twitter</a></li>\n<li><a href=\"https://www.instagram.com/tumainifestival/\">Instagram</a></li>\n</ul>";

				const frontmatter = {"title":"Tumaini Letu","category":"Cultural","description":"Cultural events and festivals promoting refugee talents and cultural exchange.","location":{"address":"Dzaleka Refugee Camp","city":"Dowa","coordinates":{"lat":-13.7833,"lng":33.9833}},"contact":{"email":"","phone":"","hours":"Monday-Friday, 8:00 AM - 5:00 PM"},"socialMedia":{"facebook":"","twitter":"","instagram":"","linkedin":"","website":""},"logo":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMKRbZ5uE5X6Uzh-CEvrJ17FPudQnTDCmrfQ&s","featured":false,"lastUpdated":"2024-12-24T00:00:00.000Z"};
				const file = "/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/tumaini-letu.md";
				const url = undefined;
				function rawContent() {
					return "\n## About Tumaini Letu\n\nCultural events and festivals promoting refugee talents and cultural exchange.\n\n### Our Services\n- Cultural events\n- Arts programs\n- Heritage preservation\n- Community engagement\n\n### Contact Information\n- **Address:** Dzaleka Refugee Camp, Malawi\n- **Phone:** +265 993 380983\n- **Email:** info@tumainiletu.org\n- **Website:** [Tumaini Letu](https://tumainiletu.org/our_work/)\n\n### Social Media\n- [Facebook](https://www.facebook.com/tumainifestival/)\n- [Twitter](https://twitter.com/TumainiFestival)\n- [Instagram](https://www.instagram.com/tumainifestival/)\n";
				}
				function compiledContent() {
					return html;
				}
				function getHeadings() {
					return [{"depth":2,"slug":"about-tumaini-letu","text":"About Tumaini Letu"},{"depth":3,"slug":"our-services","text":"Our Services"},{"depth":3,"slug":"contact-information","text":"Contact Information"},{"depth":3,"slug":"social-media","text":"Social Media"}];
				}

				const Content = createComponent((result, _props, slots) => {
					const { layout, ...content } = frontmatter;
					content.file = file;
					content.url = url;

					return renderTemplate`${maybeRenderHead()}${unescapeHTML(html)}`;
				});

export { Content, compiledContent, Content as default, file, frontmatter, getHeadings, rawContent, url };
