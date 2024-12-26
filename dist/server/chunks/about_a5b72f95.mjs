import { f as createComponent, i as renderTemplate, m as maybeRenderHead, u as unescapeHTML } from './astro_80255e7d.mjs';
import 'clsx';

const html = "<h1 id=\"about-dzaleka-online-services\">About Dzaleka Online Services</h1>\n<h2 id=\"our-mission\">Our Mission</h2>\n<p>Dzaleka Online Services aims to bridge the gap between refugees and essential services within Dzaleka Refugee Camp. We believe in:</p>\n<ul>\n<li><strong>Accessibility</strong>: Making information easily available to all</li>\n<li><strong>Community</strong>: Building stronger connections</li>\n<li><strong>Empowerment</strong>: Enabling self-reliance</li>\n<li><strong>Innovation</strong>: Using technology to improve lives</li>\n</ul>\n<h2 id=\"history\">History</h2>\n<p>Established in 2023, our platform emerged from the need to centralize information about services and opportunities within the camp.</p>\n<h2 id=\"impact\">Impact</h2>\n<p>We’ve helped thousands of refugees connect with:</p>\n<ul>\n<li>Educational opportunities</li>\n<li>Healthcare services</li>\n<li>Legal support</li>\n<li>Cultural programs</li>\n<li>Employment opportunities</li>\n</ul>";

				const frontmatter = {"title":"About Dzaleka Online Services","description":"Learn about our mission and how we serve the Dzaleka community","pubDate":"2023-09-14T00:00:00.000Z"};
				const file = "/Users/bakari/Downloads/dzaleka heritage archive/src/content/pages/about.md";
				const url = "/about";
				function rawContent() {
					return "\n# About Dzaleka Online Services\n\n## Our Mission\n\nDzaleka Online Services aims to bridge the gap between refugees and essential services within Dzaleka Refugee Camp. We believe in:\n\n- **Accessibility**: Making information easily available to all\n- **Community**: Building stronger connections\n- **Empowerment**: Enabling self-reliance\n- **Innovation**: Using technology to improve lives\n\n## History\n\nEstablished in 2023, our platform emerged from the need to centralize information about services and opportunities within the camp.\n\n## Impact\n\nWe've helped thousands of refugees connect with:\n- Educational opportunities\n- Healthcare services\n- Legal support\n- Cultural programs\n- Employment opportunities";
				}
				function compiledContent() {
					return html;
				}
				function getHeadings() {
					return [{"depth":1,"slug":"about-dzaleka-online-services","text":"About Dzaleka Online Services"},{"depth":2,"slug":"our-mission","text":"Our Mission"},{"depth":2,"slug":"history","text":"History"},{"depth":2,"slug":"impact","text":"Impact"}];
				}

				const Content = createComponent((result, _props, slots) => {
					const { layout, ...content } = frontmatter;
					content.file = file;
					content.url = url;

					return renderTemplate`${maybeRenderHead()}${unescapeHTML(html)}`;
				});

export { Content, compiledContent, Content as default, file, frontmatter, getHeadings, rawContent, url };
