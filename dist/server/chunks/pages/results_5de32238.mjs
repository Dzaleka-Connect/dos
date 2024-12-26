/* empty css                            */import { k as createAstro, f as createComponent, i as renderTemplate, j as renderComponent, m as maybeRenderHead, l as addAttribute } from '../astro_80255e7d.mjs';
import { g as getCollection, $ as $$Layout } from './__fa3eb426.mjs';

const $$Astro = createAstro();
const $$Results = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Results;
  const services = await getCollection("services");
  const events = await getCollection("events");
  const resources = await getCollection("resources");
  const query = Astro2.url.searchParams.get("q") || "";
  function searchContent(items, searchQuery) {
    if (!searchQuery)
      return [];
    const normalizedQuery = searchQuery.toLowerCase().trim();
    return items.filter((item) => {
      const searchableFields = [
        item.data.title,
        item.data.description,
        item.data.category,
        item.slug.replace(/-/g, " "),
        item.data.location?.address,
        item.data.location?.city,
        ...item.data.tags || []
      ];
      const searchableText = searchableFields.filter(Boolean).join(" ").toLowerCase();
      const queryWords = normalizedQuery.split(/\s+/);
      return queryWords.some(
        (word) => searchableText.includes(word) || // Check for close matches (e.g., "dzaleka" matches "zaleka")
        word === "dzaleka" && searchableText.includes("zaleka")
      );
    });
  }
  const searchResults = {
    services: searchContent(services, query),
    events: searchContent(events, query),
    resources: searchContent(resources, query)
  };
  const totalResults = Object.values(searchResults).reduce(
    (sum, results) => sum + results.length,
    0
  );
  function formatDate(date) {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `Search Results for "${query}"` }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="container mx-auto px-4 py-8"> <div class="max-w-3xl mx-auto"> <div class="mb-8"> <h1 class="text-3xl font-bold text-gray-900 mb-4">Search Results</h1> <p class="text-gray-600"> ${totalResults === 0 ? `No results found for "${query}"` : `Found ${totalResults} result${totalResults === 1 ? "" : "s"} for "${query}"`} </p> </div> ${totalResults > 0 ? renderTemplate`<div class="space-y-8">  ${searchResults.services.length > 0 && renderTemplate`<section> <h2 class="text-xl font-semibold text-gray-900 mb-4">Services</h2> <div class="space-y-4"> ${searchResults.services.map((service) => renderTemplate`<a${addAttribute(`/services/${service.slug}`, "href")} class="block"> <article class="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow"> <div class="flex items-start gap-4"> <div class="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0"> <img${addAttribute(service.data.logo || "/images/placeholder-logo.png", "src")}${addAttribute(`${service.data.title} logo`, "alt")} class="w-full h-full object-cover"> </div> <div class="flex-grow"> <h3 class="text-lg font-semibold text-gray-900">${service.data.title}</h3> <p class="text-sm text-gray-600 mb-2">${service.data.description}</p> <span class="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full"> ${service.data.category} </span> </div> </div> </article> </a>`)} </div> </section>`}  ${searchResults.events.length > 0 && renderTemplate`<section> <h2 class="text-xl font-semibold text-gray-900 mb-4">Events</h2> <div class="space-y-4"> ${searchResults.events.map((event) => renderTemplate`<a${addAttribute(`/events/${event.slug}`, "href")} class="block"> <article class="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"> <div class="h-48 bg-gray-100"> <img${addAttribute(event.data.image || "/images/placeholder-image.jpg", "src")}${addAttribute(event.data.title, "alt")} class="w-full h-full object-cover"> </div> <div class="p-4"> <h3 class="text-lg font-semibold text-gray-900 mb-2">${event.data.title}</h3> <p class="text-sm text-gray-600 mb-2">${event.data.description}</p> <div class="flex items-center text-sm text-gray-500"> <span>${event.data.location.venue}</span> <span class="mx-2">•</span> <time${addAttribute(event.data.date, "datetime")}>${formatDate(event.data.date)}</time> </div> </div> </article> </a>`)} </div> </section>`}  ${searchResults.resources.length > 0 && renderTemplate`<section> <h2 class="text-xl font-semibold text-gray-900 mb-4">Resources</h2> <div class="space-y-4"> ${searchResults.resources.map((resource) => renderTemplate`<a${addAttribute(`/resources/${resource.slug}`, "href")} class="block"> <article class="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow"> <div class="flex justify-between items-start"> <div> <h3 class="text-lg font-semibold text-gray-900 mb-2">${resource.data.title}</h3> <p class="text-sm text-gray-600 mb-2">${resource.data.description}</p> ${resource.data.category && renderTemplate`<span class="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full"> ${resource.data.category} </span>`} </div> <time class="text-sm text-gray-500"${addAttribute(resource.data.date, "datetime")}> ${formatDate(resource.data.date || resource.data.publishDate)} </time> </div> </article> </a>`)} </div> </section>`} </div>` : renderTemplate`<div class="text-center py-12 bg-white rounded-lg shadow-sm"> <h2 class="text-xl font-semibold text-gray-900 mb-4">
No matching results found
</h2> <p class="text-gray-600 mb-6">
Try adjusting your search terms or browse our categories
</p> <div class="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto"> <a href="/services" class="p-4 bg-gray-50 rounded-lg hover:bg-gray-100"> <h3 class="font-semibold text-gray-900 mb-2">Services</h3> <p class="text-sm text-gray-600">Browse all services</p> </a> <a href="/events" class="p-4 bg-gray-50 rounded-lg hover:bg-gray-100"> <h3 class="font-semibold text-gray-900 mb-2">Events</h3> <p class="text-sm text-gray-600">See all events</p> </a> <a href="/resources" class="p-4 bg-gray-50 rounded-lg hover:bg-gray-100"> <h3 class="font-semibold text-gray-900 mb-2">Resources</h3> <p class="text-sm text-gray-600">View all resources</p> </a> </div> </div>`} <div class="mt-8"> <a href="/search" class="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700"> <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path> </svg>
Back to Search
</a> </div> </div> </main> ` })}`;
}, "/Users/bakari/Downloads/dzaleka heritage archive/src/pages/search/results.astro", void 0);

const $$file = "/Users/bakari/Downloads/dzaleka heritage archive/src/pages/search/results.astro";
const $$url = "/search/results";

export { $$Results as default, $$file as file, $$url as url };
