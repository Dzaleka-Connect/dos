import { f as createComponent, i as renderTemplate, m as maybeRenderHead, u as unescapeHTML } from './astro_80255e7d.mjs';
import 'clsx';

const html = "<h2 id=\"about-zawadie-solutions\">About Zawadie Solutions</h2>\n<p>Business outsourcing and refugee employment services.</p>\n<h3 id=\"local-partnerships\">Local Partnerships</h3>\n<p>We partner with local NGOs which allows us to connect with the local community and ensure the refugees receive the support they need to succeed. We rent out space so it helps supports the life changing works of NGOS</p>\n<h3 id=\"our-history\">Our History</h3>\n<p>Tyler Clark’s visit to Malawi in January 2024 was a significant milestone for Zawadie Solutions. This picture was taken to commemorate this meeting, symbolizing the collaboration and shared commitment between Tyler and the Zawadie team in Malawi. It was intended to be featured on our website to showcase our international partnerships, highlight the progress we’ve made, and inspire confidence in our mission to provide outsourcing solutions to companies in the world.</p>\n<h3 id=\"our-services\">Our Services</h3>\n<ul>\n<li>Business development</li>\n<li>Skills training</li>\n<li>Market access</li>\n<li>Networking opportunities</li>\n</ul>\n<h3 id=\"contact-information\">Contact Information</h3>\n<ul>\n<li><strong>Address:</strong> Dzaleka Refugee Camp, Malawi</li>\n<li><strong>Phone:</strong> +1 (909) 717-0903</li>\n<li><strong>Email:</strong> <a href=\"mailto:Info@zawadie.com\">Info@zawadie.com</a></li>\n<li><strong>Website:</strong> <a href=\"https://zawadie.org/\">Zawadie Solutions</a></li>\n</ul>\n<h3 id=\"social-media\">Social Media</h3>\n<ul>\n<li><a href=\"https://www.linkedin.com/company/zawadie-services/\">Linkedin</a></li>\n<li><a href=\"https://www.facebook.com/zawadiesolutions/\">Facebook</a></li>\n<li><a href=\"https://www.instagram.com/zawadiesolutions/\">Instagram</a></li>\n</ul>";

				const frontmatter = {"title":"Zawadie Solutions","category":"Entrepreneurship","description":"Business outsourcing and refugee employment services.","location":{"address":"Ubuntu Office","city":"Dzaleka Refugee Camp, Dowa","coordinates":{"lat":-13.7833,"lng":33.9833}},"contact":{"email":"Info@zawadie.com","phone":"+1-(907) 487-4575","hours":"Monday-Friday, 8:00 AM - 5:00 PM"},"socialMedia":{"facebook":"https://www.facebook.com/profile.php?id=61555842895575","twitter":"","instagram":"","linkedin":"https://www.linkedin.com/company/zawadie-solutions/about/?viewAsMember=true","youtube":"https://www.youtube.com/@ZawadieSolutions","website":"https://zawadie.com/"},"logo":"https://zawadie.com/wp-content/uploads/2024/02/WhatsApp_Image_2024-01-19_at_01.20.27-removebg-preview.png","featured":true,"lastUpdated":"2024-12-24T00:00:00.000Z"};
				const file = "/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/zawadie-solutions.md";
				const url = undefined;
				function rawContent() {
					return "\n## About Zawadie Solutions\n\nBusiness outsourcing and refugee employment services.\n\n### Local Partnerships\nWe partner with local NGOs which allows us to connect with the local community and ensure the refugees receive the support they need to succeed. We rent out space so it helps supports the life changing works of NGOS\n\n### Our History\nTyler Clark’s visit to Malawi in January 2024 was a significant milestone for Zawadie Solutions. This picture was taken to commemorate this meeting, symbolizing the collaboration and shared commitment between Tyler and the Zawadie team in Malawi. It was intended to be featured on our website to showcase our international partnerships, highlight the progress we’ve made, and inspire confidence in our mission to provide outsourcing solutions to companies in the world.\n\n### Our Services\n- Business development\n- Skills training\n- Market access\n- Networking opportunities\n\n### Contact Information\n- **Address:** Dzaleka Refugee Camp, Malawi\n- **Phone:** +1 (909) 717-0903\n- **Email:** Info@zawadie.com\n- **Website:** [Zawadie Solutions](https://zawadie.org/)\n\n### Social Media\n- [Linkedin](https://www.linkedin.com/company/zawadie-services/)\n- [Facebook](https://www.facebook.com/zawadiesolutions/)\n- [Instagram](https://www.instagram.com/zawadiesolutions/)\n";
				}
				function compiledContent() {
					return html;
				}
				function getHeadings() {
					return [{"depth":2,"slug":"about-zawadie-solutions","text":"About Zawadie Solutions"},{"depth":3,"slug":"local-partnerships","text":"Local Partnerships"},{"depth":3,"slug":"our-history","text":"Our History"},{"depth":3,"slug":"our-services","text":"Our Services"},{"depth":3,"slug":"contact-information","text":"Contact Information"},{"depth":3,"slug":"social-media","text":"Social Media"}];
				}

				const Content = createComponent((result, _props, slots) => {
					const { layout, ...content } = frontmatter;
					content.file = file;
					content.url = url;

					return renderTemplate`${maybeRenderHead()}${unescapeHTML(html)}`;
				});

export { Content, compiledContent, Content as default, file, frontmatter, getHeadings, rawContent, url };
