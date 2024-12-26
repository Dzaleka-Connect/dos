import { f as createComponent, i as renderTemplate, m as maybeRenderHead, u as unescapeHTML } from './astro_80255e7d.mjs';
import 'clsx';

const html = "<h2 id=\"event-overview\">Event Overview</h2>\n<p>Experience the rich cultural heritage of Dzaleka through an evening of mesmerizing dance performances. This showcase brings together traditional and contemporary dance forms from various refugee communities.</p>\n<h3 id=\"performance-schedule\">Performance Schedule</h3>\n<ol>\n<li>\n<p><strong>Traditional Dances</strong></p>\n<ul>\n<li>Burundian Traditional Dance</li>\n<li>Congolese Soukous</li>\n<li>Ethiopian Folk Dance</li>\n<li>Rwandan Intore Dance</li>\n</ul>\n</li>\n<li>\n<p><strong>Contemporary Fusion</strong></p>\n<ul>\n<li>Modern African Dance</li>\n<li>Hip-Hop Fusion</li>\n<li>Contemporary Ballet</li>\n<li>Urban Dance Styles</li>\n</ul>\n</li>\n<li>\n<p><strong>Community Performances</strong></p>\n<ul>\n<li>Youth Dance Groups</li>\n<li>Children’s Dance Ensemble</li>\n<li>Senior Dance Circle</li>\n<li>Inter-Cultural Dance Teams</li>\n</ul>\n</li>\n</ol>\n<h3 id=\"special-features\">Special Features</h3>\n<ul>\n<li>Live music accompaniment</li>\n<li>Traditional costumes</li>\n<li>Cultural storytelling</li>\n<li>Interactive dance sessions</li>\n</ul>\n<h3 id=\"venue-information\">Venue Information</h3>\n<p>The showcase will be held at the Dzaleka Community Center’s main hall, which has been specially prepared for dance performances with proper flooring and lighting.</p>\n<h3 id=\"visitor-information\">Visitor Information</h3>\n<ul>\n<li>Limited seating available</li>\n<li>Advance registration required</li>\n<li>Photography permitted</li>\n<li>Traditional refreshments available</li>\n</ul>";

				const frontmatter = {"title":"Cultural Dance Showcase 2024","description":"A vibrant celebration of traditional and contemporary dance forms from various refugee communities.","date":"2024-03-15T00:00:00.000Z","location":"Dzaleka Community Center, Dzaleka Refugee Camp, Dowa","category":"Performance","featured":true,"image":"/images/events/cultural-dance-2024.jpg","organizer":"Dzaleka Cultural Association","status":"upcoming","contact":{"email":"culture@dzaleka.org","phone":"+265 991 234567","whatsapp":"+265 991 234567"},"registration":{"required":true,"url":"https://dzaleka.org/dance-showcase-2024"},"tags":["dance","culture","performance","community"]};
				const file = "/Users/bakari/Downloads/dzaleka heritage archive/src/content/events/cultural-dance-showcase.md";
				const url = undefined;
				function rawContent() {
					return "\n## Event Overview\n\nExperience the rich cultural heritage of Dzaleka through an evening of mesmerizing dance performances. This showcase brings together traditional and contemporary dance forms from various refugee communities.\n\n### Performance Schedule\n\n1. **Traditional Dances**\n   - Burundian Traditional Dance\n   - Congolese Soukous\n   - Ethiopian Folk Dance\n   - Rwandan Intore Dance\n\n2. **Contemporary Fusion**\n   - Modern African Dance\n   - Hip-Hop Fusion\n   - Contemporary Ballet\n   - Urban Dance Styles\n\n3. **Community Performances**\n   - Youth Dance Groups\n   - Children's Dance Ensemble\n   - Senior Dance Circle\n   - Inter-Cultural Dance Teams\n\n### Special Features\n\n- Live music accompaniment\n- Traditional costumes\n- Cultural storytelling\n- Interactive dance sessions\n\n### Venue Information\n\nThe showcase will be held at the Dzaleka Community Center's main hall, which has been specially prepared for dance performances with proper flooring and lighting.\n\n### Visitor Information\n\n- Limited seating available\n- Advance registration required\n- Photography permitted\n- Traditional refreshments available";
				}
				function compiledContent() {
					return html;
				}
				function getHeadings() {
					return [{"depth":2,"slug":"event-overview","text":"Event Overview"},{"depth":3,"slug":"performance-schedule","text":"Performance Schedule"},{"depth":3,"slug":"special-features","text":"Special Features"},{"depth":3,"slug":"venue-information","text":"Venue Information"},{"depth":3,"slug":"visitor-information","text":"Visitor Information"}];
				}

				const Content = createComponent((result, _props, slots) => {
					const { layout, ...content } = frontmatter;
					content.file = file;
					content.url = url;

					return renderTemplate`${maybeRenderHead()}${unescapeHTML(html)}`;
				});

export { Content, compiledContent, Content as default, file, frontmatter, getHeadings, rawContent, url };
