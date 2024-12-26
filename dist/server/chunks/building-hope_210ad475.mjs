import { f as createComponent, i as renderTemplate, m as maybeRenderHead, u as unescapeHTML } from './astro_80255e7d.mjs';
import 'clsx';

const html = "<h2 id=\"about-this-photo\">About This Photo</h2>\n<p>A young man works on the construction of a shelter in Dzaleka. Working is not only a necessity to obtain means to earn a living, but also a way to regain self-esteem and self-confidence. For this reason, and to limit dependence on the increasingly scarce aid, the agencies present in the camp yearn for a relaxation of the Malawian law that allows refugees to work in the country. Although there was a promising moment, for now the legal change is stagnant. The Government has decided to merge the reform of this regulation and that of immigration policies (such as the reception and transit of migrants bound for South Africa) and other issues into a single process, leaving it bogged down in Parliament for now.</p>";

				const frontmatter = {"title":"Building Hope: The Fight for Work Rights in Dzaleka","description":"A young man in Dzaleka builds a shelter, highlighting refugees' need for work as a path to dignity and survival.","photographer":{"name":"Carlos Martinez","instagram":"dzalekaonline","website":"https://www.instagram.com/dzalekaonline/","bio":"Visual storyteller focusing on youth empowerment and innovation in refugee communities."},"image":"https://ep00.epimg.net/elpais/imagenes/2016/06/20/album/1466383678_828939_1466384971_album_normal.jpg","date":"2021-07-12T00:00:00.000Z","tags":["Employment Challenges","Shelter Construction","Self-esteem and Work"],"featured":true,"location":"Dzaleka Refugee Camp"};
				const file = "/Users/bakari/Downloads/dzaleka heritage archive/src/content/photos/building-hope.md";
				const url = undefined;
				function rawContent() {
					return "\n## About This Photo\n\nA young man works on the construction of a shelter in Dzaleka. Working is not only a necessity to obtain means to earn a living, but also a way to regain self-esteem and self-confidence. For this reason, and to limit dependence on the increasingly scarce aid, the agencies present in the camp yearn for a relaxation of the Malawian law that allows refugees to work in the country. Although there was a promising moment, for now the legal change is stagnant. The Government has decided to merge the reform of this regulation and that of immigration policies (such as the reception and transit of migrants bound for South Africa) and other issues into a single process, leaving it bogged down in Parliament for now. ";
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
