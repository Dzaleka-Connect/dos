import { f as createComponent, i as renderTemplate, m as maybeRenderHead, u as unescapeHTML } from './astro_80255e7d.mjs';
import 'clsx';

const html = "<h1 id=\"welcome-to-dzaleka-online-services\">Welcome to Dzaleka Online Services</h1>\n<p>We connect refugees, volunteers, and organizations in Dzaleka Refugee Camp. Our platform serves as a central hub for accessing essential services, educational resources, and community support.</p>\n<h2 id=\"our-services\">Our Services</h2>\n<h3 id=\"humanitarian-aid\">Humanitarian Aid</h3>\n<p>Access emergency assistance and basic necessities through our partner organizations.</p>\n<h3 id=\"education\">Education</h3>\n<p>Find learning opportunities, from primary education to vocational training.</p>\n<h3 id=\"healthcare\">Healthcare</h3>\n<p>Connect with medical services and health programs available in the camp.</p>\n<h3 id=\"legal-support\">Legal Support</h3>\n<p>Get assistance with legal matters and advocacy services.</p>\n<h3 id=\"youth-programs\">Youth Programs</h3>\n<p>Discover opportunities specifically designed for young people.</p>\n<h3 id=\"cultural-initiatives\">Cultural Initiatives</h3>\n<p>Participate in events that celebrate our diverse community.</p>";

				const frontmatter = {"title":"Welcome to Dzaleka Online Services","description":"Connecting Dzaleka Community with Essential Services","heroImage":"/images/hero.jpg","pubDate":"2023-09-14T00:00:00.000Z"};
				const file = "/Users/bakari/Downloads/dzaleka heritage archive/src/content/pages/home.md";
				const url = "/home";
				function rawContent() {
					return "\n# Welcome to Dzaleka Online Services\n\nWe connect refugees, volunteers, and organizations in Dzaleka Refugee Camp. Our platform serves as a central hub for accessing essential services, educational resources, and community support.\n\n## Our Services\n\n### Humanitarian Aid\nAccess emergency assistance and basic necessities through our partner organizations.\n\n### Education\nFind learning opportunities, from primary education to vocational training.\n\n### Healthcare\nConnect with medical services and health programs available in the camp.\n\n### Legal Support\nGet assistance with legal matters and advocacy services.\n\n### Youth Programs\nDiscover opportunities specifically designed for young people.\n\n### Cultural Initiatives\nParticipate in events that celebrate our diverse community.";
				}
				function compiledContent() {
					return html;
				}
				function getHeadings() {
					return [{"depth":1,"slug":"welcome-to-dzaleka-online-services","text":"Welcome to Dzaleka Online Services"},{"depth":2,"slug":"our-services","text":"Our Services"},{"depth":3,"slug":"humanitarian-aid","text":"Humanitarian Aid"},{"depth":3,"slug":"education","text":"Education"},{"depth":3,"slug":"healthcare","text":"Healthcare"},{"depth":3,"slug":"legal-support","text":"Legal Support"},{"depth":3,"slug":"youth-programs","text":"Youth Programs"},{"depth":3,"slug":"cultural-initiatives","text":"Cultural Initiatives"}];
				}

				const Content = createComponent((result, _props, slots) => {
					const { layout, ...content } = frontmatter;
					content.file = file;
					content.url = url;

					return renderTemplate`${maybeRenderHead()}${unescapeHTML(html)}`;
				});

export { Content, compiledContent, Content as default, file, frontmatter, getHeadings, rawContent, url };
