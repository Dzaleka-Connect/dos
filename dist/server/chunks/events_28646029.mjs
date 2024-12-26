import { f as createComponent, i as renderTemplate, m as maybeRenderHead, u as unescapeHTML } from './astro_80255e7d.mjs';
import 'clsx';

const html = "<h1 id=\"cultural-events\">Cultural Events</h1>\n<h2 id=\"upcoming-events\">Upcoming Events</h2>\n<h3 id=\"tumaini-festival-2023\">Tumaini Festival 2023</h3>\n<ul>\n<li><strong>Date</strong>: November 2023</li>\n<li><strong>Location</strong>: Dzaleka Refugee Camp</li>\n<li><strong>Description</strong>: Annual arts and cultural festival celebrating refugee talents</li>\n</ul>\n<h3 id=\"youth-innovation-workshop\">Youth Innovation Workshop</h3>\n<ul>\n<li><strong>Date</strong>: October 2023</li>\n<li><strong>Location</strong>: Community Center</li>\n<li><strong>Description</strong>: Workshop focusing on technology and entrepreneurship</li>\n</ul>\n<h2 id=\"past-events\">Past Events</h2>\n<h3 id=\"world-refugee-day-2023\">World Refugee Day 2023</h3>\n<ul>\n<li><strong>Date</strong>: June 20, 2023</li>\n<li><strong>Description</strong>: Celebration of refugee achievements and cultural diversity</li>\n</ul>\n<h3 id=\"art-exhibition\">Art Exhibition</h3>\n<ul>\n<li><strong>Date</strong>: August 2023</li>\n<li><strong>Description</strong>: Showcase of artwork by refugee artists</li>\n</ul>";

				const frontmatter = {"title":"Cultural Events","description":"Discover upcoming and past cultural events in Dzaleka","pubDate":"2023-09-14T00:00:00.000Z"};
				const file = "/Users/bakari/Downloads/dzaleka heritage archive/src/content/pages/events.md";
				const url = "/events";
				function rawContent() {
					return "\n# Cultural Events\n\n## Upcoming Events\n\n### Tumaini Festival 2023\n- **Date**: November 2023\n- **Location**: Dzaleka Refugee Camp\n- **Description**: Annual arts and cultural festival celebrating refugee talents\n\n### Youth Innovation Workshop\n- **Date**: October 2023\n- **Location**: Community Center\n- **Description**: Workshop focusing on technology and entrepreneurship\n\n## Past Events\n\n### World Refugee Day 2023\n- **Date**: June 20, 2023\n- **Description**: Celebration of refugee achievements and cultural diversity\n\n### Art Exhibition\n- **Date**: August 2023\n- **Description**: Showcase of artwork by refugee artists";
				}
				function compiledContent() {
					return html;
				}
				function getHeadings() {
					return [{"depth":1,"slug":"cultural-events","text":"Cultural Events"},{"depth":2,"slug":"upcoming-events","text":"Upcoming Events"},{"depth":3,"slug":"tumaini-festival-2023","text":"Tumaini Festival 2023"},{"depth":3,"slug":"youth-innovation-workshop","text":"Youth Innovation Workshop"},{"depth":2,"slug":"past-events","text":"Past Events"},{"depth":3,"slug":"world-refugee-day-2023","text":"World Refugee Day 2023"},{"depth":3,"slug":"art-exhibition","text":"Art Exhibition"}];
				}

				const Content = createComponent((result, _props, slots) => {
					const { layout, ...content } = frontmatter;
					content.file = file;
					content.url = url;

					return renderTemplate`${maybeRenderHead()}${unescapeHTML(html)}`;
				});

export { Content, compiledContent, Content as default, file, frontmatter, getHeadings, rawContent, url };
