/* empty css                            */import { f as createComponent, i as renderTemplate, j as renderComponent, m as maybeRenderHead, l as addAttribute } from '../astro_80255e7d.mjs';
import { g as getCollection, a as $$Badge, $ as $$Layout } from './__fa3eb426.mjs';
import { format } from 'date-fns';

const $$PhotoGallery = createComponent(async ($$result, $$props, $$slots) => {
  const photos = await getCollection("photos");
  const sortedPhotos = photos.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
  const groupedPhotos = sortedPhotos.reduce((groups, photo) => {
    const date = photo.data.date;
    const key = format(date, "MMMM yyyy");
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(photo);
    return groups;
  }, {});
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Photo Gallery" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="container mx-auto px-4 py-8"> <div class="max-w-7xl mx-auto"> <h1 class="text-4xl font-bold text-gray-900 mb-8">Photo Gallery</h1> ${Object.entries(groupedPhotos).map(([dateGroup, photos2]) => renderTemplate`<section class="mb-12"> <h2 class="text-2xl font-semibold text-gray-800 mb-6">${dateGroup}</h2> <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3"> ${photos2.map((photo) => renderTemplate`<article class="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300"> <a${addAttribute(`/photos/${photo.slug}`, "href")} class="block"> <div class="relative aspect-w-16 aspect-h-9"> <img${addAttribute(photo.data.image, "src")}${addAttribute(photo.data.title, "alt")} class="w-full h-full object-cover"> ${photo.data.featured && renderTemplate`<div class="absolute top-4 right-4"> ${renderComponent($$result2, "Badge", $$Badge, { "variant": "blue" }, { "default": ($$result3) => renderTemplate`Featured` })} </div>`} </div> <div class="p-6"> <h3 class="text-xl font-bold text-gray-900 mb-2"> ${photo.data.title} </h3> <p class="text-gray-600 mb-4"> ${photo.data.description} </p> <div class="flex items-center justify-between"> <div class="flex items-center"> <div class="text-sm"> <p class="font-medium text-gray-900"> ${photo.data.photographer.name} </p> ${photo.data.photographer.instagram && renderTemplate`<a${addAttribute(`https://instagram.com/${photo.data.photographer.instagram}`, "href")} target="_blank" rel="noopener noreferrer" class="text-primary-600 hover:text-primary-700">
@${photo.data.photographer.instagram} </a>`} </div> </div> <time${addAttribute(photo.data.date.toISOString(), "datetime")} class="text-sm text-gray-500"> ${format(photo.data.date, "MMM d, yyyy")} </time> </div> <div class="mt-4 flex flex-wrap gap-2"> ${photo.data.tags.map((tag) => renderTemplate`${renderComponent($$result2, "Badge", $$Badge, { "variant": "green" }, { "default": ($$result3) => renderTemplate`${tag}` })}`)} </div> </div> </a> </article>`)} </div> </section>`)} </div> </main> ` })}`;
}, "/Users/bakari/Downloads/dzaleka heritage archive/src/pages/photo-gallery.astro", void 0);

const $$file = "/Users/bakari/Downloads/dzaleka heritage archive/src/pages/photo-gallery.astro";
const $$url = "/photo-gallery";

export { $$PhotoGallery as default, $$file as file, $$url as url };
