/* empty css                            */import { f as createComponent, i as renderTemplate, j as renderComponent, m as maybeRenderHead, l as addAttribute } from '../astro_80255e7d.mjs';
import { g as getCollection, $ as $$Layout } from './__fa3eb426.mjs';

const $$Search = createComponent(async ($$result, $$props, $$slots) => {
  const services = await getCollection("services");
  const events = await getCollection("events");
  const resources = await getCollection("resources");
  const sortByDate = (a, b) => {
    const dateA = new Date(a.data.date || a.data.publishDate || 0);
    const dateB = new Date(b.data.date || b.data.publishDate || 0);
    return dateB.getTime() - dateA.getTime();
  };
  const latestServices = [...services].sort(sortByDate).slice(0, 3);
  const latestEvents = [...events].sort(sortByDate).slice(0, 3);
  const latestResources = [...resources].sort(sortByDate).slice(0, 3);
  function formatDate(date) {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Search Dzaleka Heritage Archive" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="container mx-auto px-4 py-8"> <div class="max-w-3xl mx-auto"> <div class="text-center mb-8"> <h1 class="text-3xl font-bold text-gray-900 mb-4">Search Dzaleka Heritage Archive</h1> <p class="text-gray-600 mb-6">
Find services, events, resources, and more from Dzaleka Refugee Camp
</p> </div> <div class="mb-12"> <form onsubmit="window.location.href='/search/results?q=' + encodeURIComponent(document.getElementById('search-input').value); return false;" class="w-full"> <div class="relative"> <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"> <svg class="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20"> <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"></path> </svg> </div> <input type="text" id="search-input" class="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-primary-500 focus:border-primary-500" placeholder="Find services, resources, events, and more..." required> <button type="submit" class="absolute right-2.5 bottom-2.5 top-2.5 px-4 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300">
Search
</button> </div> </form> </div> <div class="space-y-12">  <section> <h2 class="text-xl font-semibold text-gray-900 mb-6">Latest Resources</h2> <div class="space-y-4"> ${latestResources.map((resource) => renderTemplate`<a${addAttribute(`/resources/${resource.slug}`, "href")} class="block"> <article class="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow"> <div class="flex justify-between items-start"> <div> <h3 class="text-lg font-semibold text-gray-900 mb-2">${resource.data.title}</h3> <p class="text-sm text-gray-600 mb-2">${resource.data.description}</p> ${resource.data.category && renderTemplate`<span class="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full"> ${resource.data.category} </span>`} </div> <time class="text-sm text-gray-500"${addAttribute(resource.data.date, "datetime")}> ${formatDate(resource.data.date || resource.data.publishDate)} </time> </div> </article> </a>`)} </div> </section>  <section> <h2 class="text-xl font-semibold text-gray-900 mb-6">Upcoming Events</h2> <div class="grid grid-cols-1 md:grid-cols-3 gap-6"> ${latestEvents.map((event) => renderTemplate`<a${addAttribute(`/events/${event.slug}`, "href")} class="block"> <article class="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"> <div class="h-48 bg-gray-100"> <img${addAttribute(event.data.image || "/images/placeholder-image.jpg", "src")}${addAttribute(event.data.title, "alt")} class="w-full h-full object-cover"> </div> <div class="p-4"> <h3 class="text-lg font-semibold text-gray-900 mb-2">${event.data.title}</h3> <p class="text-sm text-gray-600 mb-2">${event.data.description}</p> <div class="flex items-center text-sm text-gray-500"> <span>${event.data.location.venue}</span> <span class="mx-2">•</span> <time${addAttribute(event.data.date, "datetime")}>${formatDate(event.data.date)}</time> </div> </div> </article> </a>`)} </div> </section>  <section> <h2 class="text-xl font-semibold text-gray-900 mb-6">Latest Services</h2> <div class="grid grid-cols-1 md:grid-cols-3 gap-6"> ${latestServices.map((service) => renderTemplate`<a${addAttribute(`/services/${service.slug}`, "href")} class="block"> <article class="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow"> <div class="flex items-center mb-4"> <div class="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0"> <img${addAttribute(service.data.logo || "/images/placeholder-logo.png", "src")}${addAttribute(`${service.data.title} logo`, "alt")} class="w-full h-full object-cover"> </div> <div class="ml-4"> <h3 class="text-lg font-semibold text-gray-900">${service.data.title}</h3> <p class="text-sm text-gray-500 capitalize">${service.data.category}</p> </div> </div> <p class="text-sm text-gray-600">${service.data.description}</p> </article> </a>`)} </div> </section> <div class="mb-12"> <h3 class="text-lg font-semibold text-gray-900 mb-4">Popular Searches</h3> <div class="flex flex-wrap justify-center gap-3"> <a${addAttribute(`/search/results?q=${encodeURIComponent("Dzaleka Watch")}`, "href")} class="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors">
Dzaleka Watch
</a> <a${addAttribute(`/search/results?q=${encodeURIComponent("Digital Heritage")}`, "href")} class="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors">
Digital Heritage
</a> <a${addAttribute(`/search/results?q=${encodeURIComponent("Art Exhibition")}`, "href")} class="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors">
Art Exhibition
</a> <a${addAttribute(`/search/results?q=${encodeURIComponent("Tumaini Festival")}`, "href")} class="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors">
Tumaini Festival
</a> </div> </div> </div> </div> </main> ` })}`;
}, "/Users/bakari/Downloads/dzaleka heritage archive/src/pages/search.astro", void 0);

const $$file = "/Users/bakari/Downloads/dzaleka heritage archive/src/pages/search.astro";
const $$url = "/search";

export { $$Search as default, $$file as file, $$url as url };
