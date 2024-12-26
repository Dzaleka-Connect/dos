import { f as createComponent, i as renderTemplate, m as maybeRenderHead, u as unescapeHTML } from './astro_80255e7d.mjs';
import 'clsx';

const html = "<h2 id=\"about-this-photo\">About This Photo</h2>\n<p>Junior Mafia is an upcoming music giant and entrepreneur. Still in secondary school, the 16-year-old was born in Dzaleka to parents who fled DRC. He is a beatmaker and producer who has learnt his craft by studying producers and artists within the camp. In 2018, aged 14, Junior created his very first beat and since then has built his own makeshift studio in the camp. “Now that I have a studio, I even offer recording for up and coming artists in and outside the camp,” says Junior. By sharing his passion, Junior plans to become one of the biggest producers in Malawi.</p>";

				const frontmatter = {"title":"Beats of Ambition: Junior Mafia’s Rise from Dzaleka","description":"Junior Mafia, a 16-year-old beatmaker from Dzaleka, is building his future in music production. With a makeshift studio and big ambitions, he’s empowering fellow artists and aiming for national recognition.","photographer":{"name":"WFP/Badre Bahaji","instagram":"badrebahaji","website":"https://mw.linkedin.com/in/badre-bahaji-1bb67942","bio":"Photography based in Uganda"},"image":"https://www.wfp.org/sites/default/files/styles/media_embed/public/2021-06/Malawi%206.jpg?itok=ZVa_Nfs0","date":"2021-06-18T00:00:00.000Z","tags":["Young Entrepreneur","Music Production","Refugee Talent","Congolese Refugee"],"featured":true,"location":"Dzaleka Refugee Camp"};
				const file = "/Users/bakari/Downloads/dzaleka heritage archive/src/content/photos/Junior-Mafia.md";
				const url = undefined;
				function rawContent() {
					return "\n## About This Photo\n\nJunior Mafia is an upcoming music giant and entrepreneur. Still in secondary school, the 16-year-old was born in Dzaleka to parents who fled DRC. He is a beatmaker and producer who has learnt his craft by studying producers and artists within the camp. In 2018, aged 14, Junior created his very first beat and since then has built his own makeshift studio in the camp. “Now that I have a studio, I even offer recording for up and coming artists in and outside the camp,” says Junior. By sharing his passion, Junior plans to become one of the biggest producers in Malawi. \n\n\n";
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
