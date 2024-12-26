import { f as createComponent, i as renderTemplate, m as maybeRenderHead, u as unescapeHTML } from './astro_80255e7d.mjs';
import 'clsx';

const html = "<h2 id=\"about-this-template\">About This Template</h2>\n<p>This business plan template is designed to help entrepreneurs and small business owners in Dzaleka Refugee Camp create professional and comprehensive business plans. The template includes all essential sections needed for a strong business plan.</p>\n<h3 id=\"template-sections\">Template Sections</h3>\n<ol>\n<li>Executive Summary</li>\n<li>Company Description</li>\n<li>Market Analysis</li>\n<li>Organization &#x26; Management</li>\n<li>Service/Product Line</li>\n<li>Marketing &#x26; Sales Strategy</li>\n<li>Funding Requirements</li>\n<li>Financial Projections</li>\n</ol>\n<h3 id=\"features\">Features</h3>\n<ul>\n<li>Pre-formatted sections with guidance text</li>\n<li>Sample financial tables and charts</li>\n<li>Market analysis framework</li>\n<li>Available in multiple languages</li>\n<li>Easy to customize</li>\n</ul>\n<h3 id=\"how-to-use\">How to Use</h3>\n<ol>\n<li>Download the template</li>\n<li>Replace the placeholder text with your business information</li>\n<li>Customize the sections as needed</li>\n<li>Update the financial projections with your numbers</li>\n<li>Add your company branding</li>\n</ol>\n<h3 id=\"languages-available\">Languages Available</h3>\n<ul>\n<li>English (Complete template with all sections)</li>\n<li>French (Complete template with all sections)</li>\n<li>Swahili (Complete template with all sections)</li>\n</ul>";

				const frontmatter = {"title":"Business Plan Template","description":"A comprehensive template for creating a professional business plan, including financial projections and market analysis sections.","date":"2024-02-15T00:00:00.000Z","category":"Templates","fileType":"docx","resourceUrl":"/templates/business-plan-template.docx","downloadUrl":"/downloads/business-plan-template.docx","fileSize":"245 KB","lastUpdated":"2024-02-15T00:00:00.000Z","languages":["English","French","Swahili"],"featured":true,"author":"Business Development Team"};
				const file = "/Users/bakari/Downloads/dzaleka heritage archive/src/content/resources/business-plan-template.md";
				const url = undefined;
				function rawContent() {
					return "\n## About This Template\n\nThis business plan template is designed to help entrepreneurs and small business owners in Dzaleka Refugee Camp create professional and comprehensive business plans. The template includes all essential sections needed for a strong business plan.\n\n### Template Sections\n\n1. Executive Summary\n2. Company Description\n3. Market Analysis\n4. Organization & Management\n5. Service/Product Line\n6. Marketing & Sales Strategy\n7. Funding Requirements\n8. Financial Projections\n\n### Features\n\n- Pre-formatted sections with guidance text\n- Sample financial tables and charts\n- Market analysis framework\n- Available in multiple languages\n- Easy to customize\n\n### How to Use\n\n1. Download the template\n2. Replace the placeholder text with your business information\n3. Customize the sections as needed\n4. Update the financial projections with your numbers\n5. Add your company branding\n\n### Languages Available\n\n- English (Complete template with all sections)\n- French (Complete template with all sections)\n- Swahili (Complete template with all sections)";
				}
				function compiledContent() {
					return html;
				}
				function getHeadings() {
					return [{"depth":2,"slug":"about-this-template","text":"About This Template"},{"depth":3,"slug":"template-sections","text":"Template Sections"},{"depth":3,"slug":"features","text":"Features"},{"depth":3,"slug":"how-to-use","text":"How to Use"},{"depth":3,"slug":"languages-available","text":"Languages Available"}];
				}

				const Content = createComponent((result, _props, slots) => {
					const { layout, ...content } = frontmatter;
					content.file = file;
					content.url = url;

					return renderTemplate`${maybeRenderHead()}${unescapeHTML(html)}`;
				});

export { Content, compiledContent, Content as default, file, frontmatter, getHeadings, rawContent, url };
