import { f as createComponent, i as renderTemplate, m as maybeRenderHead, u as unescapeHTML } from './astro_80255e7d.mjs';
import 'clsx';

const html = "<h2 id=\"about-inua-advocacy\">About Inua Advocacy</h2>\n<p>Inua Advocacy is a non-profit organization dedicated to empowering refugees and advocating for their rights. Founded by former refugees, Inua Advocacy works tirelessly to improve the lives of displaced persons in Dzaleka Refugee Camp and beyond.</p>\n<h3 id=\"mission\">Mission</h3>\n<p>Inua Advocacy’s mission is to amplify the voices of refugees, provide accurate information about refugee situations, and advocate for policies that protect and empower displaced persons. We believe in the power of education, community engagement, and policy reform to create lasting change.</p>\n<h3 id=\"key-initiatives\">Key Initiatives</h3>\n<ul>\n<li>Documenting and sharing refugee stories</li>\n<li>Conducting research on refugee issues in Malawi</li>\n<li>Advocating for improved living conditions in Dzaleka Refugee Camp</li>\n<li>Promoting education and skills development among refugees</li>\n<li>Collaborating with local and international organizations to support refugee rights</li>\n</ul>\n<h3 id=\"get-involved\">Get Involved</h3>\n<p>You can support Inua Advocacy’s work in several ways:</p>\n<ul>\n<li>Volunteer your skills and time</li>\n<li><a href=\"https://inuaadvocacy.org/donate/\">Donate to support their initiatives</a></li>\n<li>Share Inua Advocacy resources and raise awareness about refugee issues</li>\n<li>Collaborate with Inua Advocacy on research or advocacy projects</li>\n</ul>\n<p>Visit <a href=\"https://inuaadvocacy.org/\">Inua Advocacy Website</a> to learn more.</p>";

				const frontmatter = {"title":"Inua Advocacy","category":"Advocacy","description":"Legal support and advocacy services for refugees in Malawi.","location":{"address":"Dzaleka Refugee Camp","city":"Dowa","coordinates":{"lat":-13.7833,"lng":33.9833}},"contact":{"email":"info@inuaadvocacy.org","phone":"+265 882 717995","hours":"Monday-Friday, 8:00 AM - 5:00 PM"},"socialMedia":{"facebook":"https://www.facebook.com/inuaadvocacy/","youtube":"https://www.youtube.com/channel/UCgFvd8yc4Tcur5SFhdZHgMw","twitter":"https://twitter.com/InuaAdvocacy","instagram":"https://www.instagram.com/inuaadvocacy/","linkedin":"https://www.linkedin.com/company/inua-advocacy/","website":"https://inuaadvocacy.org/"},"logo":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRshOC3XuIA-V7GVurjsZ0GIqKn_LJfdP1nQg&s","featured":true,"lastUpdated":"2024-12-24T00:00:00.000Z"};
				const file = "/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/inua-advocacy.md";
				const url = undefined;
				function rawContent() {
					return "\n## About Inua Advocacy\n\nInua Advocacy is a non-profit organization dedicated to empowering refugees and advocating for their rights. Founded by former refugees, Inua Advocacy works tirelessly to improve the lives of displaced persons in Dzaleka Refugee Camp and beyond.\n\n### Mission\n\nInua Advocacy's mission is to amplify the voices of refugees, provide accurate information about refugee situations, and advocate for policies that protect and empower displaced persons. We believe in the power of education, community engagement, and policy reform to create lasting change.\n\n### Key Initiatives\n\n- Documenting and sharing refugee stories\n- Conducting research on refugee issues in Malawi\n- Advocating for improved living conditions in Dzaleka Refugee Camp\n- Promoting education and skills development among refugees\n- Collaborating with local and international organizations to support refugee rights\n\n### Get Involved\nYou can support Inua Advocacy's work in several ways:\n\n- Volunteer your skills and time\n- [Donate to support their initiatives](https://inuaadvocacy.org/donate/)\n- Share Inua Advocacy resources and raise awareness about refugee issues\n- Collaborate with Inua Advocacy on research or advocacy projects\n\nVisit [Inua Advocacy Website](https://inuaadvocacy.org/) to learn more.";
				}
				function compiledContent() {
					return html;
				}
				function getHeadings() {
					return [{"depth":2,"slug":"about-inua-advocacy","text":"About Inua Advocacy"},{"depth":3,"slug":"mission","text":"Mission"},{"depth":3,"slug":"key-initiatives","text":"Key Initiatives"},{"depth":3,"slug":"get-involved","text":"Get Involved"}];
				}

				const Content = createComponent((result, _props, slots) => {
					const { layout, ...content } = frontmatter;
					content.file = file;
					content.url = url;

					return renderTemplate`${maybeRenderHead()}${unescapeHTML(html)}`;
				});

export { Content, compiledContent, Content as default, file, frontmatter, getHeadings, rawContent, url };
