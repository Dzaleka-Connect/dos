import { f as createComponent, i as renderTemplate, m as maybeRenderHead, u as unescapeHTML } from './astro_80255e7d.mjs';
import 'clsx';

const html = "<p>We’re thrilled to share that Dzaleka Online is growing! Our new initiative, Dzaleka Digital Heritage <a href=\"https://www.instagram.com/dzalekadigitalheritage/?locale=es_US&#x26;hl=en\">@dzalekadigitalheritage</a>, will build on our mission to showcase the Refugee Experience in Dzaleka through captivating visuals and inspiring stories.</p>\n<h3 id=\"-our-mission\">🎯 Our Mission:</h3>\n<p>To highlight the beauty and reality of refugees beyond the labels perpetuated by the Western gaze. Our mission will continue as always to empower the Dzaleka community by providing digital skills, creating engaging heritage tech solutions, and fostering research and collaboration.</p>\n<h3 id=\"-whats-new\">🆕 What’s New:</h3>\n<p>Dzaleka Digital Heritage <a href=\"https://www.instagram.com/dzalekadigitalheritage/?locale=es_US&#x26;hl=en\">@dzalekadigitalheritage</a> will focus on preserving the rich culture and history of Dzaleka Refugee Camp through cutting-edge digital innovation and ensuring that the unique heritage, traditions, and stories of our community are documented, celebrated, and shared with the world.</p>\n<h3 id=\"-get-involved\">🤝 Get Involved:</h3>\n<p>We believe in the power of community, and we want you to be part of this exciting journey! Whether you have skills in digital technology, storytelling, cultural preservation, or simply a passion for making a difference, we’d love to hear from you.</p>\n<h3 id=\"how-to-reach-out\">How to reach out:</h3>\n<ul>\n<li>DM us on <a href=\"https://www.instagram.com/dzalekadigitalheritage/?locale=es_US&#x26;hl=en\">Instagram</a></li>\n<li>Email us at <a href=\"mailto:dzalekaconnect@gmail.com\">dzalekaconnect@gmail.com</a></li>\n</ul>";

				const frontmatter = {"title":"The Next Chapter of Dzaleka Online!","description":"Building on our mission to showcase the Refugee Experience in Dzaleka through captivating visuals and inspiring stories.","date":"2024-12-24T00:00:00.000Z","category":"business-spotlight","featured":true,"image":"https://scontent.fbne5-1.fna.fbcdn.net/v/t39.30808-6/469327672_18341391979180415_9128542224026871222_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=127cfc&_nc_ohc=ImSWqMn3xJMQ7kNvgGxnqXM&_nc_zt=23&_nc_ht=scontent.fbne5-1.fna&_nc_gid=A32mi-_YnnEvEqzjBWW_QkQ&oh=00_AYBln62QDf4TZIt6Xn0Ydl1Tak1Nns2DNeHS6iZJvvWSbg&oe=677031A2","author":"Bakari Mustafa","businessName":"Dzaleka Digital Heritage","businessOwner":"Dzaleka Online","contactInfo":{"email":"dzalekaconnect@gmail.com","phone":"+265 991 234567","website":"https://dzaleka.com"},"tags":["Digital Innovation ","Refugee Voices","Community Empowerment"]};
				const file = "/Users/bakari/Downloads/dzaleka heritage archive/src/content/news/dzaleka-artisans-cooperative-launch.md";
				const url = undefined;
				function rawContent() {
					return "\nWe’re thrilled to share that Dzaleka Online is growing! Our new initiative, Dzaleka Digital Heritage [@dzalekadigitalheritage](https://www.instagram.com/dzalekadigitalheritage/?locale=es_US&hl=en), will build on our mission to showcase the Refugee Experience in Dzaleka through captivating visuals and inspiring stories.\n\n### 🎯 Our Mission:\nTo highlight the beauty and reality of refugees beyond the labels perpetuated by the Western gaze. Our mission will continue as always to empower the Dzaleka community by providing digital skills, creating engaging heritage tech solutions, and fostering research and collaboration.\n\n### 🆕 What’s New:\nDzaleka Digital Heritage [@dzalekadigitalheritage](https://www.instagram.com/dzalekadigitalheritage/?locale=es_US&hl=en) will focus on preserving the rich culture and history of Dzaleka Refugee Camp through cutting-edge digital innovation and ensuring that the unique heritage, traditions, and stories of our community are documented, celebrated, and shared with the world.\n\n### 🤝 Get Involved:\nWe believe in the power of community, and we want you to be part of this exciting journey! Whether you have skills in digital technology, storytelling, cultural preservation, or simply a passion for making a difference, we'd love to hear from you.\n\n### How to reach out:\n- DM us on [Instagram](https://www.instagram.com/dzalekadigitalheritage/?locale=es_US&hl=en)\n- Email us at [dzalekaconnect@gmail.com](mailto:dzalekaconnect@gmail.com)";
				}
				function compiledContent() {
					return html;
				}
				function getHeadings() {
					return [{"depth":3,"slug":"-our-mission","text":"🎯 Our Mission:"},{"depth":3,"slug":"-whats-new","text":"🆕 What’s New:"},{"depth":3,"slug":"-get-involved","text":"🤝 Get Involved:"},{"depth":3,"slug":"how-to-reach-out","text":"How to reach out:"}];
				}

				const Content = createComponent((result, _props, slots) => {
					const { layout, ...content } = frontmatter;
					content.file = file;
					content.url = url;

					return renderTemplate`${maybeRenderHead()}${unescapeHTML(html)}`;
				});

export { Content, compiledContent, Content as default, file, frontmatter, getHeadings, rawContent, url };
