import { f as createComponent, i as renderTemplate, m as maybeRenderHead, u as unescapeHTML } from './astro_80255e7d.mjs';
import 'clsx';

const html = "<h2 id=\"about-fountain-of-hope-africa\">About Fountain of Hope Africa</h2>\n<p>As a charitable nonprofit organization, Fountain of Hope Africa is founded on non-discriminatory principles that promote diversity, equity, and inclusion, making us a beautiful example of how people who may appear so different can work together and change their communities for the better. As humanitarians, we gather efforts to thrive and change the lives of the most vulnerable in Sub-Saharan Africa, with a special focus on marginalized women and children in the Democratic Republic of Congo (DRC) and Malawi. Fountain of Hope Africa is a community rooted development and humanitarian organization, with a broad and deep understanding of the challenges that the communities we serve must overcome and how best to do it. With local knowledge and in partnership with our communities, we remove barriers and restore the abundance of our people’s potentials. With our dedicated team and partners, who live and work with and for our communities, we listen to the priorities of the people and together design adapted programs that lead to sustainable transformation. We are driven by a deep love for our communities. We are there before others come, and we remain after they leave, this is the definition of continuity and sustainability. We believe in change; we trust the process and we believe to see our communities thrive. We are the Fountain of Hope for Africa. We are the ones.</p>\n<h3 id=\"services\">Services</h3>\n<ul>\n<li>Medical services</li>\n<li>Health education</li>\n<li>Mental health support</li>\n<li>Community health</li>\n</ul>";

				const frontmatter = {"title":"Fountain of Hope Africa","category":"Health","description":"Health and wellbeing services for refugees and local communities.","location":{"address":"Dzaleka Refugee Camp","city":"Dowa","coordinates":{"lat":-13.7833,"lng":33.9833}},"contact":{"email":"info@fountainofhopeafrica.org","phone":"+265 993 756753","hours":"Monday-Friday, 8:00 AM - 5:00 PM"},"socialMedia":{"facebook":"https://www.facebook.com/fountainofhopeafrica/","twitter":"","instagram":"","linkedin":"https://www.linkedin.com/company/fountain-of-hope-africa/","website":"https://fountainofhopeafrica.org/"},"logo":"https://fountainofhopeafrica.org/wp-content/uploads/2023/02/Fountain-Of-Hope-LOGO-400Png.png","featured":false,"lastUpdated":"2024-12-24T00:00:00.000Z"};
				const file = "/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/fountain-of-hope-africa.md";
				const url = undefined;
				function rawContent() {
					return "\n## About Fountain of Hope Africa\n\nAs a charitable nonprofit organization, Fountain of Hope Africa is founded on non-discriminatory principles that promote diversity, equity, and inclusion, making us a beautiful example of how people who may appear so different can work together and change their communities for the better. As humanitarians, we gather efforts to thrive and change the lives of the most vulnerable in Sub-Saharan Africa, with a special focus on marginalized women and children in the Democratic Republic of Congo (DRC) and Malawi. Fountain of Hope Africa is a community rooted development and humanitarian organization, with a broad and deep understanding of the challenges that the communities we serve must overcome and how best to do it. With local knowledge and in partnership with our communities, we remove barriers and restore the abundance of our people’s potentials. With our dedicated team and partners, who live and work with and for our communities, we listen to the priorities of the people and together design adapted programs that lead to sustainable transformation. We are driven by a deep love for our communities. We are there before others come, and we remain after they leave, this is the definition of continuity and sustainability. We believe in change; we trust the process and we believe to see our communities thrive. We are the Fountain of Hope for Africa. We are the ones.\n\n### Services\n- Medical services\n- Health education\n- Mental health support\n- Community health\n\n";
				}
				function compiledContent() {
					return html;
				}
				function getHeadings() {
					return [{"depth":2,"slug":"about-fountain-of-hope-africa","text":"About Fountain of Hope Africa"},{"depth":3,"slug":"services","text":"Services"}];
				}

				const Content = createComponent((result, _props, slots) => {
					const { layout, ...content } = frontmatter;
					content.file = file;
					content.url = url;

					return renderTemplate`${maybeRenderHead()}${unescapeHTML(html)}`;
				});

export { Content, compiledContent, Content as default, file, frontmatter, getHeadings, rawContent, url };
