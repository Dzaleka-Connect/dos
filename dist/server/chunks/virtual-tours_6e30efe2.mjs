import { f as createComponent, i as renderTemplate, m as maybeRenderHead, u as unescapeHTML } from './astro_80255e7d.mjs';
import 'clsx';

const html = "<h1 id=\"virtual-tours-of-dzaleka\">Virtual Tours of Dzaleka</h1>\n<h2 id=\"available-tours\">Available Tours</h2>\n<h3 id=\"community-centers\">Community Centers</h3>\n<p>Take a virtual walk through our community spaces and see where various activities take place.</p>\n<h3 id=\"educational-facilities\">Educational Facilities</h3>\n<p>Visit our schools and training centers virtually.</p>\n<h3 id=\"cultural-spaces\">Cultural Spaces</h3>\n<p>Experience the vibrant cultural locations within the camp.</p>\n<h2 id=\"how-to-access-tours\">How to Access Tours</h2>\n<ol>\n<li>Choose a location from the list below</li>\n<li>Click on the VR viewer icon</li>\n<li>Use your mouse or touch screen to navigate</li>\n<li>For best experience, use VR headset if available</li>\n</ol>\n<h2 id=\"featured-locations\">Featured Locations</h2>\n<ul>\n<li>Dzaleka Community Center</li>\n<li>Training Facilities</li>\n<li>Art Spaces</li>\n<li>Cultural Centers</li>\n</ul>";

				const frontmatter = {"title":"Virtual Tours","description":"Experience Dzaleka through virtual reality","pubDate":"2023-09-14T00:00:00.000Z"};
				const file = "/Users/bakari/Downloads/dzaleka heritage archive/src/content/pages/virtual-tours.md";
				const url = "/virtual-tours";
				function rawContent() {
					return "\n# Virtual Tours of Dzaleka\n\n## Available Tours\n\n### Community Centers\nTake a virtual walk through our community spaces and see where various activities take place.\n\n### Educational Facilities\nVisit our schools and training centers virtually.\n\n### Cultural Spaces\nExperience the vibrant cultural locations within the camp.\n\n## How to Access Tours\n\n1. Choose a location from the list below\n2. Click on the VR viewer icon\n3. Use your mouse or touch screen to navigate\n4. For best experience, use VR headset if available\n\n## Featured Locations\n\n- Dzaleka Community Center\n- Training Facilities\n- Art Spaces\n- Cultural Centers";
				}
				function compiledContent() {
					return html;
				}
				function getHeadings() {
					return [{"depth":1,"slug":"virtual-tours-of-dzaleka","text":"Virtual Tours of Dzaleka"},{"depth":2,"slug":"available-tours","text":"Available Tours"},{"depth":3,"slug":"community-centers","text":"Community Centers"},{"depth":3,"slug":"educational-facilities","text":"Educational Facilities"},{"depth":3,"slug":"cultural-spaces","text":"Cultural Spaces"},{"depth":2,"slug":"how-to-access-tours","text":"How to Access Tours"},{"depth":2,"slug":"featured-locations","text":"Featured Locations"}];
				}

				const Content = createComponent((result, _props, slots) => {
					const { layout, ...content } = frontmatter;
					content.file = file;
					content.url = url;

					return renderTemplate`${maybeRenderHead()}${unescapeHTML(html)}`;
				});

export { Content, compiledContent, Content as default, file, frontmatter, getHeadings, rawContent, url };
