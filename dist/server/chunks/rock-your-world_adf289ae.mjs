import { f as createComponent, i as renderTemplate, m as maybeRenderHead, u as unescapeHTML } from './astro_80255e7d.mjs';
import 'clsx';

const html = "<h2 id=\"about-rock-your-world\">About ROCK Your World</h2>\n<p>Youth empowerment through arts and culture.</p>\n<h3 id=\"our-services\">Our Services</h3>\n<ul>\n<li>Youth empowerment</li>\n<li>Skills development</li>\n<li>Leadership training</li>\n<li>Mentorship programs</li>\n</ul>";

				const frontmatter = {"title":"ROCK Your World","category":"Youth","description":"Youth empowerment through arts and culture.","location":{"address":"Dzaleka Refugee Camp","city":"Dowa","coordinates":{"lat":-13.7833,"lng":33.9833}},"contact":{"email":"mail@rocyourworld.org","phone":"+1 (269) 929-6698","hours":"Monday-Friday, 8:00 AM - 5:00 PM"},"socialMedia":{"facebook":"https://www.facebook.com/rocyourworld/","twitter":"https://twitter.com/rocyourworld","instagram":"https://www.instagram.com/rocyourworld/","linkedin":"https://www.linkedin.com/company/refugee-outreach-collective/","website":"https://www.rocyourworld.org/"},"logo":"https://images.squarespace-cdn.com/content/v1/61c0d5390502384c3248f17a/52ed0a0a-7787-457f-b642-ec64f545bd57/Screen+Shot+2023-06-09+at+15.50.05.jpg?format=1500w","featured":false,"lastUpdated":"2024-12-24T00:00:00.000Z"};
				const file = "/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/rock-your-world.md";
				const url = undefined;
				function rawContent() {
					return "\n## About ROCK Your World\n\nYouth empowerment through arts and culture.\n\n### Our Services\n- Youth empowerment\n- Skills development\n- Leadership training\n- Mentorship programs\n";
				}
				function compiledContent() {
					return html;
				}
				function getHeadings() {
					return [{"depth":2,"slug":"about-rock-your-world","text":"About ROCK Your World"},{"depth":3,"slug":"our-services","text":"Our Services"}];
				}

				const Content = createComponent((result, _props, slots) => {
					const { layout, ...content } = frontmatter;
					content.file = file;
					content.url = url;

					return renderTemplate`${maybeRenderHead()}${unescapeHTML(html)}`;
				});

export { Content, compiledContent, Content as default, file, frontmatter, getHeadings, rawContent, url };
