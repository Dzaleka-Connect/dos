import { f as createComponent, i as renderTemplate, m as maybeRenderHead, u as unescapeHTML } from './astro_80255e7d.mjs';
import 'clsx';

const html = "<h2 id=\"about-tumaini-festival\">About Tumaini Festival</h2>\n<p>Tumaini Festival presents a unique opportunity to support an innovative cultural event, developed and delivered by refugees and Malawians, which uses entertainment and artistic expression, to promote intercultural harmony, mutual understanding, and peaceful co-existence.</p>\n<p>Tumaini Festival was founded in 2014. It is an extraordinary example of a large-scale cultural event within a refugee camp, created and run by refugees in collaboration with the host community, for the benefit of both communities.</p>\n<p>Across the six previous editions, over 99,000 people have attended the event, and 304 performing acts from across Malawi, Africa, and the world shared the same stages with performers from Dzaleka. Tumaini Festival has united 18 nationalities of performers: DRC, Rwanda, Burundi, Malawi, Zambia, Zimbabwe, Norway, Japan, Brazil, Mozambique, Belgium, UK, Italy, Somalia, Poland, France, South Africa, and South Korea.</p>\n<p>The festival gained national and international media coverage. It has so far achieved a media reach estimated at 50,000,000 people worldwide, presenting a genuinely different and positive story about refugees.</p>\n<p>Tumaini Festival has represented a unique opportunity for refugees to share aspects of their lives with interested visitors, to exhibit and sell their crafts, and to feel the hope of connecting to a wider community. Tumaini Festival has become a community celebration that residents of Dzaleka appreciate as their own event, which they are looking forward to and want to see happen regularly.</p>";

				const frontmatter = {"title":"Tumaini Festival","category":"Cultural","description":"A cultural event promoting intercultural harmony and understanding between refugees and host communities through arts and entertainment.","location":{"address":"Dzaleka Refugee Camp","city":"Dowa","coordinates":{"lat":-13.7833,"lng":33.9833}},"contact":{"email":"info@tumainifestival.org","phone":"+265 888 123456","hours":"Monday-Friday, 8:00 AM - 5:00 PM"},"socialMedia":{"facebook":"https://facebook.com/tumainifestival","twitter":"","instagram":"https://instagram.com/tumainifestival","linkedin":"","website":"https://www.tumainifestival.org/"},"logo":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVpv2zB0deKm1DCY2U8H1BonI0BJ2ZYv4qRQ&s","featured":true,"verified":true,"lastUpdated":"2024-12-24T00:00:00.000Z"};
				const file = "/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/tumaini-festival.md";
				const url = undefined;
				function rawContent() {
					return "\n## About Tumaini Festival\n\nTumaini Festival presents a unique opportunity to support an innovative cultural event, developed and delivered by refugees and Malawians, which uses entertainment and artistic expression, to promote intercultural harmony, mutual understanding, and peaceful co-existence.\n\nTumaini Festival was founded in 2014. It is an extraordinary example of a large-scale cultural event within a refugee camp, created and run by refugees in collaboration with the host community, for the benefit of both communities.\n\nAcross the six previous editions, over 99,000 people have attended the event, and 304 performing acts from across Malawi, Africa, and the world shared the same stages with performers from Dzaleka. Tumaini Festival has united 18 nationalities of performers: DRC, Rwanda, Burundi, Malawi, Zambia, Zimbabwe, Norway, Japan, Brazil, Mozambique, Belgium, UK, Italy, Somalia, Poland, France, South Africa, and South Korea.\n\nThe festival gained national and international media coverage. It has so far achieved a media reach estimated at 50,000,000 people worldwide, presenting a genuinely different and positive story about refugees.\n\nTumaini Festival has represented a unique opportunity for refugees to share aspects of their lives with interested visitors, to exhibit and sell their crafts, and to feel the hope of connecting to a wider community. Tumaini Festival has become a community celebration that residents of Dzaleka appreciate as their own event, which they are looking forward to and want to see happen regularly.\n\n\n";
				}
				function compiledContent() {
					return html;
				}
				function getHeadings() {
					return [{"depth":2,"slug":"about-tumaini-festival","text":"About Tumaini Festival"}];
				}

				const Content = createComponent((result, _props, slots) => {
					const { layout, ...content } = frontmatter;
					content.file = file;
					content.url = url;

					return renderTemplate`${maybeRenderHead()}${unescapeHTML(html)}`;
				});

export { Content, compiledContent, Content as default, file, frontmatter, getHeadings, rawContent, url };
