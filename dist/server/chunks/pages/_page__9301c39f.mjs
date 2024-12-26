/* empty css                            */import { k as createAstro, f as createComponent, i as renderTemplate, j as renderComponent, m as maybeRenderHead, F as Fragment, l as addAttribute } from '../astro_80255e7d.mjs';
import { g as getCollection, b as $$SearchBar, c as $$ResourceGrid, $ as $$Layout, d as $$EventGrid, e as $$EventPagination } from './__fa3eb426.mjs';

const $$Astro$1 = createAstro();
async function getStaticPaths$1() {
  const resources = await getCollection("resources");
  const itemsPerPage = 6;
  const totalPages = Math.ceil(resources.length / itemsPerPage);
  return Array.from({ length: totalPages }, (_, i) => {
    const page = i + 1;
    const start = i * itemsPerPage;
    const end = start + itemsPerPage;
    return {
      params: { page: String(page) },
      props: {
        resources: resources.sort((a, b) => {
          const dateA = new Date(a.data.date || a.data.publishDate || 0);
          const dateB = new Date(b.data.date || b.data.publishDate || 0);
          return dateB.getTime() - dateA.getTime();
        }).slice(start, end),
        totalResources: resources.length,
        currentPage: page,
        totalPages,
        start: start + 1,
        end: Math.min(end, resources.length)
      }
    };
  });
}
const $$page$1 = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$page$1;
  const { resources, totalResources, currentPage, totalPages, start, end } = Astro2.props;
  const searchQuery = Astro2.url.searchParams.get("search") || "";
  let filteredResources = resources;
  if (searchQuery) {
    filteredResources = resources.filter(
      (resource) => resource.data.title.toLowerCase().includes(searchQuery.toLowerCase()) || resource.data.description.toLowerCase().includes(searchQuery.toLowerCase()) || resource.data.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Resource Hub" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="container mx-auto px-4 py-8"> <!-- Hero Section --> <div class="relative bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl overflow-hidden mb-8"> <div class="absolute inset-0 bg-black/20"></div> <div class="relative px-6 py-12 md:py-16"> <div class="max-w-3xl mx-auto text-center"> <h1 class="text-3xl md:text-4xl font-bold text-white mb-4">
Resource Hub
</h1> <p class="text-lg md:text-xl text-white/90">
Access guides, templates, and educational materials to support your journey
</p> </div> </div> </div> <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8"> <div class="flex items-center gap-2 text-gray-600"> <span>Showing ${start}-${end} of ${totalResources} resources</span> </div> ${renderComponent($$result2, "SearchBar", $$SearchBar, { "placeholder": "Search resources...", "initialValue": searchQuery, "section": "resources" })} </div> ${filteredResources.length > 0 ? renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": ($$result3) => renderTemplate` ${renderComponent($$result3, "ResourceGrid", $$ResourceGrid, { "resources": filteredResources })} ${totalPages > 1 && renderTemplate`<div class="mt-8"> <nav class="flex justify-center gap-2" aria-label="Pagination"> ${currentPage > 1 && renderTemplate`<a${addAttribute(`/resources/${currentPage - 1}${searchQuery ? `?search=${searchQuery}` : ""}`, "href")} class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
Previous
</a>`} <span class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg">
Page ${currentPage} of ${totalPages} </span> ${currentPage < totalPages && renderTemplate`<a${addAttribute(`/resources/${currentPage + 1}${searchQuery ? `?search=${searchQuery}` : ""}`, "href")} class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
Next
</a>`} </nav> </div>`}` })}` : renderTemplate`<div class="text-center py-12"> <h2 class="text-xl font-semibold text-gray-900 mb-2">No resources found</h2> <p class="text-gray-600"> ${searchQuery ? `No resources match "${searchQuery}"` : "No resources available at the moment"} </p> </div>`} </main> ` })}`;
}, "/Users/bakari/Downloads/dzaleka heritage archive/src/pages/resources/[page].astro", void 0);

const $$file$1 = "/Users/bakari/Downloads/dzaleka heritage archive/src/pages/resources/[page].astro";
const $$url$1 = "/resources/[page]";

const _page_$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$page$1,
  file: $$file$1,
  getStaticPaths: getStaticPaths$1,
  url: $$url$1
}, Symbol.toStringTag, { value: 'Module' }));

const $$Astro = createAstro();
async function getStaticPaths() {
  const allEvents = await getCollection("events");
  const itemsPerPage = 4;
  function isUpcoming(date) {
    const today = /* @__PURE__ */ new Date();
    today.setHours(0, 0, 0, 0);
    const eventDate = new Date(date);
    eventDate.setHours(0, 0, 0, 0);
    return eventDate >= today;
  }
  const upcomingEvents = allEvents.filter((event) => isUpcoming(event.data.date)).sort((a, b) => new Date(a.data.date).getTime() - new Date(b.data.date).getTime());
  const pastEvents = allEvents.filter((event) => !isUpcoming(event.data.date)).sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime());
  const generatePaths = (events, type) => {
    const totalPages = Math.max(1, Math.ceil(events.length / itemsPerPage));
    return Array.from({ length: totalPages }, (_, i) => ({
      params: { type, page: (i + 1).toString() },
      props: { events, totalPages, currentPage: i + 1 }
    }));
  };
  return [
    ...generatePaths(upcomingEvents, "upcoming"),
    ...generatePaths(pastEvents, "past")
  ];
}
const $$page = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$page;
  const { type, page } = Astro2.params;
  const { events: allEvents, totalPages, currentPage } = Astro2.props;
  const searchQuery = Astro2.url.searchParams.get("search")?.trim() || "";
  const filteredEvents = searchQuery ? allEvents.filter(
    (event) => event.data.title.toLowerCase().includes(searchQuery.toLowerCase()) || event.data.description.toLowerCase().includes(searchQuery.toLowerCase())
  ) : allEvents;
  const itemsPerPage = 4;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredEvents.length);
  const paginatedEvents = filteredEvents.slice(startIndex, endIndex);
  const events = paginatedEvents.map((event) => ({
    ...event,
    data: { ...event.data, status: type === "upcoming" ? "upcoming" : "past" }
  }));
  function buildPaginationUrl(page2) {
    const baseUrl = `/events/${type}/${page2}`;
    return searchQuery ? `${baseUrl}?search=${searchQuery}` : baseUrl;
  }
  if (paginatedEvents.length === 0 && filteredEvents.length > 0) {
    return Astro2.redirect("/events/" + type + "/1" + (searchQuery ? `?search=${searchQuery}` : ""));
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `${type === "upcoming" ? "Upcoming" : "Past"} Events` }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="container mx-auto px-4 py-8"> <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8"> <div> <h1 class="text-3xl font-bold text-gray-900">Events</h1> <h2 class="text-xl text-gray-600 mt-2"> ${type === "upcoming" ? "Upcoming Events" : "Past Events"} </h2> </div> ${renderComponent($$result2, "SearchBar", $$SearchBar, { "placeholder": "Search events...", "initialValue": searchQuery, "section": "events" })} </div> ${filteredEvents.length === 0 ? renderTemplate`<div class="text-center py-8"> <p class="text-gray-500"> ${searchQuery ? `No ${type} events found matching "${searchQuery}"` : `No ${type} events available`} </p> </div>` : renderTemplate`<div> <div class="mb-4"> <p class="text-gray-600">
Showing ${startIndex + 1}-${endIndex} of ${filteredEvents.length} events
${searchQuery && ` matching "${searchQuery}"`} </p> </div> ${renderComponent($$result2, "EventGrid", $$EventGrid, { "events": events })} ${totalPages > 1 && renderTemplate`<div class="mt-8"> ${renderComponent($$result2, "EventPagination", $$EventPagination, { "currentPage": currentPage, "totalPages": totalPages, "baseUrl": buildPaginationUrl })} </div>`} </div>`} <div class="mt-8 flex justify-center"> <a${addAttribute(`/events/${type === "upcoming" ? "past" : "upcoming"}/1`, "href")} class="text-primary-600 hover:text-primary-700 font-medium">
View ${type === "upcoming" ? "Past" : "Upcoming"} Events →
</a> </div> </main> ` })}`;
}, "/Users/bakari/Downloads/dzaleka heritage archive/src/pages/events/[type]/[page].astro", void 0);

const $$file = "/Users/bakari/Downloads/dzaleka heritage archive/src/pages/events/[type]/[page].astro";
const $$url = "/events/[type]/[page]";

const _page_ = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$page,
  file: $$file,
  getStaticPaths,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

export { _page_$1 as _, _page_ as a };
