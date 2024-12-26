import { f as createComponent, i as renderTemplate, m as maybeRenderHead, u as unescapeHTML } from './astro_80255e7d.mjs';
import 'clsx';

const html = "<h2 id=\"about-this-photo\">About This Photo</h2>\n<p>Obadiah always had a passion for music, having learned several instruments back home in DRC. Since he arrived at Dzaleka, he has been honing his talent. “When I sing, I forget all the bad things and get hopeful for the future,” he says as he tunes his guitar. By playing at festivals and events within the camp, Obadiah has met artists from Lilongwe who invited him to play alongside them during festivals.</p>\n<p>COVID-19, of course, put an end to that, but he still plays. “I have still been practising and I am hoping that I can get back to performing soon when this [pandemic] is over,” he says. Using the music as his escape, Obadiah is now telling the story of how he left the chaos behind.</p>";

				const frontmatter = {"title":"Strings of Hope: Obadiah’s Journey Through Music in Dzaleka","description":"Obadiah, a Congolese musician in Dzaleka, finds hope through music. Despite COVID-19 interruptions, he continues to play, sharing his story and striving to return to the stage.","photographer":{"name":"WFP/Badre Bahaji","instagram":"badrebahaji","website":"https://mw.linkedin.com/in/badre-bahaji-1bb67942","bio":"Photography based in Uganda"},"image":"https://www.wfp.org/sites/default/files/styles/media_embed/public/2021-06/Malawi%204.jpg?itok=tzu5xhKc","date":"2021-06-18T00:00:00.000Z","tags":["Refugee Talent","Music as Therapy","Artistic Resilience","Festival Performer"],"featured":true,"location":"Dzaleka Refugee Camp"};
				const file = "/Users/bakari/Downloads/dzaleka heritage archive/src/content/photos/Obadiah.md";
				const url = undefined;
				function rawContent() {
					return "\n## About This Photo\n\nObadiah always had a passion for music, having learned several instruments back home in DRC. Since he arrived at Dzaleka, he has been honing his talent. “When I sing, I forget all the bad things and get hopeful for the future,” he says as he tunes his guitar. By playing at festivals and events within the camp, Obadiah has met artists from Lilongwe who invited him to play alongside them during festivals.  \n\nCOVID-19, of course, put an end to that, but he still plays. “I have still been practising and I am hoping that I can get back to performing soon when this [pandemic] is over,” he says. Using the music as his escape, Obadiah is now telling the story of how he left the chaos behind.";
				}
				function compiledContent() {
					return html;
				}
				function getHeadings() {
					return [{"depth":2,"slug":"about-this-photo","text":"About This Photo"}];
				}

				const Content = createComponent((result, _props, slots) => {
					const { layout, ...content } = frontmatter;
					content.file = file;
					content.url = url;

					return renderTemplate`${maybeRenderHead()}${unescapeHTML(html)}`;
				});

export { Content, compiledContent, Content as default, file, frontmatter, getHeadings, rawContent, url };
