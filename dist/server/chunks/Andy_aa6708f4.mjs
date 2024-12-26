import { f as createComponent, i as renderTemplate, m as maybeRenderHead, u as unescapeHTML } from './astro_80255e7d.mjs';
import 'clsx';

const html = "<h2 id=\"about-this-photo\">About This Photo</h2>\n<p>Andy was only 16 when he arrived in Malawi after escaping an armed group where he was recruited as a child soldier. Fortunately, he was reunited with his mother three months later in Dzaleka and together they began their new life. He enrolled in vocational skills training, where he learned how to code. “I created my own messaging app. Initially, it was only for my girlfriend and I, but I hope it will take off one day,” says Andy.</p>";

				const frontmatter = {"title":"From Survival to Innovation: Andy's Journey in Dzaleka","description":"Escaping his past as a child soldier, Andy found refuge in Dzaleka, reunited with his mother, and discovered coding. Now, he dreams of growing his messaging app into something greater.","photographer":{"name":"WFP/Badre Bahaji","instagram":"badrebahaji","website":"https://mw.linkedin.com/in/badre-bahaji-1bb67942","bio":"Photography based in Uganda"},"image":"https://www.wfp.org/sites/default/files/styles/media_embed/public/2021-06/Malawi%205.jpg?itok=NkB_eCtY","date":"2021-06-18T00:00:00.000Z","tags":["Former Child Soldier","Refugee Resilience","Family Reunion","Coding Skills"],"featured":true,"location":"Dzaleka Refugee Camp"};
				const file = "/Users/bakari/Downloads/dzaleka heritage archive/src/content/photos/Andy.md";
				const url = undefined;
				function rawContent() {
					return "\n## About This Photo\n\nAndy was only 16 when he arrived in Malawi after escaping an armed group where he was recruited as a child soldier. Fortunately, he was reunited with his mother three months later in Dzaleka and together they began their new life. He enrolled in vocational skills training, where he learned how to code. “I created my own messaging app. Initially, it was only for my girlfriend and I, but I hope it will take off one day,” says Andy. \n\n";
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
