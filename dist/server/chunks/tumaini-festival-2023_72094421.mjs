import { f as createComponent, i as renderTemplate, m as maybeRenderHead, u as unescapeHTML } from './astro_80255e7d.mjs';
import 'clsx';

const html = "<h2 id=\"event-highlights\">Event Highlights</h2>\n<p>Tumaini Festival returns for its annual celebration of arts, music, and cultural exchange at Dzaleka Refugee Camp. Join us for a day filled with performances, exhibitions, and community activities.</p>\n<h3 id=\"main-stage-performances\">Main Stage Performances</h3>\n<ol>\n<li>\n<p><strong>Music</strong></p>\n<ul>\n<li>International Artists</li>\n<li>Local Bands</li>\n<li>Traditional Musicians</li>\n<li>Youth Performers</li>\n</ul>\n</li>\n<li>\n<p><strong>Dance</strong></p>\n<ul>\n<li>Traditional Dance Groups</li>\n<li>Contemporary Dance</li>\n<li>Cultural Fusion Shows</li>\n<li>Interactive Dance Sessions</li>\n</ul>\n</li>\n<li>\n<p><strong>Theater &#x26; Poetry</strong></p>\n<ul>\n<li>Drama Performances</li>\n<li>Spoken Word</li>\n<li>Poetry Recitals</li>\n<li>Storytelling Sessions</li>\n</ul>\n</li>\n</ol>\n<h3 id=\"art--culture\">Art &#x26; Culture</h3>\n<ul>\n<li>Art Exhibitions</li>\n<li>Cultural Displays</li>\n<li>Food Stalls</li>\n<li>Craft Market</li>\n<li>Interactive Workshops</li>\n</ul>\n<h3 id=\"community-activities\">Community Activities</h3>\n<ul>\n<li>Children’s Activities</li>\n<li>Community Dialogues</li>\n<li>Cultural Exchange Programs</li>\n<li>Youth Workshops</li>\n</ul>\n<h2 id=\"venue-information\">Venue Information</h2>\n<p>The festival takes place at the Main Ground in Dzaleka Refugee Camp. The venue will be transformed into multiple performance areas, exhibition spaces, and community gathering spots.</p>\n<h2 id=\"how-to-get-there\">How to Get There</h2>\n<p>Dzaleka Refugee Camp is located in Dowa District, approximately 45km from Lilongwe. Transportation options will be available from major cities.</p>";

				const frontmatter = {"title":"Tumaini Festival 2024","description":"Annual arts and cultural festival celebrating refugee talents and promoting intercultural harmony.","date":"2024-10-31T00:00:00.000Z","location":"Dzaleka Refugee Camp Main Ground, Dowa","category":"Festival","featured":true,"image":"https://idsb.tmgrup.com.tr/ly/uploads/images/2024/11/04/thumbs/800x531/353421.jpg?v=1730720194","organizer":"Tumaini Letu","status":"upcoming","contact":{"email":"festival@tumainifestival.org","phone":"+265 991 234567","whatsapp":"+265 991 234567"},"registration":{"required":false,"url":"https://tumainifestival.org/register"},"tags":["music","dance","arts","culture","community"]};
				const file = "/Users/bakari/Downloads/dzaleka heritage archive/src/content/events/tumaini-festival-2023.md";
				const url = undefined;
				function rawContent() {
					return "\n## Event Highlights\n\nTumaini Festival returns for its annual celebration of arts, music, and cultural exchange at Dzaleka Refugee Camp. Join us for a day filled with performances, exhibitions, and community activities.\n\n### Main Stage Performances\n\n1. **Music**\n   - International Artists\n   - Local Bands\n   - Traditional Musicians\n   - Youth Performers\n\n2. **Dance**\n   - Traditional Dance Groups\n   - Contemporary Dance\n   - Cultural Fusion Shows\n   - Interactive Dance Sessions\n\n3. **Theater & Poetry**\n   - Drama Performances\n   - Spoken Word\n   - Poetry Recitals\n   - Storytelling Sessions\n\n### Art & Culture\n\n- Art Exhibitions\n- Cultural Displays\n- Food Stalls\n- Craft Market\n- Interactive Workshops\n\n### Community Activities\n\n- Children's Activities\n- Community Dialogues\n- Cultural Exchange Programs\n- Youth Workshops\n\n## Venue Information\n\nThe festival takes place at the Main Ground in Dzaleka Refugee Camp. The venue will be transformed into multiple performance areas, exhibition spaces, and community gathering spots.\n\n## How to Get There\n\nDzaleka Refugee Camp is located in Dowa District, approximately 45km from Lilongwe. Transportation options will be available from major cities.";
				}
				function compiledContent() {
					return html;
				}
				function getHeadings() {
					return [{"depth":2,"slug":"event-highlights","text":"Event Highlights"},{"depth":3,"slug":"main-stage-performances","text":"Main Stage Performances"},{"depth":3,"slug":"art--culture","text":"Art & Culture"},{"depth":3,"slug":"community-activities","text":"Community Activities"},{"depth":2,"slug":"venue-information","text":"Venue Information"},{"depth":2,"slug":"how-to-get-there","text":"How to Get There"}];
				}

				const Content = createComponent((result, _props, slots) => {
					const { layout, ...content } = frontmatter;
					content.file = file;
					content.url = url;

					return renderTemplate`${maybeRenderHead()}${unescapeHTML(html)}`;
				});

export { Content, compiledContent, Content as default, file, frontmatter, getHeadings, rawContent, url };
