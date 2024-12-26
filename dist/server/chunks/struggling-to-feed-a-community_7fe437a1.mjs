import { f as createComponent, i as renderTemplate, m as maybeRenderHead, u as unescapeHTML } from './astro_80255e7d.mjs';
import 'clsx';

const html = "<h2 id=\"about-this-photo\">About This Photo</h2>\n<p>A girl in front of a makeshift food stall in Dzaleka. Providing food to the inhabitants of the enclosure is a priority that, for now, is only covered until August, according to the World Food Program. From June to December of last year, the rations - already limited to only the basics: corn, legumes and vegetable oil - had to be cut in half. “This is an almost forgotten story, and we did not get more donor support,” insists Mietek Maj, WFP’s Deputy Director in Malawi. Lack of food is the main complaint of the refugees.</p>";

				const frontmatter = {"title":"Struggling to Feed a Community: Food Insecurity in Dzaleka","description":"Dzaleka Refugee Camp faces severe food shortages, with rations reduced to basics and donor support waning.","photographer":{"name":"Carlos Martinez","instagram":"dzalekaonline","website":"https://www.instagram.com/dzalekaonline/","bio":"Visual storyteller focusing on youth empowerment and innovation in refugee communities."},"image":"https://ep00.epimg.net/elpais/imagenes/2016/06/20/album/1466383678_828939_1466384969_album_normal.jpg","date":"2021-07-12T00:00:00.000Z","tags":["Food Insecurity","World Food Program (WFP)","Humanitarian Aid Challenges"],"featured":true,"location":"Dzaleka Refugee Camp"};
				const file = "/Users/bakari/Downloads/dzaleka heritage archive/src/content/photos/struggling-to-feed-a-community.md";
				const url = undefined;
				function rawContent() {
					return "\n## About This Photo\n\nA girl in front of a makeshift food stall in Dzaleka. Providing food to the inhabitants of the enclosure is a priority that, for now, is only covered until August, according to the World Food Program. From June to December of last year, the rations - already limited to only the basics: corn, legumes and vegetable oil - had to be cut in half. \"This is an almost forgotten story, and we did not get more donor support,\" insists Mietek Maj, WFP's Deputy Director in Malawi. Lack of food is the main complaint of the refugees.";
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
