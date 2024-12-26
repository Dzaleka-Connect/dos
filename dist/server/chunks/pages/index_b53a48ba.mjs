/* empty css                            */import { k as createAstro, f as createComponent, i as renderTemplate, m as maybeRenderHead, l as addAttribute, u as unescapeHTML, j as renderComponent, F as Fragment } from '../astro_80255e7d.mjs';
import { g as getCollection, $ as $$Layout, f as calculateServiceStats, s as sortServices, h as $$ServiceStats, i as $$ServiceCard, j as $$ServicePagination } from './__fa3eb426.mjs';
import 'clsx';
import { format } from 'date-fns';
import { $ as $$DocsContent } from './_slug__bb92ba53.mjs';
import { $ as $$PageHeader } from './__a5900bd8.mjs';

const $$Astro$7 = createAstro();
const $$MobileServiceCard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$7, $$props, $$slots);
  Astro2.self = $$MobileServiceCard;
  const { provider } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div class="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-300 group"> <div class="flex items-center gap-4 mb-4"> <div class="relative w-24 h-16"> <img${addAttribute(provider.logo, "src")}${addAttribute(provider.name, "alt")} class="w-full h-full object-contain group-hover:scale-105 transition-transform"> <span class="absolute -top-2 -right-2 w-8 h-8 bg-primary-50 rounded-full flex items-center justify-center text-primary-600 group-hover:scale-110 transition-transform"> <span class="text-xl">${unescapeHTML(provider.icon)}</span> </span> </div> <h3 class="text-xl font-semibold text-gray-900">${provider.name}</h3> </div> <p class="text-gray-600 mb-4">${provider.description}</p> <ul class="space-y-2"> ${provider.services.map((service) => renderTemplate`<li class="flex items-center text-gray-700"> <svg class="w-5 h-5 text-primary-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path> </svg> ${service} </li>`)} </ul> ${provider.socialMedia && renderTemplate`<div class="mt-6 flex flex-wrap gap-3"> ${provider.socialMedia.website && renderTemplate`<a${addAttribute(provider.socialMedia.website, "href")} target="_blank" rel="noopener noreferrer" class="text-primary-600 hover:text-primary-700"> <span class="sr-only">Website</span> <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"> <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"></path> </svg> </a>`} ${provider.socialMedia.facebook && renderTemplate`<a${addAttribute(provider.socialMedia.facebook, "href")} target="_blank" rel="noopener noreferrer" class="text-primary-600 hover:text-primary-700"> <span class="sr-only">Facebook</span> <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"> <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"></path> </svg> </a>`} ${provider.socialMedia.twitter && renderTemplate`<a${addAttribute(provider.socialMedia.twitter, "href")} target="_blank" rel="noopener noreferrer" class="text-primary-600 hover:text-primary-700"> <span class="sr-only">Twitter</span> <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"> <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"></path> </svg> </a>`} ${provider.socialMedia.instagram && renderTemplate`<a${addAttribute(provider.socialMedia.instagram, "href")} target="_blank" rel="noopener noreferrer" class="text-primary-600 hover:text-primary-700"> <span class="sr-only">Instagram</span> <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"> <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.897 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.897-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"></path> </svg> </a>`} ${provider.socialMedia.linkedin && renderTemplate`<a${addAttribute(provider.socialMedia.linkedin, "href")} target="_blank" rel="noopener noreferrer" class="text-primary-600 hover:text-primary-700"> <span class="sr-only">LinkedIn</span> <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"> <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"></path> </svg> </a>`} </div>`} <a${addAttribute(provider.socialMedia?.website || provider.link, "href")} target="_blank" rel="noopener noreferrer" class="mt-4 inline-block text-primary-600 font-medium group-hover:text-primary-700">
Visit ${provider.name} →
</a> </div>`;
}, "/Users/bakari/Downloads/dzaleka heritage archive/src/components/MobileServiceCard.astro", void 0);

const $$Astro$6 = createAstro();
const $$FeaturedServices = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$6, $$props, $$slots);
  Astro2.self = $$FeaturedServices;
  const { services } = Astro2.props;
  const defaultLogo = "/images/placeholder-logo.png";
  return renderTemplate`${maybeRenderHead()}<section class="bg-gray-50 py-8"> <div class="container mx-auto px-4"> <div class="text-center mb-8"> <h2 class="text-2xl font-bold text-gray-900 mb-2">Featured Services</h2> <p class="text-gray-600">Essential services supporting our community</p> </div> <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3"> ${services.map((service) => renderTemplate`<a${addAttribute(`/services/${service.slug}`, "href")} class="group"> <article class="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all duration-300"> <div class="flex items-center p-4"> <div class="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0"> <img${addAttribute(service.data.logo || defaultLogo, "src")}${addAttribute(`${service.data.title} logo`, "alt")} class="w-full h-full object-cover"${addAttribute(`this.onerror=null; this.src='${defaultLogo}'`, "onError")}> </div> <div class="ml-4 flex-grow"> <h3 class="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors"> ${service.data.title} </h3> <p class="text-sm text-gray-600 line-clamp-2">${service.data.description}</p> </div> </div> </article> </a>`)} </div> <div class="text-center mt-6"> <a href="/services" class="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors duration-300">
View All Services
<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor"> <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"></path> </svg> </a> </div> </div> </section>`;
}, "/Users/bakari/Downloads/dzaleka heritage archive/src/components/services/FeaturedServices.astro", void 0);

const $$Index$6 = createComponent(async ($$result, $$props, $$slots) => {
  const services = await getCollection("services");
  const featuredServices = services.filter((service) => service.data.featured).sort((a, b) => (a.data.order || 0) - (b.data.order || 0)).slice(0, 6);
  const events = await getCollection("events");
  const upcomingEvents = events.filter((event) => new Date(event.data.date) >= /* @__PURE__ */ new Date()).sort((a, b) => new Date(a.data.date).getTime() - new Date(b.data.date).getTime()).slice(0, 3);
  const categories = [
    {
      title: "Humanitarian Aid",
      icon: "\u{1F91D}",
      description: "Access essential support and emergency assistance"
    },
    {
      title: "Education",
      icon: "\u{1F4DA}",
      description: "Find learning opportunities and educational resources"
    },
    {
      title: "Healthcare",
      icon: "\u2695\uFE0F",
      description: "Connect with medical services and health programs"
    },
    {
      title: "Legal Support",
      icon: "\u2696\uFE0F",
      description: "Get help with legal matters and advocacy"
    },
    {
      title: "Youth Programs",
      icon: "\u{1F31F}",
      description: "Discover opportunities for young people"
    },
    {
      title: "Community",
      icon: "\u{1F465}",
      description: "Connect with community groups and activities"
    }
  ];
  const mobileServices = [
    {
      name: "TNM Malawi",
      logo: "https://www.tnm.co.mw/_nuxt/img/tnm-logo-1.0dd9a10.svg",
      description: "Get connected with TNM's reliable mobile and data services.",
      services: ["Mobile Services", "Internet", "Mpamba"],
      link: "https://www.tnm.co.mw",
      icon: "\u{1F4F1}",
      socialMedia: {
        website: "https://www.tnm.co.mw",
        facebook: "https://www.facebook.com/tnmmw",
        twitter: "https://twitter.com/tnmmw",
        instagram: "https://www.instagram.com/tnmmw",
        linkedin: "https://www.linkedin.com/company/tnm-malawi"
      }
    },
    {
      name: "Airtel Malawi",
      logo: "https://cdn-webportal.airtelstream.net/website/malawi/assets/images/main-logo.svg",
      description: "Experience wide coverage and fast internet with Airtel.",
      services: ["Mobile Services", "4G Internet", "Airtel Money"],
      link: "https://www.airtel.mw",
      icon: "\u{1F4F6}",
      socialMedia: {
        website: "https://www.airtel.mw",
        facebook: "https://www.facebook.com/airtelmw",
        twitter: "https://twitter.com/airtelmw",
        instagram: "https://www.instagram.com/airtelmw",
        linkedin: "https://www.linkedin.com/company/airtel-malawi"
      }
    }
  ];
  const stats = [
    { number: "55,000+", label: "Refugees & Asylum Seekers" },
    { number: "12", label: "Nationalities" },
    { number: "60%", label: "Under Age 18" },
    { number: "49%", label: "Female Population" }
  ];
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Welcome to Dzaleka Online Services" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main> <!-- Hero Section --> <div class="relative bg-gradient-to-br from-primary-600 to-primary-800 text-white overflow-hidden"> <div class="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-10"></div> <div class="absolute inset-0 bg-black/20"></div> <div class="relative container mx-auto px-4 py-20 md:py-32"> <div class="max-w-4xl mx-auto text-center"> <h1 class="text-4xl md:text-6xl font-bold mb-6 animate-fade-in leading-tight">
Connecting Dzaleka Community with Essential Services
</h1> <p class="text-xl md:text-2xl mb-12 text-white/90 animate-slide-up leading-relaxed">
Find and connect with organizations providing humanitarian aid, education, 
            healthcare, and more in Dzaleka Refugee Camp.
</p> <div class="flex flex-col md:flex-row justify-center items-center gap-6 animate-fade-in"> <a href="/services" class="w-full md:w-auto px-8 py-4 bg-white text-primary-600 rounded-xl font-semibold hover:bg-primary-50 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 group"> <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path> </svg> <span>Services Directory</span> </a> <a href="/events" class="w-full md:w-auto px-8 py-4 bg-primary-700 text-white rounded-xl font-semibold hover:bg-primary-600 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 group border border-white/20"> <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path> </svg> <span>Cultural Events</span> </a> </div> </div> </div> </div> <!-- Stats Section --> <div class="bg-white py-12 -mt-8 relative z-10"> <div class="container mx-auto px-4"> <div class="bg-white rounded-2xl shadow-xl p-8 grid grid-cols-2 md:grid-cols-4 gap-8"> ${stats.map((stat) => renderTemplate`<div class="text-center"> <div class="text-3xl md:text-4xl font-bold text-primary-600 mb-2">${stat.number}</div> <div class="text-gray-600">${stat.label}</div> </div>`)} </div> </div> </div> <!-- Featured Services --> ${renderComponent($$result2, "FeaturedServices", $$FeaturedServices, { "services": featuredServices })} <!-- Categories Section --> <div class="container mx-auto px-4 py-16"> <h2 class="text-3xl font-bold text-gray-900 mb-3 text-center">Our Services</h2> <p class="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
Explore our comprehensive range of services designed to support and empower the Dzaleka community
</p> <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3"> ${categories.map((category) => renderTemplate`<a${addAttribute(`/services?category=${category.title}`, "href")} class="group bg-white rounded-xl shadow-sm p-8 hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-primary-100"> <div class="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300"> ${category.icon} </div> <h3 class="text-xl font-semibold mb-2 text-gray-900 group-hover:text-primary-600 transition-colors"> ${category.title} </h3> <p class="text-gray-600">${category.description}</p> </a>`)} </div> </div> <!-- Upcoming Events Section --> ${upcomingEvents.length > 0 && renderTemplate`<div class="bg-gray-50 py-16"> <div class="container mx-auto px-4"> <h2 class="text-3xl font-bold text-gray-900 mb-3 text-center">Upcoming Events</h2> <p class="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
Join us at these upcoming community events and cultural celebrations
</p> <div class="grid gap-8 md:grid-cols-3"> ${upcomingEvents.map((event) => renderTemplate`<a${addAttribute(`/events/${event.slug}`, "href")} class="group bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300"> <div class="aspect-w-16 aspect-h-9"> <img${addAttribute(event.data.image, "src")}${addAttribute(event.data.title, "alt")} class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"> </div> <div class="p-6"> <div class="text-sm text-primary-600 font-medium mb-2"> ${format(new Date(event.data.date), "MMMM d, yyyy")} </div> <h3 class="text-xl font-semibold mb-2 text-gray-900 group-hover:text-primary-600 transition-colors"> ${event.data.title} </h3> <p class="text-gray-600 line-clamp-2">${event.data.description}</p> </div> </a>`)} </div> <div class="text-center mt-12"> <a href="/events" class="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors">
View All Events
<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor"> <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"></path> </svg> </a> </div> </div> </div>`} <!-- Mobile Network Services --> <div class="container mx-auto px-4 py-16"> <h2 class="text-3xl font-bold text-gray-900 mb-3 text-center">
Mobile Network Services
</h2> <p class="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
Stay connected with reliable mobile and internet services from our trusted providers
</p> <div class="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto"> ${mobileServices.map((provider) => renderTemplate`${renderComponent($$result2, "MobileServiceCard", $$MobileServiceCard, { "provider": provider })}`)} </div> </div> <!-- Community Section --> <div class="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-16"> <div class="container mx-auto px-4"> <div class="max-w-3xl mx-auto text-center"> <h2 class="text-3xl md:text-4xl font-bold mb-6">Join Our Community</h2> <p class="text-xl text-white/90 mb-12 leading-relaxed">
Connect with other community members, share experiences, and get support
            through our community forum.
</p> <a href="/forum" class="inline-flex items-center px-8 py-4 bg-white text-primary-600 rounded-xl hover:bg-primary-50 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold group"> <span>Visit Community Forum</span> <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor"> <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"></path> </svg> </a> </div> </div> </div> </main> ` })}`;
}, "/Users/bakari/Downloads/dzaleka heritage archive/src/pages/index.astro", void 0);

const $$file$6 = "/Users/bakari/Downloads/dzaleka heritage archive/src/pages/index.astro";
const $$url$6 = "";

const index$6 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index$6,
  file: $$file$6,
  url: $$url$6
}, Symbol.toStringTag, { value: 'Module' }));

const $$Astro$5 = createAstro();
const $$Index$5 = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$5, $$props, $$slots);
  Astro2.self = $$Index$5;
  await getCollection("resources");
  const searchQuery = Astro2.url.searchParams.get("search") || "";
  Number(Astro2.url.searchParams.get("page")) || 1;
  const redirectUrl = `/resources/1${searchQuery ? `?search=${searchQuery}` : ""}`;
  return Astro2.redirect(redirectUrl);
}, "/Users/bakari/Downloads/dzaleka heritage archive/src/pages/resources/index.astro", void 0);

const $$file$5 = "/Users/bakari/Downloads/dzaleka heritage archive/src/pages/resources/index.astro";
const $$url$5 = "/resources";

const index$5 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index$5,
  file: $$file$5,
  url: $$url$5
}, Symbol.toStringTag, { value: 'Module' }));

const $$Astro$4 = createAstro();
const $$Index$4 = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$4, $$props, $$slots);
  Astro2.self = $$Index$4;
  const allServices = await getCollection("services");
  console.log("All services:", allServices.length);
  const serviceStats = calculateServiceStats(allServices);
  console.log("Service stats:", serviceStats);
  const sortBy = Astro2.url.searchParams.get("sort") || "featured";
  const verifiedOnly = Astro2.url.searchParams.get("verified") === "true";
  let filteredServices = allServices;
  if (verifiedOnly) {
    filteredServices = filteredServices.filter((service) => service.data.verified);
  }
  const sortedServices = sortServices(filteredServices, sortBy);
  const itemsPerPage = 6;
  const totalItems = sortedServices.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const currentPage = +(Astro2.url.searchParams.get("page") || "1");
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedServices = sortedServices.slice(startIndex, endIndex);
  console.log("Paginated services:", paginatedServices.map((service) => ({
    title: service.data.title,
    socialMedia: service.data.socialMedia,
    hasWebsite: !!service.data.socialMedia?.website,
    websiteUrl: service.data.socialMedia?.website
  })));
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Service Directory" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main> <!-- Hero Section --> <div class="bg-gradient-to-r from-primary-600 to-primary-800 px-4 py-16"> <div class="max-w-3xl mx-auto text-center"> <h1 class="text-4xl font-bold text-white mb-4">Discover Local Services</h1> <p class="text-lg text-white/90 mb-8">
Find and connect with organizations and services in Dzaleka Refugee Camp
</p> </div> </div> <!-- Service Stats --> <div class="max-w-7xl mx-auto px-4 -mt-8"> ${renderComponent($$result2, "ServiceStats", $$ServiceStats, { "stats": serviceStats })} </div> <!-- Main Content --> <div class="max-w-7xl mx-auto px-4 py-12"> <div class="flex justify-between items-center mb-8"> <div> <p class="text-gray-600">
Showing ${startIndex + 1}-${endIndex} of ${totalItems} services
</p> </div> <!-- Filters --> <div class="flex items-center gap-4"> <label class="flex items-center"> <input type="checkbox"${addAttribute(verifiedOnly, "checked")} class="form-checkbox h-5 w-5 text-primary-600 rounded" onchange="window.location.href = new URL(window.location.href).searchParams.set('verified', this.checked).toString()"> <span class="ml-2 text-gray-700">Verified Only</span> </label> <select class="form-select rounded-lg border-gray-300" onchange="window.location.href = new URL(window.location.href).searchParams.set('sort', this.value).toString()"> <option value="featured"${addAttribute(sortBy === "featured", "selected")}>Featured First</option> <option value="name"${addAttribute(sortBy === "name", "selected")}>Name (A-Z)</option> <option value="newest"${addAttribute(sortBy === "newest", "selected")}>Recently Updated</option> </select> </div> </div> <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3"> ${paginatedServices.map((service) => {
    const socialMedia = service.data.socialMedia ? {
      ...service.data.socialMedia.facebook && { facebook: service.data.socialMedia.facebook },
      ...service.data.socialMedia.twitter && { twitter: service.data.socialMedia.twitter },
      ...service.data.socialMedia.instagram && { instagram: service.data.socialMedia.instagram },
      ...service.data.socialMedia.linkedin && { linkedin: service.data.socialMedia.linkedin },
      ...service.data.socialMedia.website && { website: service.data.socialMedia.website }
    } : void 0;
    return renderTemplate`${renderComponent($$result2, "ServiceCard", $$ServiceCard, { "title": service.data.title, "description": service.data.description, "category": service.data.category, "featured": service.data.featured, "verified": service.data.verified, "href": `/services/${service.slug}`, "email": service.data.contact?.email, "phone": service.data.contact?.phone, "address": service.data.location?.address, "logo": service.data.logo, "socialMedia": socialMedia })}`;
  })} </div> <!-- Pagination --> ${totalPages > 1 && renderTemplate`<div class="mt-12"> ${renderComponent($$result2, "ServicePagination", $$ServicePagination, { "currentPage": currentPage, "totalPages": totalPages, "baseUrl": `/services?${new URLSearchParams({
    ...verifiedOnly && { verified: "true" },
    ...sortBy !== "featured" && { sort: sortBy }
  }).toString()}` })} </div>`} </div> </main> ` })}`;
}, "/Users/bakari/Downloads/dzaleka heritage archive/src/pages/services/index.astro", void 0);

const $$file$4 = "/Users/bakari/Downloads/dzaleka heritage archive/src/pages/services/index.astro";
const $$url$4 = "/services";

const index$4 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index$4,
  file: $$file$4,
  url: $$url$4
}, Symbol.toStringTag, { value: 'Module' }));

const $$Astro$3 = createAstro();
const $$Index$3 = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$Index$3;
  const allEvents = await getCollection("events");
  const searchQuery = Astro2.url.searchParams.get("search")?.trim() || "";
  const upcomingPage = parseInt(Astro2.url.searchParams.get("upcomingPage") || "1");
  const pastPage = parseInt(Astro2.url.searchParams.get("pastPage") || "1");
  const itemsPerPage = 4;
  let filteredEvents = allEvents;
  if (searchQuery) {
    filteredEvents = allEvents.filter(
      (event) => event.data.title.toLowerCase().includes(searchQuery.toLowerCase()) || event.data.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }
  function isUpcoming(date) {
    const today = /* @__PURE__ */ new Date();
    today.setHours(0, 0, 0, 0);
    const eventDate = new Date(date);
    eventDate.setHours(0, 0, 0, 0);
    return eventDate >= today;
  }
  function paginateEvents(events, page, perPage) {
    const totalPages = Math.max(1, Math.ceil(events.length / perPage));
    const currentPage = Math.min(Math.max(1, page), totalPages);
    const startIndex = (currentPage - 1) * perPage;
    const endIndex = Math.min(startIndex + perPage, events.length);
    return {
      events: events.slice(startIndex, endIndex),
      pagination: {
        currentPage,
        totalPages,
        totalItems: events.length,
        startIndex,
        endIndex
      }
    };
  }
  const allUpcomingEvents = filteredEvents.filter((event) => isUpcoming(event.data.date)).map((event) => ({
    ...event,
    data: { ...event.data, status: "upcoming" }
  })).sort((a, b) => new Date(a.data.date).getTime() - new Date(b.data.date).getTime());
  const allPastEvents = filteredEvents.filter((event) => !isUpcoming(event.data.date)).map((event) => ({
    ...event,
    data: { ...event.data, status: "past" }
  })).sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime());
  paginateEvents(allUpcomingEvents, upcomingPage, itemsPerPage);
  paginateEvents(allPastEvents, pastPage, itemsPerPage);
  const searchParams = Astro2.url.searchParams.toString();
  return Astro2.redirect(`/events/upcoming/1${searchParams ? "?" + searchParams : ""}`);
}, "/Users/bakari/Downloads/dzaleka heritage archive/src/pages/events/index.astro", void 0);

const $$file$3 = "/Users/bakari/Downloads/dzaleka heritage archive/src/pages/events/index.astro";
const $$url$3 = "/events";

const index$3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index$3,
  file: $$file$3,
  url: $$url$3
}, Symbol.toStringTag, { value: 'Module' }));

const $$Astro$2 = createAstro();
const $$Index$2 = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$Index$2;
  Astro2.url;
  const photos = await getCollection("photos");
  const photosByYear = photos.reduce((acc, photo) => {
    const year = new Date(photo.data.date).getFullYear();
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(photo);
    return acc;
  }, {});
  const years = Object.keys(photosByYear).map(Number).sort((a, b) => b - a);
  const previewPhotosByYear = years.reduce((acc, year) => {
    const yearPhotos = photosByYear[year].sort(
      (a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime()
    );
    acc[year] = {
      photos: yearPhotos.slice(0, 3),
      totalPhotos: yearPhotos.length
    };
    return acc;
  }, {});
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Photo Gallery | Dzaleka Heritage" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="container mx-auto px-4 py-12"> <div class="max-w-4xl mx-auto"> <h1 class="text-4xl font-bold text-gray-900 mb-8 text-center">Photo Gallery</h1> <p class="text-xl text-gray-600 text-center mb-12 max-w-2xl mx-auto">
Explore our collection of photographs documenting life, culture, and stories from Dzaleka Refugee Camp
</p> </div> ${years.map((year) => {
    const { photos: photos2, totalPhotos } = previewPhotosByYear[year];
    return renderTemplate`<div class="mb-16"${addAttribute(year.toString(), "id")}> <div class="flex items-center justify-between mb-6"> <h2 class="text-3xl font-bold text-gray-800 flex items-center gap-4"> <span>${year}</span> <span class="text-lg text-gray-500 font-normal">(${totalPhotos} photos)</span> </h2> </div> <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8"> ${photos2.map((photo) => renderTemplate`<a${addAttribute(`/photos/${photo.slug}`, "href")} class="group block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"> <div class="aspect-w-4 aspect-h-3 bg-gray-100"> <img${addAttribute(photo.data.image, "src")}${addAttribute(photo.data.title, "alt")} class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"> </div> <div class="p-4"> <h3 class="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors"> ${photo.data.title} </h3> <div class="mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-600"> <span>${format(new Date(photo.data.date), "MMMM d, yyyy")}</span> ${photo.data.photographer && renderTemplate`<span class="flex items-center gap-1"> <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path> </svg> ${typeof photo.data.photographer === "string" ? photo.data.photographer : photo.data.photographer.name} </span>`} </div> <p class="mt-2 text-sm text-gray-600 line-clamp-2"> ${photo.data.description} </p> ${photo.data.tags && renderTemplate`<div class="mt-3 flex flex-wrap gap-2"> ${photo.data.tags.slice(0, 3).map((tag) => renderTemplate`<span class="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"> ${tag} </span>`)} </div>`} </div> </a>`)} </div> ${totalPhotos > 3 && renderTemplate`<div class="text-center"> <a${addAttribute(`/photos/${year}`, "href")} class="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors group">
View All ${year} Photos
<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor"> <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"></path> </svg> </a> </div>`} </div>`;
  })} </main> ` })}`;
}, "/Users/bakari/Downloads/dzaleka heritage archive/src/pages/photos/index.astro", void 0);

const $$file$2 = "/Users/bakari/Downloads/dzaleka heritage archive/src/pages/photos/index.astro";
const $$url$2 = "/photos";

const index$2 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index$2,
  file: $$file$2,
  url: $$url$2
}, Symbol.toStringTag, { value: 'Module' }));

const $$Astro$1 = createAstro();
const $$Index$1 = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Index$1;
  const docs = await getCollection("docs");
  const currentDoc = docs.find((doc) => doc.slug === "getting-started");
  if (!currentDoc) {
    return Astro2.redirect("/404");
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `${currentDoc.data.title} - Documentation` }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="bg-gray-50"> <!-- Documentation Header --> <div class="bg-gradient-to-r from-primary-600 to-primary-800"> <div class="max-w-7xl mx-auto py-16 px-4 sm:py-20 sm:px-6 lg:px-8"> <div class="text-center"> <h1 class="text-4xl font-extrabold text-white sm:text-5xl sm:tracking-tight lg:text-6xl">
Documentation
</h1> <p class="max-w-3xl mt-5 mx-auto text-xl text-primary-100">
Learn how to use the Dzaleka Online Service Platform to find services, participate in events, and access community resources.
</p> </div> </div> </div> <!-- Documentation Content --> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"> <div class="lg:grid lg:grid-cols-12 lg:gap-8"> <!-- Sidebar --> <div class="hidden lg:block lg:col-span-3"> <nav class="sticky top-6 space-y-6" aria-label="Sidebar"> <div class="bg-white shadow-sm rounded-lg border border-gray-200 p-6"> <div class="space-y-6"> <div> <h3 class="font-semibold text-gray-900 mb-3">Getting Started</h3> <ul class="space-y-2"> <li> <a href="/docs/getting-started" class="block text-sm text-primary-600 font-medium hover:text-primary-700">
Getting Started Guide
</a> </li> </ul> </div> <div> <h3 class="font-semibold text-gray-900 mb-3">Platform Guides</h3> <ul class="space-y-2"> <li> <a href="/docs/services-guide" class="block text-sm text-gray-600 hover:text-gray-900">
Services Guide
</a> </li> <li> <a href="/docs/services-directory" class="block text-sm text-gray-600 hover:text-gray-900">
Services Directory
</a> </li> <li> <a href="/docs/events-guide" class="block text-sm text-gray-600 hover:text-gray-900">
Events Guide
</a> </li> <li> <a href="/docs/resources-guide" class="block text-sm text-gray-600 hover:text-gray-900">
Resources Guide
</a> </li> </ul> </div> <div> <h3 class="font-semibold text-gray-900 mb-3">Archive</h3> <ul class="space-y-2"> <li> <a href="/docs/photo-archive" class="block text-sm text-gray-600 hover:text-gray-900">
Photo Archive
</a> </li> </ul> </div> </div> </div> </nav> </div> <!-- Main Content --> <main class="lg:col-span-9"> <div class="space-y-16"> ${renderComponent($$result2, "DocsContent", $$DocsContent, { "content": currentDoc })} <!-- Quick Links --> <div class="mt-12"> <h2 class="text-2xl font-bold text-gray-900 mb-6">Quick Links</h2> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> <a href="/docs/services-directory" class="block p-6 bg-white shadow-sm rounded-lg border border-gray-200 hover:shadow-md transition-shadow"> <div class="flex items-center gap-4"> <div class="flex-shrink-0"> <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path> </svg> </div> <div> <h3 class="text-lg font-medium text-gray-900">Services</h3> <p class="mt-1 text-sm text-gray-500">Find and access community services</p> </div> </div> </a> <a href="/docs/events-guide" class="block p-6 bg-white shadow-sm rounded-lg border border-gray-200 hover:shadow-md transition-shadow"> <div class="flex items-center gap-4"> <div class="flex-shrink-0"> <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path> </svg> </div> <div> <h3 class="text-lg font-medium text-gray-900">Events</h3> <p class="mt-1 text-sm text-gray-500">Discover community events and activities</p> </div> </div> </a> <a href="/docs/resources-guide" class="block p-6 bg-white shadow-sm rounded-lg border border-gray-200 hover:shadow-md transition-shadow"> <div class="flex items-center gap-4"> <div class="flex-shrink-0"> <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path> </svg> </div> <div> <h3 class="text-lg font-medium text-gray-900">Resources</h3> <p class="mt-1 text-sm text-gray-500">Access community resources and materials</p> </div> </div> </a> </div> </div> <!-- Help Section --> <div class="bg-primary-50 rounded-lg p-8"> <div class="flex items-start gap-6"> <div class="flex-shrink-0"> <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path> </svg> </div> <div> <h3 class="text-lg font-medium text-gray-900">Need Help?</h3> <p class="mt-2 text-sm text-gray-600">Can't find what you're looking for? Our support team is here to help.</p> <div class="mt-4"> <a href="/support" class="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700">
Contact Support
<svg xmlns="http://www.w3.org/2000/svg" class="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path> </svg> </a> </div> </div> </div> </div> </div> </main> </div> </div> </div> ` })}`;
}, "/Users/bakari/Downloads/dzaleka heritage archive/src/pages/docs/index.astro", void 0);

const $$file$1 = "/Users/bakari/Downloads/dzaleka heritage archive/src/pages/docs/index.astro";
const $$url$1 = "/docs";

const index$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index$1,
  file: $$file$1,
  url: $$url$1
}, Symbol.toStringTag, { value: 'Module' }));

const $$Astro = createAstro();
const $$NewsCard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$NewsCard;
  const { news, featured = false, large = false } = Astro2.props;
  const { data, slug } = news;
  const formattedDate = new Date(data.date).toLocaleDateString("en-US", {
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
  return renderTemplate`${maybeRenderHead()}<a${addAttribute(`/news/${slug}`, "href")}${addAttribute(`group relative flex ${large ? "flex-col lg:flex-row" : "flex-col"} bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden ${featured ? "ring-1 ring-primary-200" : ""}`, "class")}> <div${addAttribute(`relative ${large ? "lg:w-2/3" : "w-full"}`, "class")}> ${data.image ? renderTemplate`<img${addAttribute(data.image, "src")}${addAttribute(data.title, "alt")}${addAttribute(`w-full object-cover ${large ? "h-72 lg:h-full" : "h-48"}`, "class")}>` : renderTemplate`<div${addAttribute(`w-full flex items-center justify-center bg-gray-100 ${large ? "h-72 lg:h-full" : "h-48"}`, "class")}> <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2"></path> </svg> </div>`} <div class="absolute top-4 left-4 flex flex-wrap gap-2 max-w-[calc(100%-2rem)]"> <span${addAttribute(`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border backdrop-blur-sm ${categoryColors[data.category]}`, "class")}> ${categoryLabels[data.category]} </span> ${featured && renderTemplate`<span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-50 text-yellow-700 border border-yellow-200 backdrop-blur-sm">
Featured
</span>`} </div> </div> <div${addAttribute(`flex flex-col ${large ? "lg:w-1/3" : ""} p-6 ${large ? "lg:p-8" : ""}`, "class")}> <div class="flex items-center gap-2 text-sm text-gray-600 mb-3"> <time${addAttribute(data.date.toISOString(), "datetime")}>${formattedDate}</time> ${data.author && renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate` <span>•</span> <span>${data.author}</span> ` })}`} </div> <h3${addAttribute(`${large ? "text-2xl lg:text-3xl" : "text-xl"} font-bold text-gray-900 group-hover:text-primary-600 transition-colors mb-3`, "class")}> ${data.title} </h3> <p${addAttribute(`text-gray-600 ${large ? "text-lg" : ""} mb-6 line-clamp-3`, "class")}> ${data.description} </p> ${data.businessName && renderTemplate`<div class="mt-auto border-t pt-4"> <div class="text-sm text-gray-600"> <p><span class="font-medium">Business:</span> ${data.businessName}</p> ${data.businessOwner && renderTemplate`<p><span class="font-medium">Owner:</span> ${data.businessOwner}</p>`} </div> </div>`} <div class="mt-6 flex items-center text-primary-600 font-medium group-hover:text-primary-700">
Read more
<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor"> <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"></path> </svg> </div> </div> </a>`;
}, "/Users/bakari/Downloads/dzaleka heritage archive/src/components/NewsCard.astro", void 0);

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const allNews = await getCollection("news");
  const sortedNews = allNews.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
  const businessSpotlights = sortedNews.filter((item) => item.data.category === "business-spotlight");
  const announcements = sortedNews.filter((item) => item.data.category === "announcement");
  const successStories = sortedNews.filter((item) => item.data.category === "success-story");
  const featuredNews = sortedNews.filter((item) => item.data.featured);
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "News & Updates | Dzaleka Heritage" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"> ${renderComponent($$result2, "PageHeader", $$PageHeader, { "title": "News & Updates", "description": "Stay informed about the latest happenings in our community, from business success stories to important announcements." })} ${featuredNews.length > 0 && renderTemplate`<section class="mb-16"> <div class="grid gap-8 lg:grid-cols-2"> ${featuredNews.slice(0, 1).map((news) => renderTemplate`<div class="lg:col-span-2"> ${renderComponent($$result2, "NewsCard", $$NewsCard, { "news": news, "featured": true, "large": true })} </div>`)} ${featuredNews.slice(1, 3).map((news) => renderTemplate`${renderComponent($$result2, "NewsCard", $$NewsCard, { "news": news, "featured": true })}`)} </div> </section>`} <div class="space-y-16"> ${businessSpotlights.length > 0 && renderTemplate`<section> <div class="flex items-center justify-between mb-8"> <div> <h2 class="text-2xl font-bold text-gray-900">Business Spotlights</h2> <p class="mt-1 text-gray-600">Discover thriving businesses in our community</p> </div> <a href="#" class="text-primary-600 hover:text-primary-700 font-medium">
View all
<span class="sr-only">business spotlights</span> </a> </div> <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3"> ${businessSpotlights.slice(0, 3).map((news) => renderTemplate`${renderComponent($$result2, "NewsCard", $$NewsCard, { "news": news })}`)} </div> </section>`} ${announcements.length > 0 && renderTemplate`<section> <div class="flex items-center justify-between mb-8"> <div> <h2 class="text-2xl font-bold text-gray-900">Community Announcements</h2> <p class="mt-1 text-gray-600">Important updates from our community</p> </div> <a href="#" class="text-primary-600 hover:text-primary-700 font-medium">
View all
<span class="sr-only">announcements</span> </a> </div> <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3"> ${announcements.slice(0, 3).map((news) => renderTemplate`${renderComponent($$result2, "NewsCard", $$NewsCard, { "news": news })}`)} </div> </section>`} ${successStories.length > 0 && renderTemplate`<section> <div class="flex items-center justify-between mb-8"> <div> <h2 class="text-2xl font-bold text-gray-900">Success Stories</h2> <p class="mt-1 text-gray-600">Celebrating achievements in our community</p> </div> <a href="#" class="text-primary-600 hover:text-primary-700 font-medium">
View all
<span class="sr-only">success stories</span> </a> </div> <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3"> ${successStories.slice(0, 3).map((news) => renderTemplate`${renderComponent($$result2, "NewsCard", $$NewsCard, { "news": news })}`)} </div> </section>`} </div> </div> ` })}`;
}, "/Users/bakari/Downloads/dzaleka heritage archive/src/pages/news/index.astro", void 0);

const $$file = "/Users/bakari/Downloads/dzaleka heritage archive/src/pages/news/index.astro";
const $$url = "/news";

const index = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

export { index$5 as a, index$4 as b, index$3 as c, index$2 as d, index$1 as e, index as f, index$6 as i };
