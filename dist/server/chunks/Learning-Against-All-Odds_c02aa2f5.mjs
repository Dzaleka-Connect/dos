import { f as createComponent, i as renderTemplate, m as maybeRenderHead, u as unescapeHTML } from './astro_80255e7d.mjs';
import 'clsx';

const html = "<h2 id=\"about-this-photo\">About This Photo</h2>\n<p>With one teacher for every more than 80 students, the primary school run by the Jesuit organization JRS has to take turns serving everyone. There are no classrooms, facilities and teachers, and absenteeism forced by the circumstances of life in the countryside is one of the problems. Boys like Dany, 16, are still in elementary school, because life has not allowed them to move faster. Dany likes English, math, and science. And he smiles when he tells that now he is usually the first of the class and that he would like to go to the university in the country.</p>\n<p>In Dzaleka there is also a secondary school and other services, such as adult training. Teen pregnancies are a problem for girls of that age to attend class. Like almost everything here, the training centers serve both rural residents and Malawians from neighboring towns, who also suffer from need in many areas, but at least are free to work.</p>\n<p>The educational offer in Dzaleka is completed with an ‘online’ university, in which up to 30 people a year enroll in three-year degrees through the internet endorsed by American universities such as Regis. They are courses that will allow them to specialize in areas such as education, business or social work. Vocational training and other courses are also offered. It is an option for some to continue preparing to obtain a job in the future if there is finally a legal change, in which, apart from the relocations in other countries (increasingly limited or more focused on other emergencies from other places) it seems to be the only way to alleviate the situation in the Malawian countryside.</p>";

				const frontmatter = {"title":"Learning Against All Odds: Education in Dzaleka","description":"In Dzaleka, overcrowded classrooms and limited resources challenge education, but students like 16-year-old Dany remain hopeful, aspiring to reach university despite the odds.","photographer":{"name":"Carlos Martinez","instagram":"dzalekaonline","website":"https://www.instagram.com/dzalekaonline/","bio":"Visual storyteller focusing on youth empowerment and innovation in refugee communities."},"image":"https://ep00.epimg.net/elpais/imagenes/2016/06/20/album/1466383678_828939_1466384976_album_normal.jpg","date":"2021-07-12T00:00:00.000Z","tags":["Refugee Education","Jesuit Refugee Service (JRS)","Education Challenges"],"featured":true,"location":"Dzaleka Refugee Camp"};
				const file = "/Users/bakari/Downloads/dzaleka heritage archive/src/content/photos/Learning-Against-All-Odds.md";
				const url = undefined;
				function rawContent() {
					return "\n## About This Photo\n\nWith one teacher for every more than 80 students, the primary school run by the Jesuit organization JRS has to take turns serving everyone. There are no classrooms, facilities and teachers, and absenteeism forced by the circumstances of life in the countryside is one of the problems. Boys like Dany, 16, are still in elementary school, because life has not allowed them to move faster. Dany likes English, math, and science. And he smiles when he tells that now he is usually the first of the class and that he would like to go to the university in the country. \n\nIn Dzaleka there is also a secondary school and other services, such as adult training. Teen pregnancies are a problem for girls of that age to attend class. Like almost everything here, the training centers serve both rural residents and Malawians from neighboring towns, who also suffer from need in many areas, but at least are free to work. \n\nThe educational offer in Dzaleka is completed with an 'online' university, in which up to 30 people a year enroll in three-year degrees through the internet endorsed by American universities such as Regis. They are courses that will allow them to specialize in areas such as education, business or social work. Vocational training and other courses are also offered. It is an option for some to continue preparing to obtain a job in the future if there is finally a legal change, in which, apart from the relocations in other countries (increasingly limited or more focused on other emergencies from other places) it seems to be the only way to alleviate the situation in the Malawian countryside.";
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
