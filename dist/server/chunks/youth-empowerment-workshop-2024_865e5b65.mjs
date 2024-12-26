import { f as createComponent, i as renderTemplate, m as maybeRenderHead, u as unescapeHTML } from './astro_80255e7d.mjs';
import 'clsx';

const html = "<h2 id=\"workshop-overview\">Workshop Overview</h2>\n<p>Join us for an intensive three-day workshop designed to empower young refugees with essential skills in leadership, entrepreneurship, and personal development. Learn from experienced mentors and connect with like-minded youth.</p>\n<h3 id=\"workshop-tracks\">Workshop Tracks</h3>\n<ol>\n<li>\n<p><strong>Leadership Development</strong></p>\n<ul>\n<li>Personal leadership</li>\n<li>Team management</li>\n<li>Communication skills</li>\n<li>Project planning</li>\n</ul>\n</li>\n<li>\n<p><strong>Entrepreneurship Skills</strong></p>\n<ul>\n<li>Business basics</li>\n<li>Market research</li>\n<li>Financial planning</li>\n<li>Digital marketing</li>\n</ul>\n</li>\n<li>\n<p><strong>Personal Development</strong></p>\n<ul>\n<li>Goal setting</li>\n<li>Time management</li>\n<li>Public speaking</li>\n<li>Networking skills</li>\n</ul>\n</li>\n</ol>\n<h3 id=\"workshop-features\">Workshop Features</h3>\n<ul>\n<li>Interactive sessions</li>\n<li>Group activities</li>\n<li>Mentorship opportunities</li>\n<li>Networking events</li>\n<li>Resource materials</li>\n</ul>\n<h3 id=\"venue-information\">Venue Information</h3>\n<p>The workshop will be held at the Dzaleka Youth Center, featuring multiple workshop spaces and breakout rooms for group activities.</p>\n<h3 id=\"participant-information\">Participant Information</h3>\n<ul>\n<li>Limited to 30 participants</li>\n<li>Ages 18-35 welcome</li>\n<li>All materials provided</li>\n<li>Certificates awarded</li>\n<li>Lunch and refreshments included</li>\n</ul>";

				const frontmatter = {"title":"Youth Empowerment Workshop 2024","description":"A comprehensive workshop series focusing on leadership, entrepreneurship, and personal development for young refugees.","date":"2024-04-10T00:00:00.000Z","endDate":"2024-04-12T00:00:00.000Z","location":"Dzaleka Youth Center, Dzaleka Refugee Camp, Dowa","category":"Education","image":"/images/events/youth-empowerment-2024.jpg","featured":true,"organizer":"Dzaleka Youth Organization","status":"upcoming","contact":{"email":"youth@dzaleka.org","phone":"+265 991 234567","whatsapp":"+265 991 234567"},"registration":{"required":true,"url":"https://dzaleka.org/youth-empowerment-2024","deadline":"2024-03-31T00:00:00.000Z"},"tags":["youth","education","leadership","entrepreneurship"]};
				const file = "/Users/bakari/Downloads/dzaleka heritage archive/src/content/events/youth-empowerment-workshop-2024.md";
				const url = undefined;
				function rawContent() {
					return "\n## Workshop Overview\n\nJoin us for an intensive three-day workshop designed to empower young refugees with essential skills in leadership, entrepreneurship, and personal development. Learn from experienced mentors and connect with like-minded youth.\n\n### Workshop Tracks\n\n1. **Leadership Development**\n   - Personal leadership\n   - Team management\n   - Communication skills\n   - Project planning\n\n2. **Entrepreneurship Skills**\n   - Business basics\n   - Market research\n   - Financial planning\n   - Digital marketing\n\n3. **Personal Development**\n   - Goal setting\n   - Time management\n   - Public speaking\n   - Networking skills\n\n### Workshop Features\n\n- Interactive sessions\n- Group activities\n- Mentorship opportunities\n- Networking events\n- Resource materials\n\n### Venue Information\n\nThe workshop will be held at the Dzaleka Youth Center, featuring multiple workshop spaces and breakout rooms for group activities.\n\n### Participant Information\n\n- Limited to 30 participants\n- Ages 18-35 welcome\n- All materials provided\n- Certificates awarded\n- Lunch and refreshments included\n";
				}
				function compiledContent() {
					return html;
				}
				function getHeadings() {
					return [{"depth":2,"slug":"workshop-overview","text":"Workshop Overview"},{"depth":3,"slug":"workshop-tracks","text":"Workshop Tracks"},{"depth":3,"slug":"workshop-features","text":"Workshop Features"},{"depth":3,"slug":"venue-information","text":"Venue Information"},{"depth":3,"slug":"participant-information","text":"Participant Information"}];
				}

				const Content = createComponent((result, _props, slots) => {
					const { layout, ...content } = frontmatter;
					content.file = file;
					content.url = url;

					return renderTemplate`${maybeRenderHead()}${unescapeHTML(html)}`;
				});

export { Content, compiledContent, Content as default, file, frontmatter, getHeadings, rawContent, url };
