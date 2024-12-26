import { f as createComponent, i as renderTemplate, m as maybeRenderHead, u as unescapeHTML } from './astro_80255e7d.mjs';
import 'clsx';

const html = "<h2 id=\"about-unhcr-malawi\">About UNHCR Malawi</h2>\n<p>As of December 2021, Malawi hosts 52,678 persons of concern (PoCs) to UNHCR. The majority live in the Dzaleka refugee camp located in the Dowa district, some 41 kilometres away from the capital Lilongwe.</p>\n<p>Dzaleka is a protracted camp with a monthly average of 300 new arrivals (62% are from the DRC, 19% Burundi and 7% Rwanda and 2% other nationalities). 45% of the PoCs are women, and 48% are children. The camp was initially established to host between 10,000 to 12,000 PoCs but now hosts over 52,000 individuals.</p>\n<p>Of the total PoC population, 21,530 have refugee status, 30,910 are asylum seekers, with 238 others of concern, making the refugee situation protracted. The protracted nature of the camp settlement and encampment policy increases the risks of its inhabitants to infectious diseases, protection, and self-sufficiency.</p>";

				const frontmatter = {"title":"UNHCR Malawi","category":"Humanitarian Aid","description":"UN Refugee Agency providing protection and humanitarian assistance in Malawi.","location":{"address":"8th Floor, Kang'ombe House, Robert Mugabe Crescent, City Centre","city":"Lilongwe","coordinates":{"lat":-13.7833,"lng":33.9833}},"contact":{"email":"mlwli@unhcr.org","phone":"+265 177 2155","hours":"Monday-Friday, 8:00 AM - 5:00 PM"},"socialMedia":{"facebook":"https://www.facebook.com/UNHCRSouthernAfrica","twitter":"https://twitter.com/unhcrrosa","instagram":"https://www.instagram.com/refugees/","linkedin":"","website":"https://www.unhcr.org/au/countries/malawi"},"logo":"https://spherestandards.org/wp-content/uploads/unhcr-logo-650x650.png","featured":true,"verified":true,"lastUpdated":"2024-12-24T00:00:00.000Z"};
				const file = "/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/unhcr-malawi.md";
				const url = undefined;
				function rawContent() {
					return "\n## About UNHCR Malawi\n\nAs of December 2021, Malawi hosts 52,678 persons of concern (PoCs) to UNHCR. The majority live in the Dzaleka refugee camp located in the Dowa district, some 41 kilometres away from the capital Lilongwe.  \n\nDzaleka is a protracted camp with a monthly average of 300 new arrivals (62% are from the DRC, 19% Burundi and 7% Rwanda and 2% other nationalities). 45% of the PoCs are women, and 48% are children. The camp was initially established to host between 10,000 to 12,000 PoCs but now hosts over 52,000 individuals.\n\nOf the total PoC population, 21,530 have refugee status, 30,910 are asylum seekers, with 238 others of concern, making the refugee situation protracted. The protracted nature of the camp settlement and encampment policy increases the risks of its inhabitants to infectious diseases, protection, and self-sufficiency.";
				}
				function compiledContent() {
					return html;
				}
				function getHeadings() {
					return [{"depth":2,"slug":"about-unhcr-malawi","text":"About UNHCR Malawi"}];
				}

				const Content = createComponent((result, _props, slots) => {
					const { layout, ...content } = frontmatter;
					content.file = file;
					content.url = url;

					return renderTemplate`${maybeRenderHead()}${unescapeHTML(html)}`;
				});

export { Content, compiledContent, Content as default, file, frontmatter, getHeadings, rawContent, url };
