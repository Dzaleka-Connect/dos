import { f as createComponent, i as renderTemplate, m as maybeRenderHead, u as unescapeHTML } from './astro_80255e7d.mjs';
import 'clsx';

const html = "<h2 id=\"about-this-photo\">About This Photo</h2>\n<p>A man collects cardboard from the Dzaleka distribution center after a distribution of blankets and other supplies. “Before we focused on meeting the most basic needs,” explains Enid Ochieng, head of UNHCR in Malawi.</p>\n<h3 id=\"technical-details\">Technical Details</h3>\n<ul>\n<li>Camera: Sony A7III</li>\n<li>Lens: 24-70mm f/2.8</li>\n<li>Settings: 1/250s, f/4, ISO 400</li>\n</ul>\n<h3 id=\"story-behind-the-shot\">Story Behind the Shot</h3>\n<p>”Now, we don’t even get to that.” Due to budgetary constraints, the newcomers have practically nothing to raise a roof with and UNHCR, which manages the compound together with the Malawian government, has trouble even providing them with plastic tarps. “Donors have been helping here for many years. And there are other crises [even in Malawi itself, through whose southern border thousands of Mozambicans flee from violence] which makes it not so easy right now to sell Dzaleka to the world again, ”says Kelvin S. Sentala, assistant to Unhcr field. CARLOS MARTINEZ</p>";

				const frontmatter = {"title":"A Man Collects Cardboard After Blanket Distribution","description":"A man collects cardboard from the Dzaleka distribution center after a distribution of blankets and other supplies.","photographer":{"name":"Carlos Martinez","instagram":"dzalekaonline","website":"https://www.instagram.com/dzalekaonline/","bio":"Visual storyteller focusing on youth empowerment and innovation in refugee communities."},"image":"https://ep00.epimg.net/elpais/imagenes/2016/06/20/album/1466383678_828939_1466384261_album_normal.jpg","date":"2023-10-15T00:00:00.000Z","tags":["UNHCR","Cardboard Collection","Refugee Life"],"featured":true,"location":"Dzaleka Refugee Camp"};
				const file = "/Users/bakari/Downloads/dzaleka heritage archive/src/content/photos/a-man-collecting-cardboard.md";
				const url = undefined;
				function rawContent() {
					return "\n## About This Photo\n\nA man collects cardboard from the Dzaleka distribution center after a distribution of blankets and other supplies. \"Before we focused on meeting the most basic needs,\" explains Enid Ochieng, head of UNHCR in Malawi.\n\n### Technical Details\n\n- Camera: Sony A7III\n- Lens: 24-70mm f/2.8\n- Settings: 1/250s, f/4, ISO 400\n\n### Story Behind the Shot\n\n\"Now, we don't even get to that.\" Due to budgetary constraints, the newcomers have practically nothing to raise a roof with and UNHCR, which manages the compound together with the Malawian government, has trouble even providing them with plastic tarps. “Donors have been helping here for many years. And there are other crises [even in Malawi itself, through whose southern border thousands of Mozambicans flee from violence] which makes it not so easy right now to sell Dzaleka to the world again, ”says Kelvin S. Sentala, assistant to Unhcr field. CARLOS MARTINEZ\n";
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
