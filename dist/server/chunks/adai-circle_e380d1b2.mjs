import { f as createComponent, i as renderTemplate, m as maybeRenderHead, u as unescapeHTML } from './astro_80255e7d.mjs';
import 'clsx';

const html = "<h2 id=\"about-adai-circle\">About ADAI Circle</h2>\n<p>ADAI Circle provides technology education and artificial intelligence training to refugees and marginalized communities in Dzaleka Refugee Camp. Our mission is to empower individuals through digital skills and create opportunities in the tech industry.</p>\n<h3 id=\"our-services\">Our Services</h3>\n<ul>\n<li>AI and Machine Learning Training</li>\n<li>Web Development Courses</li>\n<li>Digital Skills Workshops</li>\n<li>Tech Mentorship Programs</li>\n</ul>\n<h3 id=\"contact-information\">Contact Information</h3>\n<p>Visit us at our office in Dzaleka Refugee Camp or reach out through our contact channels.</p>";

				const frontmatter = {"title":"Adai Circle","category":"Education","description":"Tech education and AI training for refugees and marginalized communities","location":{"address":"Dzaleka Refugee Camp","city":"Dowa","coordinates":{"lat":-13.7833,"lng":33.9833}},"contact":{"email":"","phone":"","hours":"Monday-Friday, 9:00 AM - 5:00 PM"},"socialMedia":{"facebook":"","twitter":"","instagram":"","linkedin":"","website":""},"logo":"","featured":true,"verified":true,"lastUpdated":"2024-12-24T00:00:00.000Z"};
				const file = "/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/adai-circle.md";
				const url = undefined;
				function rawContent() {
					return "\n## About ADAI Circle\n\nADAI Circle provides technology education and artificial intelligence training to refugees and marginalized communities in Dzaleka Refugee Camp. Our mission is to empower individuals through digital skills and create opportunities in the tech industry.\n\n### Our Services\n- AI and Machine Learning Training\n- Web Development Courses\n- Digital Skills Workshops\n- Tech Mentorship Programs\n\n### Contact Information\nVisit us at our office in Dzaleka Refugee Camp or reach out through our contact channels.\n";
				}
				function compiledContent() {
					return html;
				}
				function getHeadings() {
					return [{"depth":2,"slug":"about-adai-circle","text":"About ADAI Circle"},{"depth":3,"slug":"our-services","text":"Our Services"},{"depth":3,"slug":"contact-information","text":"Contact Information"}];
				}

				const Content = createComponent((result, _props, slots) => {
					const { layout, ...content } = frontmatter;
					content.file = file;
					content.url = url;

					return renderTemplate`${maybeRenderHead()}${unescapeHTML(html)}`;
				});

export { Content, compiledContent, Content as default, file, frontmatter, getHeadings, rawContent, url };
