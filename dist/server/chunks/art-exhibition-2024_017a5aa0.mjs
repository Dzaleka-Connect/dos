import { f as createComponent, i as renderTemplate, m as maybeRenderHead, u as unescapeHTML } from './astro_80255e7d.mjs';
import 'clsx';

const html = "<h2 id=\"exhibition-overview\">Exhibition Overview</h2>\n<p>Join us for a powerful art exhibition showcasing the creative talents and personal narratives of refugee artists at Dzaleka Refugee Camp. “Stories Through Art” brings together diverse artistic expressions that capture experiences, dreams, and cultural heritage.</p>\n<h3 id=\"featured-works\">Featured Works</h3>\n<ol>\n<li>\n<p><strong>Paintings &#x26; Drawings</strong></p>\n<ul>\n<li>Traditional and contemporary styles</li>\n<li>Mixed media artworks</li>\n<li>Portrait series</li>\n<li>Abstract expressions</li>\n</ul>\n</li>\n<li>\n<p><strong>Sculptures &#x26; Installations</strong></p>\n<ul>\n<li>Found object sculptures</li>\n<li>Traditional crafts</li>\n<li>Contemporary installations</li>\n<li>Community art projects</li>\n</ul>\n</li>\n<li>\n<p><strong>Photography</strong></p>\n<ul>\n<li>Documentary series</li>\n<li>Portrait collections</li>\n<li>Life in Dzaleka</li>\n<li>Cultural celebrations</li>\n</ul>\n</li>\n</ol>\n<h3 id=\"special-events\">Special Events</h3>\n<ul>\n<li>Artist talks and presentations</li>\n<li>Live art demonstrations</li>\n<li>Interactive workshops</li>\n<li>Guided tours</li>\n<li>Community discussions</li>\n</ul>\n<h3 id=\"exhibition-space\">Exhibition Space</h3>\n<p>The exhibition will be held at the Dzaleka Art Center, featuring multiple gallery spaces and an outdoor installation area. The venue has been specially arranged to create an immersive experience that honors each artist’s unique perspective.</p>\n<h3 id=\"visitor-information\">Visitor Information</h3>\n<ul>\n<li>Free admission</li>\n<li>Guided tours available</li>\n<li>Art pieces available for purchase</li>\n<li>Refreshments provided</li>\n</ul>";

				const frontmatter = {"title":"Stories Through Art: Refugee Narratives","description":"A powerful exhibition featuring artworks that tell stories of hope, resilience, and cultural identity.","date":"2024-02-28T00:00:00.000Z","location":"Dzaleka Art Center, Dzaleka Refugee Camp, Dowa","category":"Exhibition","featured":true,"image":"/images/events/art-exhibition-2024.jpg","organizer":"Dzaleka Art Project","status":"upcoming","contact":{"email":"exhibition@dzaleka.org","phone":"+265 991 234567","whatsapp":"+265 991 234567"},"registration":{"required":true,"url":"https://dzaleka.org/art-exhibition-2024"},"tags":["art","culture","exhibition","community"]};
				const file = "/Users/bakari/Downloads/dzaleka heritage archive/src/content/events/art-exhibition-2024.md";
				const url = undefined;
				function rawContent() {
					return "\n## Exhibition Overview\n\nJoin us for a powerful art exhibition showcasing the creative talents and personal narratives of refugee artists at Dzaleka Refugee Camp. \"Stories Through Art\" brings together diverse artistic expressions that capture experiences, dreams, and cultural heritage.\n\n### Featured Works\n\n1. **Paintings & Drawings**\n   - Traditional and contemporary styles\n   - Mixed media artworks\n   - Portrait series\n   - Abstract expressions\n\n2. **Sculptures & Installations**\n   - Found object sculptures\n   - Traditional crafts\n   - Contemporary installations\n   - Community art projects\n\n3. **Photography**\n   - Documentary series\n   - Portrait collections\n   - Life in Dzaleka\n   - Cultural celebrations\n\n### Special Events\n\n- Artist talks and presentations\n- Live art demonstrations\n- Interactive workshops\n- Guided tours\n- Community discussions\n\n### Exhibition Space\n\nThe exhibition will be held at the Dzaleka Art Center, featuring multiple gallery spaces and an outdoor installation area. The venue has been specially arranged to create an immersive experience that honors each artist's unique perspective.\n\n### Visitor Information\n\n- Free admission\n- Guided tours available\n- Art pieces available for purchase\n- Refreshments provided";
				}
				function compiledContent() {
					return html;
				}
				function getHeadings() {
					return [{"depth":2,"slug":"exhibition-overview","text":"Exhibition Overview"},{"depth":3,"slug":"featured-works","text":"Featured Works"},{"depth":3,"slug":"special-events","text":"Special Events"},{"depth":3,"slug":"exhibition-space","text":"Exhibition Space"},{"depth":3,"slug":"visitor-information","text":"Visitor Information"}];
				}

				const Content = createComponent((result, _props, slots) => {
					const { layout, ...content } = frontmatter;
					content.file = file;
					content.url = url;

					return renderTemplate`${maybeRenderHead()}${unescapeHTML(html)}`;
				});

export { Content, compiledContent, Content as default, file, frontmatter, getHeadings, rawContent, url };
