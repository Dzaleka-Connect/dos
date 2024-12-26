import { f as createComponent, i as renderTemplate, m as maybeRenderHead, u as unescapeHTML } from './astro_80255e7d.mjs';
import 'clsx';

const html = "<h2 id=\"about-this-photo\">About This Photo</h2>\n<p>Several women, with the elements that they have just received from the agencies present in the field, such as the World Food Program (WFP). The inhabitants of this camp who cannot be rehoused in other countries (that is to say, the great majority) depend almost exclusively on humanitarian assistance. The Government of Malawi, open to welcoming despite the serious problems facing the country, does not allow refugees to leave the camp or get a job. This leaves many without the possibility of subsisting or generating their own income. Some, like 35-year-old Somali Raheem, have been here since 1996 and no longer remember what it was like off the field. “I try to do things for myself that give me something to eat,” says the father of a daughter who was born two years ago in Dzaleka.</p>";

				const frontmatter = {"title":"Surviving in Dzaleka: The Struggles of Refugees Left Without Options","description":"A look at life in Dzaleka Refugee Camp, where humanitarian aid sustains most residents amidst restrictive policies and limited opportunities","photographer":{"name":"Carlos Martinez","instagram":"dzalekaonline","website":"https://www.instagram.com/dzalekaonline/","bio":"Visual storyteller focusing on youth empowerment and innovation in refugee communities."},"image":"https://ep00.epimg.net/elpais/imagenes/2016/06/20/album/1466383678_828939_1466384264_album_normal.jpg","date":"2021-07-12T00:00:00.000Z","tags":["World Food Program (WFP)","Economic Challenges","Refugee Life"],"featured":true,"location":"Dzaleka Refugee Camp"};
				const file = "/Users/bakari/Downloads/dzaleka heritage archive/src/content/photos/Surviving-in-Dzaleka.md";
				const url = undefined;
				function rawContent() {
					return "\n## About This Photo\n\nSeveral women, with the elements that they have just received from the agencies present in the field, such as the World Food Program (WFP). The inhabitants of this camp who cannot be rehoused in other countries (that is to say, the great majority) depend almost exclusively on humanitarian assistance. The Government of Malawi, open to welcoming despite the serious problems facing the country, does not allow refugees to leave the camp or get a job. This leaves many without the possibility of subsisting or generating their own income. Some, like 35-year-old Somali Raheem, have been here since 1996 and no longer remember what it was like off the field. \"I try to do things for myself that give me something to eat,\" says the father of a daughter who was born two years ago in Dzaleka. ";
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
