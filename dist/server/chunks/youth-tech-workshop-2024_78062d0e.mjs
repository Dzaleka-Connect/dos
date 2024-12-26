import { f as createComponent, i as renderTemplate, m as maybeRenderHead, u as unescapeHTML } from './astro_80255e7d.mjs';
import 'clsx';

const html = "<h2 id=\"workshop-overview\">Workshop Overview</h2>\n<p>Join us for an intensive technology workshop designed specifically for young refugees interested in building their digital skills. Learn from experienced instructors and gain hands-on experience with modern technologies.</p>\n<h3 id=\"workshop-tracks\">Workshop Tracks</h3>\n<ol>\n<li>\n<p><strong>Web Development</strong></p>\n<ul>\n<li>HTML &#x26; CSS basics</li>\n<li>JavaScript fundamentals</li>\n<li>Responsive design</li>\n<li>Project building</li>\n</ul>\n</li>\n<li>\n<p><strong>Digital Design</strong></p>\n<ul>\n<li>Graphic design basics</li>\n<li>UI/UX principles</li>\n<li>Design tools</li>\n<li>Portfolio creation</li>\n</ul>\n</li>\n<li>\n<p><strong>Digital Marketing</strong></p>\n<ul>\n<li>Social media management</li>\n<li>Content creation</li>\n<li>Analytics basics</li>\n<li>Online branding</li>\n</ul>\n</li>\n</ol>\n<h3 id=\"workshop-features\">Workshop Features</h3>\n<ul>\n<li>Hands-on training</li>\n<li>Project-based learning</li>\n<li>Mentorship opportunities</li>\n<li>Career guidance</li>\n<li>Networking sessions</li>\n</ul>\n<h3 id=\"venue-information\">Venue Information</h3>\n<p>The workshop will be held at TakeLab Digital Center, equipped with computers and internet access for all participants.</p>\n<h3 id=\"participant-information\">Participant Information</h3>\n<ul>\n<li>Limited to 20 participants</li>\n<li>Basic computer knowledge required</li>\n<li>Laptops provided</li>\n<li>Certificates awarded upon completion</li>\n</ul>";

				const frontmatter = {"title":"Youth Tech Workshop 2024","description":"Empowering young refugees with digital skills through hands-on technology workshops and training sessions.","date":"2024-05-15T00:00:00.000Z","location":"TakeLab Digital Center, Dzaleka Refugee Camp, Dowa","category":"Education","featured":true,"image":"/images/events/youth-tech-workshop-2024.jpg","organizer":"TakenoLab","contact":{"email":"training@takenolab.org","phone":"+265 991 234567","whatsapp":"+265 991 234567"},"registration":{"required":true,"url":"https://takenolab.org/youth-tech-2024","deadline":"2024-05-01T00:00:00.000Z"},"tags":["technology","education","youth","digital skills"]};
				const file = "/Users/bakari/Downloads/dzaleka heritage archive/src/content/events/youth-tech-workshop-2024.md";
				const url = undefined;
				function rawContent() {
					return "\n## Workshop Overview\n\nJoin us for an intensive technology workshop designed specifically for young refugees interested in building their digital skills. Learn from experienced instructors and gain hands-on experience with modern technologies.\n\n### Workshop Tracks\n\n1. **Web Development**\n   - HTML & CSS basics\n   - JavaScript fundamentals\n   - Responsive design\n   - Project building\n\n2. **Digital Design**\n   - Graphic design basics\n   - UI/UX principles\n   - Design tools\n   - Portfolio creation\n\n3. **Digital Marketing**\n   - Social media management\n   - Content creation\n   - Analytics basics\n   - Online branding\n\n### Workshop Features\n\n- Hands-on training\n- Project-based learning\n- Mentorship opportunities\n- Career guidance\n- Networking sessions\n\n### Venue Information\n\nThe workshop will be held at TakeLab Digital Center, equipped with computers and internet access for all participants.\n\n### Participant Information\n\n- Limited to 20 participants\n- Basic computer knowledge required\n- Laptops provided\n- Certificates awarded upon completion";
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
