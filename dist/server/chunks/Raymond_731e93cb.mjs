import { f as createComponent, i as renderTemplate, m as maybeRenderHead, u as unescapeHTML } from './astro_80255e7d.mjs';
import 'clsx';

const html = "<h2 id=\"about-this-photo\">About This Photo</h2>\n<p>With the increased spread of COVID-19 and the negative effects casting a rather gloomy shadow on the future, educator Raymond from Dzaleka has taken a proactive approach to teaching. When schools were closed for seven months and he could not teach at the local secondary school within the camp, he began providing lessons free of charge, via messaging app, to people that usually cannot access formal education. The lessons, covering a wide range of topics, are provided through audio and video recordings and have reached over 190 learners since he started.</p>\n<p>“I have had students who managed to learn English, driving or computer skills,” says Raymond. He hopes providing these basic skills and training to people who would otherwise not be able to access them will enable them to build better lives for themselves. “It’s tough to build your life in the camp and even worse without any form of education, training or skills. But with these skills, I know some people will be able to find a way to make it work.”</p>";

				const frontmatter = {"title":"Teaching Through Adversity: Raymond's Mission to Educate in Dzaleka","description":"Educator Raymond from Dzaleka turned to remote teaching during COVID-19, offering free lessons via messaging apps. His efforts empower over 190 learners with vital skills, building hope for brighter futures.","photographer":{"name":"WFP/Badre Bahaji","instagram":"badrebahaji","website":"https://mw.linkedin.com/in/badre-bahaji-1bb67942","bio":"Photography based in Uganda"},"image":"https://www.wfp.org/sites/default/files/styles/media_embed/public/2021-06/Malawi%203.jpg?itok=tOF0B9cB","date":"2021-06-18T00:00:00.000Z","tags":["COVID-19 Impact","Refugee Education","Remote Learning","Skills Training"],"featured":true,"location":"Dzaleka Refugee Camp"};
				const file = "/Users/bakari/Downloads/dzaleka heritage archive/src/content/photos/Raymond.md";
				const url = undefined;
				function rawContent() {
					return "\n## About This Photo\n\nWith the increased spread of COVID-19 and the negative effects casting a rather gloomy shadow on the future, educator Raymond from Dzaleka has taken a proactive approach to teaching. When schools were closed for seven months and he could not teach at the local secondary school within the camp, he began providing lessons free of charge, via messaging app, to people that usually cannot access formal education. The lessons, covering a wide range of topics, are provided through audio and video recordings and have reached over 190 learners since he started. \n\n“I have had students who managed to learn English, driving or computer skills,” says Raymond. He hopes providing these basic skills and training to people who would otherwise not be able to access them will enable them to build better lives for themselves. “It’s tough to build your life in the camp and even worse without any form of education, training or skills. But with these skills, I know some people will be able to find a way to make it work.”";
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
