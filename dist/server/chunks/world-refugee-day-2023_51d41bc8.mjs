import { f as createComponent, i as renderTemplate, m as maybeRenderHead, u as unescapeHTML } from './astro_80255e7d.mjs';
import 'clsx';

const html = "<h2 id=\"event-overview\">Event Overview</h2>\n<p>Join us for a day of celebration, reflection, and community as we commemorate World Refugee Day. This annual event brings together refugees, host communities, and supporters to celebrate achievements and raise awareness about refugee rights and experiences.</p>\n<h3 id=\"program-highlights\">Program Highlights</h3>\n<ol>\n<li>\n<p><strong>Official Ceremony</strong></p>\n<ul>\n<li>Welcome speeches</li>\n<li>Cultural performances</li>\n<li>Award presentations</li>\n<li>Community recognitions</li>\n</ul>\n</li>\n<li>\n<p><strong>Cultural Showcase</strong></p>\n<ul>\n<li>Traditional music and dance</li>\n<li>Art exhibitions</li>\n<li>Fashion show</li>\n<li>Food festival</li>\n</ul>\n</li>\n<li>\n<p><strong>Community Activities</strong></p>\n<ul>\n<li>Sports tournaments</li>\n<li>Children’s activities</li>\n<li>Youth performances</li>\n<li>Interactive workshops</li>\n</ul>\n</li>\n</ol>\n<h3 id=\"special-features\">Special Features</h3>\n<ul>\n<li>Photo exhibition</li>\n<li>Documentary screenings</li>\n<li>Craft market</li>\n<li>Food stalls</li>\n<li>Information booths</li>\n</ul>\n<h3 id=\"venue-information\">Venue Information</h3>\n<p>The celebration will take place at the main ground in Dzaleka Refugee Camp, with multiple activity areas and stages set up throughout the venue.</p>\n<h3 id=\"visitor-information\">Visitor Information</h3>\n<ul>\n<li>Free entry for all</li>\n<li>Family-friendly event</li>\n<li>Food and refreshments available</li>\n<li>Parking provided</li>\n</ul>";

				const frontmatter = {"title":"World Refugee Day Celebration 2024","description":"Join us in commemorating World Refugee Day with cultural performances, exhibitions, and community activities.","date":"2024-06-20T00:00:00.000Z","location":"Dzaleka Refugee Camp Main Ground, Dowa","category":"Community","featured":true,"image":"/images/events/world-refugee-day-2024.jpg","organizer":"UNHCR Malawi","status":"past","contact":{"email":"info@unhcr.org","phone":"+265 1 771 027","whatsapp":"+265 991 234567"},"registration":{"required":false,"url":"https://www.unhcr.org/world-refugee-day"},"tags":["community","culture","celebration","advocacy"]};
				const file = "/Users/bakari/Downloads/dzaleka heritage archive/src/content/events/world-refugee-day-2023.md";
				const url = undefined;
				function rawContent() {
					return "\n## Event Overview\n\nJoin us for a day of celebration, reflection, and community as we commemorate World Refugee Day. This annual event brings together refugees, host communities, and supporters to celebrate achievements and raise awareness about refugee rights and experiences.\n\n### Program Highlights\n\n1. **Official Ceremony**\n   - Welcome speeches\n   - Cultural performances\n   - Award presentations\n   - Community recognitions\n\n2. **Cultural Showcase**\n   - Traditional music and dance\n   - Art exhibitions\n   - Fashion show\n   - Food festival\n\n3. **Community Activities**\n   - Sports tournaments\n   - Children's activities\n   - Youth performances\n   - Interactive workshops\n\n### Special Features\n\n- Photo exhibition\n- Documentary screenings\n- Craft market\n- Food stalls\n- Information booths\n\n### Venue Information\n\nThe celebration will take place at the main ground in Dzaleka Refugee Camp, with multiple activity areas and stages set up throughout the venue.\n\n### Visitor Information\n\n- Free entry for all\n- Family-friendly event\n- Food and refreshments available\n- Parking provided";
				}
				function compiledContent() {
					return html;
				}
				function getHeadings() {
					return [{"depth":2,"slug":"event-overview","text":"Event Overview"},{"depth":3,"slug":"program-highlights","text":"Program Highlights"},{"depth":3,"slug":"special-features","text":"Special Features"},{"depth":3,"slug":"venue-information","text":"Venue Information"},{"depth":3,"slug":"visitor-information","text":"Visitor Information"}];
				}

				const Content = createComponent((result, _props, slots) => {
					const { layout, ...content } = frontmatter;
					content.file = file;
					content.url = url;

					return renderTemplate`${maybeRenderHead()}${unescapeHTML(html)}`;
				});

export { Content, compiledContent, Content as default, file, frontmatter, getHeadings, rawContent, url };
