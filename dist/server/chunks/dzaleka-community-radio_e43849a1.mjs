import { f as createComponent, i as renderTemplate, m as maybeRenderHead, u as unescapeHTML } from './astro_80255e7d.mjs';
import 'clsx';

const html = "<h2 id=\"about-dzaleka-community-radio\">About Dzaleka Community Radio</h2>\n<p>Community-run radio providing news and entertainment.</p>\n<h3 id=\"our-services\">Our Services</h3>\n<ul>\n<li>Cultural events</li>\n<li>Arts programs</li>\n<li>Heritage preservation</li>\n<li>Community engagement</li>\n</ul>\n<h3 id=\"contact-information\">Contact Information</h3>\n<ul>\n<li><strong>Address:</strong> Dzaleka Refugee Camp, Malawi</li>\n<li><strong>Phone:</strong> +265 992 345678</li>\n<li><strong>Email:</strong> <a href=\"mailto:contact@dzalekaradio.org\">contact@dzalekaradio.org</a></li>\n</ul>";

				const frontmatter = {"title":"Dzaleka Community Radio","description":"Your voice in the community - broadcasting news, music, and stories that matter.","category":"Media","logo":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSpCzdiMDwkM37gZhpBawttg9kFqUwvbudgzQ&s","location":{"address":"Radio Station, Dzaleka Refugee Camp","city":"Dowa","coordinates":{"lat":-13.7833,"lng":33.9833}},"contact":{"email":"radio@dzaleka.org","phone":"+265 991 234567","hours":"Monday-Sunday, 6:00 AM - 10:00 PM"},"socialMedia":{"facebook":"https://facebook.com/dzalekaradio","twitter":"https://twitter.com/dzalekaradio","instagram":"https://instagram.com/dzalekaradio","website":"https://dzalekaradio.org"},"featured":true,"status":"active","lastUpdated":"2024-12-24T00:00:00.000Z"};
				const file = "/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/dzaleka-community-radio.md";
				const url = undefined;
				function rawContent() {
					return "\n## About Dzaleka Community Radio\n\nCommunity-run radio providing news and entertainment.\n\n### Our Services\n- Cultural events\n- Arts programs\n- Heritage preservation\n- Community engagement\n\n### Contact Information\n- **Address:** Dzaleka Refugee Camp, Malawi\n- **Phone:** +265 992 345678\n- **Email:** contact@dzalekaradio.org\n";
				}
				function compiledContent() {
					return html;
				}
				function getHeadings() {
					return [{"depth":2,"slug":"about-dzaleka-community-radio","text":"About Dzaleka Community Radio"},{"depth":3,"slug":"our-services","text":"Our Services"},{"depth":3,"slug":"contact-information","text":"Contact Information"}];
				}

				const Content = createComponent((result, _props, slots) => {
					const { layout, ...content } = frontmatter;
					content.file = file;
					content.url = url;

					return renderTemplate`${maybeRenderHead()}${unescapeHTML(html)}`;
				});

export { Content, compiledContent, Content as default, file, frontmatter, getHeadings, rawContent, url };
