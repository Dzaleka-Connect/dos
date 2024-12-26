import { f as createComponent, i as renderTemplate, m as maybeRenderHead, u as unescapeHTML } from './astro_80255e7d.mjs';
import 'clsx';

const html = "<h2 id=\"about-this-photo\">About This Photo</h2>\n<p>Despite some backlash, initially,  from her community and family for being the only female DJ playing at clubs within the camp, 24-year-old Goldine, also known as DJ La Pearl, has held on to her passion for music since she arrived here 10 years ago from the Democratic Republic of Congo (DRC).</p>\n<p>She had always been particularly curious as to how DJs could switch to music so smoothly. Noting her love for mixing music, a friend in the camp began to teach her how to DJ and had her DJ at a club in the camp after only two weeks of practise!</p>\n<p>“After I started playing at clubs, people would say so many negative things like, ‘Girls should not do such kind of things’ or ‘She’s losing her morals’. But music is my passion and it makes me feel good, it makes me forget bad things whenever I see people happy and enjoying themselves.” Breaking stereotypes, DJ La Pearl is making waves and has started playing sets outside of the camp. And lucky enough, her family has come to accept and support her for it</p>";

				const frontmatter = {"title":"Breaking Barriers: DJ La Pearl Spins Hope in Dzaleka","description":"DJ La Pearl, a Congolese refugee in Dzaleka, defies stereotypes to pursue her passion for music.","photographer":{"name":"WFP/Badre Bahaji","instagram":"badrebahaji","website":"https://mw.linkedin.com/in/badre-bahaji-1bb67942","bio":"Photography based in Uganda"},"image":"https://www.wfp.org/sites/default/files/styles/media_embed/public/2021-06/20210518_MWI_Badre-Bahaji_IO_-6.JPG?itok=Gg7-hCsz","date":"2021-06-18T00:00:00.000Z","tags":["Female Empowerment","Breaking Stereotypes","DJ La Pearl"],"featured":true,"location":"Dzaleka Refugee Camp"};
				const file = "/Users/bakari/Downloads/dzaleka heritage archive/src/content/photos/La-Pearl-DJ.md";
				const url = undefined;
				function rawContent() {
					return "\n## About This Photo\n\nDespite some backlash, initially,  from her community and family for being the only female DJ playing at clubs within the camp, 24-year-old Goldine, also known as DJ La Pearl, has held on to her passion for music since she arrived here 10 years ago from the Democratic Republic of Congo (DRC).\n\nShe had always been particularly curious as to how DJs could switch to music so smoothly. Noting her love for mixing music, a friend in the camp began to teach her how to DJ and had her DJ at a club in the camp after only two weeks of practise!\n\n“After I started playing at clubs, people would say so many negative things like, ‘Girls should not do such kind of things’ or ‘She’s losing her morals’. But music is my passion and it makes me feel good, it makes me forget bad things whenever I see people happy and enjoying themselves.” Breaking stereotypes, DJ La Pearl is making waves and has started playing sets outside of the camp. And lucky enough, her family has come to accept and support her for it";
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
