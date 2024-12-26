import { f as createComponent, i as renderTemplate, m as maybeRenderHead, u as unescapeHTML } from './astro_80255e7d.mjs';
import 'clsx';

const html = "<h2 id=\"about-there-is-hope-malawi\">About There is Hope Malawi</h2>\n<p>There is Hope Malawi provides educational opportunities and vocational training to both refugees and host communities, focusing on:</p>\n<ul>\n<li>Vocational skills training</li>\n<li>Academic education</li>\n<li>Community integration</li>\n<li>Economic empowerment</li>\n</ul>\n<h3 id=\"our-programs\">Our Programs</h3>\n<h4 id=\"vocational-training\">Vocational Training</h4>\n<ul>\n<li>Carpentry</li>\n<li>Tailoring</li>\n<li>Computer skills</li>\n<li>Business management</li>\n</ul>\n<h4 id=\"academic-support\">Academic Support</h4>\n<ul>\n<li>Scholarship programs</li>\n<li>Tutorial services</li>\n<li>Language courses</li>\n</ul>\n<h4 id=\"community-integration\">Community Integration</h4>\n<ul>\n<li>Joint programs with host community</li>\n<li>Cultural exchange</li>\n<li>Social cohesion initiatives</li>\n</ul>\n<h3 id=\"impact\">Impact</h3>\n<p>Since our establishment, we have:</p>\n<ul>\n<li>Trained over 500 students in various vocational skills</li>\n<li>Provided scholarships to more than 200 students</li>\n<li>Facilitated numerous cultural exchange programs</li>\n<li>Created sustainable livelihood opportunities for refugees and host communities</li>\n</ul>";

				const frontmatter = {"title":"There is Hope Malawi","category":"Education","description":"Education and vocational training for refugees and host communities.","location":{"address":"Area 47, Sector 2, Linthipe Road, Plot Number 6","city":"Lilongwe","coordinates":{"lat":-13.7833,"lng":33.9833}},"contact":{"email":"comms@thereishopemalawi.org","phone":"+265 212 273 688","hours":"Monday-Friday, 8:00 AM - 5:00 PM"},"socialMedia":{"facebook":"https://www.facebook.com/thereishopemalawi/","twitter":"https://twitter.com/tihopemalawi","instagram":"https://www.instagram.com/thereishope/","linkedin":"https://mw.linkedin.com/company/thereishopemalawi","website":"https://thereishopemalawi.org/"},"logo":"https://www.seedsnewcastle.com.au/wp-content/uploads/2017/03/logo-1_300x283.png","featured":true,"lastUpdated":"2024-12-24T00:00:00.000Z"};
				const file = "/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/there-is-hope-malawi.md";
				const url = undefined;
				function rawContent() {
					return "\n## About There is Hope Malawi\n\nThere is Hope Malawi provides educational opportunities and vocational training to both refugees and host communities, focusing on:\n\n- Vocational skills training\n- Academic education\n- Community integration\n- Economic empowerment\n\n### Our Programs\n\n#### Vocational Training\n- Carpentry\n- Tailoring\n- Computer skills\n- Business management\n\n#### Academic Support\n- Scholarship programs\n- Tutorial services\n- Language courses\n\n#### Community Integration\n- Joint programs with host community\n- Cultural exchange\n- Social cohesion initiatives\n\n### Impact\n\nSince our establishment, we have:\n- Trained over 500 students in various vocational skills\n- Provided scholarships to more than 200 students\n- Facilitated numerous cultural exchange programs\n- Created sustainable livelihood opportunities for refugees and host communities\n";
				}
				function compiledContent() {
					return html;
				}
				function getHeadings() {
					return [{"depth":2,"slug":"about-there-is-hope-malawi","text":"About There is Hope Malawi"},{"depth":3,"slug":"our-programs","text":"Our Programs"},{"depth":4,"slug":"vocational-training","text":"Vocational Training"},{"depth":4,"slug":"academic-support","text":"Academic Support"},{"depth":4,"slug":"community-integration","text":"Community Integration"},{"depth":3,"slug":"impact","text":"Impact"}];
				}

				const Content = createComponent((result, _props, slots) => {
					const { layout, ...content } = frontmatter;
					content.file = file;
					content.url = url;

					return renderTemplate`${maybeRenderHead()}${unescapeHTML(html)}`;
				});

export { Content, compiledContent, Content as default, file, frontmatter, getHeadings, rawContent, url };
