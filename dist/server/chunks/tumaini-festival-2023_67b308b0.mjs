import { f as createComponent, i as renderTemplate, m as maybeRenderHead, u as unescapeHTML } from './astro_80255e7d.mjs';
import 'clsx';

const html = "<h2 id=\"about-this-photo\">About This Photo</h2>\n<p>This image captures the main stage performance during Tumaini Festival 2023, where artists from different backgrounds came together to celebrate unity through music. The festival, now in its 10th year, continues to break barriers and build bridges between communities.</p>\n<h3 id=\"technical-details\">Technical Details</h3>\n<ul>\n<li>Camera: Sony A7III</li>\n<li>Lens: 24-70mm f/2.8</li>\n<li>Settings: 1/250s, f/4, ISO 400</li>\n</ul>\n<h3 id=\"story-behind-the-shot\">Story Behind the Shot</h3>\n<p>The moment captured here represents the peak of the evening performance, when traditional African drums merged with modern beats, creating an unforgettable fusion of sounds and cultures.</p>";

				const frontmatter = {"title":"Tumaini Festival 2023","description":"Capturing the vibrant energy and cultural diversity at Tumaini Festival, where music, dance, and art unite the community.","photographer":{"name":"Jean-Paul Mafuko","instagram":"jeanpaulmafuko","website":"https://jeanpaulmafuko.com","bio":"Documentary photographer based in Dzaleka, capturing stories of resilience and hope."},"image":"/images/gallery/tumaini-2023-main.jpg","date":"2023-11-25T00:00:00.000Z","tags":["Festival","Culture","Music","Dance"],"featured":true,"location":"Dzaleka Refugee Camp"};
				const file = "/Users/bakari/Downloads/dzaleka heritage archive/src/content/photos/tumaini-festival-2023.md";
				const url = undefined;
				function rawContent() {
					return "\n## About This Photo\n\nThis image captures the main stage performance during Tumaini Festival 2023, where artists from different backgrounds came together to celebrate unity through music. The festival, now in its 10th year, continues to break barriers and build bridges between communities.\n\n### Technical Details\n- Camera: Sony A7III\n- Lens: 24-70mm f/2.8\n- Settings: 1/250s, f/4, ISO 400\n\n### Story Behind the Shot\nThe moment captured here represents the peak of the evening performance, when traditional African drums merged with modern beats, creating an unforgettable fusion of sounds and cultures.";
				}
				function compiledContent() {
					return html;
				}
				function getHeadings() {
					return [{"depth":2,"slug":"about-this-photo","text":"About This Photo"},{"depth":3,"slug":"technical-details","text":"Technical Details"},{"depth":3,"slug":"story-behind-the-shot","text":"Story Behind the Shot"}];
				}

				const Content = createComponent((result, _props, slots) => {
					const { layout, ...content } = frontmatter;
					content.file = file;
					content.url = url;

					return renderTemplate`${maybeRenderHead()}${unescapeHTML(html)}`;
				});

export { Content, compiledContent, Content as default, file, frontmatter, getHeadings, rawContent, url };
