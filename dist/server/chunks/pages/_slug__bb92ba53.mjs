/* empty css                            */import { k as createAstro, f as createComponent, i as renderTemplate, m as maybeRenderHead, j as renderComponent, l as addAttribute } from '../astro_80255e7d.mjs';
import 'clsx';
import { g as getCollection, $ as $$Layout } from './__fa3eb426.mjs';
/* empty css                            */
const $$Astro$2 = createAstro();
const $$DocsContent = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$DocsContent;
  const { content } = Astro2.props;
  const { Content } = await content.render();
  return renderTemplate`${maybeRenderHead()}<main class="lg:col-span-9" data-astro-cid-3byeg72h> <div class="bg-white shadow-sm rounded-lg border border-gray-200 p-8" data-astro-cid-3byeg72h> <article class="prose prose-blue max-w-none" data-astro-cid-3byeg72h> <h1 data-astro-cid-3byeg72h>${content.data.title}</h1> ${renderComponent($$result, "Content", Content, { "data-astro-cid-3byeg72h": true })} </article> </div> </main> `;
}, "/Users/bakari/Downloads/dzaleka heritage archive/src/components/docs/DocsContent.astro", void 0);

const $$Astro$1 = createAstro();
const $$DocsSidebar = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$DocsSidebar;
  const { currentSlug } = Astro2.props;
  const docs = await getCollection("docs");
  const categories = {
    "Getting Started": ["getting-started", "platform-overview", "registration"],
    "Using the Platform": ["navigation", "services-guide", "favorites"],
    "Services": ["finding-services", "categories", "contacting-providers"],
    "Resources": ["downloads", "tutorials", "guides"]
  };
  return renderTemplate`${maybeRenderHead()}<aside class="lg:col-span-3"> <nav class="sticky top-8 space-y-6"> <div class="bg-white shadow-sm rounded-lg border border-gray-200 p-6"> <div class="space-y-6"> ${Object.entries(categories).map(([category, items]) => renderTemplate`<div> <h3 class="font-semibold text-gray-900 mb-3">${category}</h3> <ul class="space-y-2"> ${items.map((slug) => {
    const doc = docs.find((d) => d.slug === slug);
    if (!doc)
      return null;
    return renderTemplate`<li> <a${addAttribute(`/docs/${doc.slug}`, "href")}${addAttribute([
      "block text-sm",
      currentSlug === doc.slug ? "text-primary-600 font-medium" : "text-gray-600 hover:text-gray-900"
    ], "class:list")}> ${doc.data.title} </a> </li>`;
  })} </ul> </div>`)} </div> </div> </nav> </aside>`;
}, "/Users/bakari/Downloads/dzaleka heritage archive/src/components/docs/DocsSidebar.astro", void 0);

const $$Astro = createAstro();
async function getStaticPaths() {
  const docs = await getCollection("docs");
  return docs.map((doc) => ({
    params: { slug: doc.slug },
    props: { doc }
  }));
}
const $$slug = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$slug;
  const { doc } = Astro2.props;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `${doc.data.title} - Documentation` }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="bg-gray-50 min-h-screen"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"> <div class="lg:grid lg:grid-cols-12 lg:gap-8"> ${renderComponent($$result2, "DocsSidebar", $$DocsSidebar, { "currentSlug": doc.slug })} ${renderComponent($$result2, "DocsContent", $$DocsContent, { "content": doc })} </div> </div> </div> ` })}`;
}, "/Users/bakari/Downloads/dzaleka heritage archive/src/pages/docs/[slug].astro", void 0);

const $$file = "/Users/bakari/Downloads/dzaleka heritage archive/src/pages/docs/[slug].astro";
const $$url = "/docs/[slug]";

const _slug_ = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$slug,
  file: $$file,
  getStaticPaths,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

export { $$DocsContent as $, _slug_ as _ };
