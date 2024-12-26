import { f as createComponent, i as renderTemplate, m as maybeRenderHead, u as unescapeHTML } from './astro_80255e7d.mjs';
import 'clsx';

const html = "<h2 id=\"about-dzaleka-digital-heritage\">About Dzaleka Digital Heritage</h2>\n<p>Dzaleka Digital Heritage is dedicated to preserving and celebrating the unique cultural and historical legacy of Dzaleka Refugee Camp.</p>\n<h3 id=\"our-services\">Our Services</h3>\n<ul>\n<li>Cultural events</li>\n<li>Arts programs</li>\n<li>Heritage preservation</li>\n<li>Community engagement</li>\n</ul>\n<h3 id=\"contact-information\">Contact Information</h3>\n<ul>\n<li><strong>Address:</strong> Dzaleka Refugee Camp, Malawi</li>\n<li><strong>Email:</strong> <a href=\"mailto:dzalekaconnect@gmail.com\">dzalekaconnect@gmail.com</a></li>\n<li><strong>Website:</strong> <a href=\"https://www.dzaleka.com/\">Dzaleka Digital Heritage</a></li>\n</ul>\n<h3 id=\"social-media\">Social Media</h3>\n<ul>\n<li><a href=\"https://www.facebook.com/profile.php?id=61565368021895&#x26;__cft__%5B0%5D=AZVN8Nof_-4ABtz7ECji06jtgh1sffEiTOdbcOxMqwXjhAEY-FTuztwwBz-qwhd9p3HlKAsnnlp4muu9yn-sk_zqK7_i7maWta_VWUoo-JJkBSTTbjDNwAaXMGfOrqNK5xZWM4eZUEiGiCKSu-to1Ck4USjvxBnlWylqcIj-JYEIJLkiSgfXJYmsk6W0ISDUncYP78SRb1YxBRV2H8C1qnqvNFnUHRJDYUNHNYYTEYF5fQ&#x26;__tn__=-%5DK-y-R\">Facebook</a></li>\n<li><a href=\"https://www.instagram.com/dzalekadigitalheritage/?locale=es_US&#x26;hl=en\">Instagram</a></li>\n<li><a href=\"https://www.linkedin.com/company/dzaleka-digital-heritage/\">Linkedin</a></li>\n</ul>";

				const frontmatter = {"title":"Dzaleka Digital Heritage","description":"Preserving and sharing our community's rich cultural heritage through digital storytelling.","category":"Cultural Heritage","logo":"https://scontent.fbne5-1.fna.fbcdn.net/v/t39.30808-6/458490201_1670020087180947_543034666053705109_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=rQafULpQHNkQ7kNvgEQBQO-&_nc_zt=23&_nc_ht=scontent.fbne5-1.fna&_nc_gid=Ai74LwJ-A36x2N_LzeVg3X6&oh=00_AYAEEgxhd9EOK6csoGjIBqT29UU8QlAra0zRXTok3G0f_Q&oe=676FF69E","location":{"address":"Heritage Center, Dzaleka Refugee Camp","city":"Dowa","coordinates":{"lat":-13.7833,"lng":33.9833}},"contact":{"email":"heritage@dzaleka.org","phone":"+265 991 234567","hours":"Monday-Friday, 9:00 AM - 5:00 PM"},"socialMedia":{"facebook":"https://facebook.com/dzalekaheritage","instagram":"https://instagram.com/dzalekaheritage","website":"https://dzalekaheritage.org"},"featured":true,"status":"active","lastUpdated":"2024-12-24T00:00:00.000Z"};
				const file = "/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/dzaleka-digital-heritage.md";
				const url = undefined;
				function rawContent() {
					return "\n## About Dzaleka Digital Heritage\n\nDzaleka Digital Heritage is dedicated to preserving and celebrating the unique cultural and historical legacy of Dzaleka Refugee Camp.\n\n### Our Services\n- Cultural events\n- Arts programs\n- Heritage preservation\n- Community engagement\n\n### Contact Information\n- **Address:** Dzaleka Refugee Camp, Malawi\n- **Email:** dzalekaconnect@gmail.com\n- **Website:** [Dzaleka Digital Heritage](https://www.dzaleka.com/)\n\n### Social Media\n- [Facebook](https://www.facebook.com/profile.php?id=61565368021895&__cft__[0]=AZVN8Nof_-4ABtz7ECji06jtgh1sffEiTOdbcOxMqwXjhAEY-FTuztwwBz-qwhd9p3HlKAsnnlp4muu9yn-sk_zqK7_i7maWta_VWUoo-JJkBSTTbjDNwAaXMGfOrqNK5xZWM4eZUEiGiCKSu-to1Ck4USjvxBnlWylqcIj-JYEIJLkiSgfXJYmsk6W0ISDUncYP78SRb1YxBRV2H8C1qnqvNFnUHRJDYUNHNYYTEYF5fQ&__tn__=-]K-y-R)\n- [Instagram](https://www.instagram.com/dzalekadigitalheritage/?locale=es_US&hl=en)\n- [Linkedin](https://www.linkedin.com/company/dzaleka-digital-heritage/)\n";
				}
				function compiledContent() {
					return html;
				}
				function getHeadings() {
					return [{"depth":2,"slug":"about-dzaleka-digital-heritage","text":"About Dzaleka Digital Heritage"},{"depth":3,"slug":"our-services","text":"Our Services"},{"depth":3,"slug":"contact-information","text":"Contact Information"},{"depth":3,"slug":"social-media","text":"Social Media"}];
				}

				const Content = createComponent((result, _props, slots) => {
					const { layout, ...content } = frontmatter;
					content.file = file;
					content.url = url;

					return renderTemplate`${maybeRenderHead()}${unescapeHTML(html)}`;
				});

export { Content, compiledContent, Content as default, file, frontmatter, getHeadings, rawContent, url };
