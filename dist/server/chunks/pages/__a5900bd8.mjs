/* empty css                            */import { k as createAstro, f as createComponent, i as renderTemplate, j as renderComponent, m as maybeRenderHead, l as addAttribute, F as Fragment } from '../astro_80255e7d.mjs';
import { g as getCollection, $ as $$Layout, a as $$Badge } from './__fa3eb426.mjs';
import { format } from 'date-fns';
import 'clsx';

const $$Astro$6 = createAstro();
async function getStaticPaths$4() {
  const services = await getCollection("services");
  return services.map((service) => ({
    params: { slug: service.slug },
    props: { service }
  }));
}
const $$$4 = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$6, $$props, $$slots);
  Astro2.self = $$$4;
  const { service } = Astro2.props;
  const { Content } = await service.render();
  const defaultLogo = "/images/logos/default-service.svg";
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": service.data.title }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="container mx-auto px-4 py-8"> <div class="max-w-4xl mx-auto"> <!-- Breadcrumb --> <nav class="flex items-center gap-2 text-sm text-gray-500 mb-6 overflow-x-auto whitespace-nowrap py-2"> <a href="/" class="hover:text-primary-600">Home</a> <span>/</span> <a href="/services" class="hover:text-primary-600">Services</a> <span>/</span> <span class="text-gray-900 truncate">${service.data.title}</span> </nav> <!-- Back Button --> <div class="mb-6"> <a href="javascript:history.back()" class="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 group"> <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path> </svg> <span>Back to Services</span> </a> </div> <article class="bg-white rounded-2xl shadow-sm overflow-hidden"> <!-- Header Section --> <div class="p-6 sm:p-8"> <div class="flex flex-col sm:flex-row sm:items-start gap-6 mb-8"> ${service.data.logo ? renderTemplate`<img${addAttribute(service.data.logo, "src")}${addAttribute(`${service.data.title} logo`, "alt")} class="w-24 h-24 sm:w-32 sm:h-32 object-contain bg-white rounded-xl p-4 border border-gray-100 mx-auto sm:mx-0">` : renderTemplate`<img${addAttribute(defaultLogo, "src")} alt="Default service logo" class="w-24 h-24 sm:w-32 sm:h-32 object-contain bg-white rounded-xl p-4 border border-gray-100 mx-auto sm:mx-0">`} <div class="text-center sm:text-left"> <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">${service.data.title}</h1> <p class="text-lg text-gray-600 mb-4">${service.data.description}</p> <div class="inline-block px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium"> ${service.data.category} </div> </div> </div> <!-- Contact Information --> <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 bg-gray-50 rounded-xl p-4 sm:p-6"> ${service.data.socialMedia?.website && renderTemplate`<a${addAttribute(service.data.socialMedia.website, "href")} target="_blank" rel="noopener noreferrer" class="flex items-center gap-3 p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors"> <div class="flex-shrink-0 bg-primary-50 p-2 rounded-lg"> <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path> </svg> </div> <span class="text-gray-600">Visit Website</span> </a>`} ${service.data.contact?.email && renderTemplate`<a${addAttribute(`mailto:${service.data.contact.email}`, "href")} class="flex items-center gap-3 p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors"> <div class="flex-shrink-0 bg-primary-50 p-2 rounded-lg"> <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path> </svg> </div> <span class="text-gray-600 break-all">${service.data.contact.email}</span> </a>`} ${service.data.contact?.phone && renderTemplate`<a${addAttribute(`tel:${service.data.contact.phone}`, "href")} class="flex items-center gap-3 p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors"> <div class="flex-shrink-0 bg-primary-50 p-2 rounded-lg"> <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path> </svg> </div> <span class="text-gray-600">${service.data.contact.phone}</span> </a>`} ${service.data.location?.address && renderTemplate`<div class="flex items-center gap-3 p-3 bg-white rounded-lg"> <div class="flex-shrink-0 bg-primary-50 p-2 rounded-lg"> <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path> </svg> </div> <span class="text-gray-600"> ${service.data.location.address}, ${service.data.location.city} </span> </div>`} ${service.data.contact?.hours && renderTemplate`<div class="flex items-center gap-3 p-3 bg-white rounded-lg"> <div class="flex-shrink-0 bg-primary-50 p-2 rounded-lg"> <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path> </svg> </div> <span class="text-gray-600">${service.data.contact.hours}</span> </div>`} </div> <!-- Social Media Links --> ${service.data.socialMedia && Object.keys(service.data.socialMedia).length > 0 && renderTemplate`<div class="mt-6 bg-white rounded-xl p-4 sm:p-6 border border-gray-100"> <h3 class="text-lg font-semibold text-gray-900 mb-4">Connect With Us</h3> <div class="flex flex-wrap gap-4"> ${service.data.socialMedia.facebook && renderTemplate`<a${addAttribute(service.data.socialMedia.facebook, "href")} target="_blank" rel="noopener noreferrer" class="flex items-center gap-2 px-4 py-2 bg-[#1877F2]/10 text-[#1877F2] rounded-lg hover:bg-[#1877F2]/20 transition-colors"> <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"> <path fill-rule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clip-rule="evenodd"></path> </svg> <span>Facebook</span> </a>`} ${service.data.socialMedia.twitter && renderTemplate`<a${addAttribute(service.data.socialMedia.twitter, "href")} target="_blank" rel="noopener noreferrer" class="flex items-center gap-2 px-4 py-2 bg-[#1DA1F2]/10 text-[#1DA1F2] rounded-lg hover:bg-[#1DA1F2]/20 transition-colors"> <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"> <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path> </svg> <span>Twitter</span> </a>`} ${service.data.socialMedia.instagram && renderTemplate`<a${addAttribute(service.data.socialMedia.instagram, "href")} target="_blank" rel="noopener noreferrer" class="flex items-center gap-2 px-4 py-2 bg-[#E4405F]/10 text-[#E4405F] rounded-lg hover:bg-[#E4405F]/20 transition-colors"> <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"> <path fill-rule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clip-rule="evenodd"></path> </svg> <span>Instagram</span> </a>`} ${service.data.socialMedia.linkedin && renderTemplate`<a${addAttribute(service.data.socialMedia.linkedin, "href")} target="_blank" rel="noopener noreferrer" class="flex items-center gap-2 px-4 py-2 bg-[#0A66C2]/10 text-[#0A66C2] rounded-lg hover:bg-[#0A66C2]/20 transition-colors"> <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"> <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path> </svg> <span>LinkedIn</span> </a>`} </div> </div>`} </div> <!-- Content Section --> <div class="prose prose-lg max-w-none p-6 sm:p-8 bg-gray-50 border-t border-gray-100"> ${renderComponent($$result2, "Content", Content, {})} </div> </article> </div> </main> ` })}`;
}, "/Users/bakari/Downloads/dzaleka heritage archive/src/pages/services/[...slug].astro", void 0);

const $$file$4 = "/Users/bakari/Downloads/dzaleka heritage archive/src/pages/services/[...slug].astro";
const $$url$4 = "/services/[...slug]";

const ____slug_$4 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$$4,
  file: $$file$4,
  getStaticPaths: getStaticPaths$4,
  url: $$url$4
}, Symbol.toStringTag, { value: 'Module' }));

const $$Astro$5 = createAstro();
async function getStaticPaths$3() {
  const events = await getCollection("events");
  return events.map((entry) => ({
    params: { slug: entry.slug },
    props: { entry }
  }));
}
const $$$3 = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$5, $$props, $$slots);
  Astro2.self = $$$3;
  const { entry } = Astro2.props;
  const { Content } = await entry.render();
  function formatLocation(location) {
    if (typeof location === "string")
      return location;
    return location.venue && location.city ? `${location.venue}, ${location.city}` : location.venue || location.city || "Location TBA";
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": entry.data.title }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="container mx-auto px-4 py-8"> <div class="max-w-4xl mx-auto"> <div class="bg-white rounded-2xl shadow-sm overflow-hidden"> <!-- Hero Image --> <div class="relative"> <img${addAttribute(entry.data.image, "src")}${addAttribute(entry.data.title, "alt")} class="w-full h-[60vh] object-cover"> <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"> <div class="absolute bottom-0 p-8"> ${renderComponent($$result2, "Badge", $$Badge, { "variant": "blue", "size": "md" }, { "default": ($$result3) => renderTemplate`${entry.data.category}` })} <h1 class="text-4xl font-bold text-white mt-4"> ${entry.data.title} </h1> </div> </div> </div> <!-- Content --> <div class="p-8"> <!-- Event Info --> <div class="flex flex-wrap gap-6 mb-8 pb-8 border-b"> <div class="flex items-center gap-2 text-gray-600"> <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"> <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"></path> </svg> <time${addAttribute(entry.data.date.toISOString(), "datetime")}> ${format(entry.data.date, "MMMM d, yyyy")} </time> </div> <div class="flex items-center gap-2 text-gray-600"> <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"> <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path> </svg> ${formatLocation(entry.data.location)} </div> ${entry.data.photographer && renderTemplate`<div class="flex items-center gap-2 text-gray-600"> <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"> <path fill-rule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd"></path> </svg> <span>Photos by </span> ${entry.data.photographer.instagram ? renderTemplate`<a${addAttribute(`https://instagram.com/${entry.data.photographer.instagram}`, "href")} target="_blank" rel="noopener noreferrer" class="text-primary-600 hover:text-primary-700">
@${entry.data.photographer.instagram} </a>` : renderTemplate`<span>${entry.data.photographer.name}</span>`} </div>`} </div> <!-- Description --> <p class="text-xl text-gray-600 mb-8"> ${entry.data.description} </p> <!-- Event Content --> <div class="prose prose-lg max-w-none"> ${renderComponent($$result2, "Content", Content, {})} </div> <!-- Action Buttons --> <div class="mt-8 flex flex-wrap gap-4"> ${entry.data.registrationLink && entry.data.status === "upcoming" && renderTemplate`<a${addAttribute(entry.data.registrationLink, "href")} class="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors">
Register Now
<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor"> <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"></path> </svg> </a>`} ${entry.data.gallery && entry.data.status === "past" && renderTemplate`<a${addAttribute(entry.data.gallery, "href")} class="inline-flex items-center px-6 py-3 bg-primary-100 text-primary-700 rounded-xl hover:bg-primary-200 transition-colors">
View Photo Gallery
<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor"> <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd"></path> </svg> </a>`} </div> </div> </div> </div> </main> ` })}`;
}, "/Users/bakari/Downloads/dzaleka heritage archive/src/pages/events/[...slug].astro", void 0);

const $$file$3 = "/Users/bakari/Downloads/dzaleka heritage archive/src/pages/events/[...slug].astro";
const $$url$3 = "/events/[...slug]";

const ____slug_$3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$$3,
  file: $$file$3,
  getStaticPaths: getStaticPaths$3,
  url: $$url$3
}, Symbol.toStringTag, { value: 'Module' }));

const $$Astro$4 = createAstro();
async function getStaticPaths$2() {
  const photos = await getCollection("photos");
  return photos.map((entry) => ({
    params: { slug: entry.slug },
    props: { entry }
  }));
}
const $$$2 = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$4, $$props, $$slots);
  Astro2.self = $$$2;
  const { entry } = Astro2.props;
  const { Content } = await entry.render();
  const photoYear = new Date(entry.data.date).getFullYear();
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": entry.data.title }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="container mx-auto px-4 py-8"> <div class="max-w-4xl mx-auto"> <!-- Breadcrumb Navigation --> <nav class="flex items-center gap-2 text-sm text-gray-600 mb-6"> <a href="/photos" class="hover:text-primary-600">Gallery</a> <span>/</span> <a${addAttribute(`/photos/${photoYear}`, "href")} class="hover:text-primary-600">${photoYear}</a> <span>/</span> <span class="text-gray-900">${entry.data.title}</span> </nav> <!-- Return Button --> <div class="mb-6"> <a href="javascript:history.back()" class="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 group"> <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path> </svg> <span>Back</span> </a> </div> <div class="bg-white rounded-2xl shadow-sm overflow-hidden"> <!-- Hero Image --> <div class="relative"> <img${addAttribute(entry.data.image, "src")}${addAttribute(entry.data.title, "alt")} class="w-full h-[60vh] object-cover"> <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"> <div class="absolute bottom-0 p-8"> <h1 class="text-4xl font-bold text-white mb-4"> ${entry.data.title} </h1> <div class="flex flex-wrap gap-2 mb-4"> ${entry.data.tags.map((tag) => renderTemplate`${renderComponent($$result2, "Badge", $$Badge, { "variant": "blue" }, { "default": ($$result3) => renderTemplate`${tag}` })}`)} </div> </div> </div> </div> <!-- Content --> <div class="p-8"> <!-- Photographer Info --> <div class="flex items-center justify-between mb-8 pb-8 border-b"> <div class="flex items-center gap-4"> <div> <h2 class="text-xl font-bold text-gray-900"> ${entry.data.photographer.name} </h2> <div class="flex items-center gap-4 mt-2"> ${entry.data.photographer.instagram && renderTemplate`<a${addAttribute(`https://instagram.com/${entry.data.photographer.instagram}`, "href")} target="_blank" rel="noopener noreferrer" class="text-primary-600 hover:text-primary-700 flex items-center gap-1"> <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"> <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path> </svg>
@${entry.data.photographer.instagram} </a>`} ${entry.data.photographer.website && renderTemplate`<a${addAttribute(entry.data.photographer.website, "href")} target="_blank" rel="noopener noreferrer" class="text-primary-600 hover:text-primary-700">
Portfolio →
</a>`} </div> </div> </div> <div class="text-right"> <time${addAttribute(entry.data.date.toISOString(), "datetime")} class="text-gray-500"> ${format(entry.data.date, "MMMM d, yyyy")} </time> ${entry.data.location && renderTemplate`<p class="text-gray-500 mt-1">${entry.data.location}</p>`} </div> </div> <!-- Photo Description and Story --> <div class="prose prose-lg max-w-none"> ${renderComponent($$result2, "Content", Content, {})} </div> </div> </div> </div> </main> ` })}`;
}, "/Users/bakari/Downloads/dzaleka heritage archive/src/pages/photos/[...slug].astro", void 0);

const $$file$2 = "/Users/bakari/Downloads/dzaleka heritage archive/src/pages/photos/[...slug].astro";
const $$url$2 = "/photos/[...slug]";

const ____slug_$2 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$$2,
  file: $$file$2,
  getStaticPaths: getStaticPaths$2,
  url: $$url$2
}, Symbol.toStringTag, { value: 'Module' }));

const $$Astro$3 = createAstro();
const $$PageHeader = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$PageHeader;
  const { title, description } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div class="text-center max-w-3xl mx-auto mb-16"> <h1 class="text-4xl font-bold text-gray-900 sm:text-5xl mb-6"> ${title} </h1> ${description && renderTemplate`<p class="text-xl text-gray-600 leading-relaxed"> ${description} </p>`} </div>`;
}, "/Users/bakari/Downloads/dzaleka heritage archive/src/components/ui/PageHeader.astro", void 0);

const $$Astro$2 = createAstro();
async function getStaticPaths$1() {
  const newsEntries = await getCollection("news");
  return newsEntries.map((entry) => ({
    params: { slug: entry.slug },
    props: { entry }
  }));
}
const $$$1 = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$$1;
  const { entry } = Astro2.props;
  const { Content } = await entry.render();
  const formattedDate = new Date(entry.data.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
  const categoryLabels = {
    "business-spotlight": "Business Spotlight",
    "announcement": "Announcement",
    "success-story": "Success Story"
  };
  const categoryColors = {
    "business-spotlight": "bg-blue-50 text-blue-700 border-blue-200",
    "announcement": "bg-amber-50 text-amber-700 border-amber-200",
    "success-story": "bg-emerald-50 text-emerald-700 border-emerald-200"
  };
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `${entry.data.title} | Dzaleka Heritage` }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<article class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12"> <div class="mb-8"> <a href="/news" class="inline-flex items-center text-gray-600 hover:text-primary-600 mb-8 group"> <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 transition-transform group-hover:-translate-x-1" viewBox="0 0 20 20" fill="currentColor"> <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd"></path> </svg>
Back to News
</a> <div class="flex flex-wrap gap-3 mb-4"> <span${addAttribute(`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${categoryColors[entry.data.category]}`, "class")}> ${categoryLabels[entry.data.category]} </span> ${entry.data.featured && renderTemplate`<span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-50 text-yellow-700 border border-yellow-200">
Featured
</span>`} </div> ${renderComponent($$result2, "PageHeader", $$PageHeader, { "title": entry.data.title, "description": entry.data.description })} <div class="flex items-center gap-2 text-sm text-gray-600 mt-6"> <time${addAttribute(entry.data.date.toISOString(), "datetime")}>${formattedDate}</time> ${entry.data.author && renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": ($$result3) => renderTemplate` <span>•</span> <span>${entry.data.author}</span> ` })}`} </div> </div> ${entry.data.image && renderTemplate`<img${addAttribute(entry.data.image, "src")}${addAttribute(entry.data.title, "alt")} class="w-full h-96 object-cover rounded-2xl mb-12">`} <div class="prose prose-lg max-w-none"> ${renderComponent($$result2, "Content", Content, {})} </div> ${entry.data.businessName && renderTemplate`<div class="mt-12 p-8 bg-gray-50 rounded-2xl"> <h2 class="text-2xl font-bold text-gray-900 mb-6">Business Information</h2> <div class="space-y-4"> <div> <p class="text-lg"><span class="font-medium">Business:</span> ${entry.data.businessName}</p> ${entry.data.businessOwner && renderTemplate`<p class="text-lg mt-2"><span class="font-medium">Owner:</span> ${entry.data.businessOwner}</p>`} </div> ${entry.data.contactInfo && renderTemplate`<div class="pt-4 border-t space-y-3"> <h3 class="font-medium text-gray-900">Contact Information</h3> ${entry.data.contactInfo.email && renderTemplate`<a${addAttribute(`mailto:${entry.data.contactInfo.email}`, "href")} class="flex items-center text-primary-600 hover:text-primary-700"> <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"> <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path> <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path> </svg> ${entry.data.contactInfo.email} </a>`} ${entry.data.contactInfo.phone && renderTemplate`<a${addAttribute(`tel:${entry.data.contactInfo.phone}`, "href")} class="flex items-center text-primary-600 hover:text-primary-700"> <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"> <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path> </svg> ${entry.data.contactInfo.phone} </a>`} ${entry.data.contactInfo.website && renderTemplate`<a${addAttribute(entry.data.contactInfo.website, "href")} target="_blank" rel="noopener noreferrer" class="flex items-center text-primary-600 hover:text-primary-700"> <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"> <path fill-rule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zm10 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118h1.946a6.004 6.004 0 011.414 4.118zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z" clip-rule="evenodd"></path> </svg>
Visit Website
</a>`} </div>`} </div> </div>`} ${entry.data.tags && entry.data.tags.length > 0 && renderTemplate`<div class="mt-12"> <div class="flex flex-wrap gap-2"> ${entry.data.tags.map((tag) => renderTemplate`<span class="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
#${tag} </span>`)} </div> </div>`} </article> ` })}`;
}, "/Users/bakari/Downloads/dzaleka heritage archive/src/pages/news/[...slug].astro", void 0);

const $$file$1 = "/Users/bakari/Downloads/dzaleka heritage archive/src/pages/news/[...slug].astro";
const $$url$1 = "/news/[...slug]";

const ____slug_$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$$1,
  file: $$file$1,
  getStaticPaths: getStaticPaths$1,
  url: $$url$1
}, Symbol.toStringTag, { value: 'Module' }));

const $$Astro$1 = createAstro();
const $$MarkdownLayout = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$MarkdownLayout;
  const { entry } = Astro2.props;
  const { Content } = await entry.render();
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": entry.data.title }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="container mx-auto px-4 py-8"> <div class="max-w-4xl mx-auto"> ${entry.data.heroImage && renderTemplate`<div class="relative h-64 md:h-96 mb-8 rounded-2xl overflow-hidden"> <img${addAttribute(entry.data.heroImage, "src")}${addAttribute(entry.data.title, "alt")} class="w-full h-full object-cover"> <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"> <div class="absolute bottom-0 p-6 md:p-8"> <h1 class="text-3xl md:text-4xl font-bold text-white mb-2"> ${entry.data.title} </h1> <p class="text-white/90 text-lg md:text-xl max-w-2xl"> ${entry.data.description} </p> </div> </div> </div>`} ${!entry.data.heroImage && renderTemplate`<div class="mb-8"> <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-2"> ${entry.data.title} </h1> <p class="text-gray-600 text-lg md:text-xl max-w-2xl"> ${entry.data.description} </p> </div>`} <div class="bg-white rounded-2xl shadow-sm overflow-hidden"> <div class="p-6 md:p-8"> <article class="prose prose-lg max-w-none"> ${renderComponent($$result2, "Content", Content, {})} </article> </div> </div> </div> </main> ` })}`;
}, "/Users/bakari/Downloads/dzaleka heritage archive/src/layouts/MarkdownLayout.astro", void 0);

const $$Astro = createAstro();
async function getStaticPaths() {
  const pages = await getCollection("pages");
  return pages.map((entry) => ({
    params: { slug: entry.slug },
    props: { entry }
  }));
}
const $$ = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$;
  const { entry } = Astro2.props;
  return renderTemplate`${renderComponent($$result, "MarkdownLayout", $$MarkdownLayout, { "entry": entry })}`;
}, "/Users/bakari/Downloads/dzaleka heritage archive/src/pages/[...slug].astro", void 0);

const $$file = "/Users/bakari/Downloads/dzaleka heritage archive/src/pages/[...slug].astro";
const $$url = "/[...slug]";

const ____slug_ = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$,
  file: $$file,
  getStaticPaths,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

export { $$PageHeader as $, ____slug_$4 as _, ____slug_$3 as a, ____slug_$2 as b, ____slug_$1 as c, ____slug_ as d };
