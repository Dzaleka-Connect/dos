/* empty css                            */import { k as createAstro, f as createComponent, i as renderTemplate, m as maybeRenderHead, j as renderComponent, u as unescapeHTML, F as Fragment } from '../astro_80255e7d.mjs';
import 'clsx';
import { $ as $$Layout } from './__fa3eb426.mjs';

const $$Astro = createAstro();
const $$AboutHero = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$AboutHero;
  const { title, description } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div class="relative h-[400px] rounded-2xl overflow-hidden mb-12 bg-gradient-to-br from-primary-600 to-primary-800"> <div class="absolute inset-0 bg-black/40"></div> <div class="absolute bottom-0 p-8"> <h1 class="text-4xl font-bold text-white mb-4">${title}</h1> <p class="text-xl text-white/90 max-w-2xl"> ${description} </p> </div> </div>`;
}, "/Users/bakari/Downloads/dzaleka heritage archive/src/components/about/AboutHero.astro", void 0);

const $$MissionStatement = createComponent(($$result, $$props, $$slots) => {
  const mission = `Dzaleka Online Service Platform aims to bridge the digital divide by connecting refugees with essential services, opportunities, and resources within the Dzaleka community and beyond.`;
  const vision = `To create a thriving, connected community where every refugee has easy access to the services and support they need to build a better future.`;
  const values = [
    {
      title: "Community First",
      description: "We prioritize the needs of our community members, ensuring our platform serves everyone effectively.",
      icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-4 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>`
    },
    {
      title: "Digital Inclusion",
      description: "Making digital services accessible to all members of the Dzaleka community.",
      icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-4 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
    </svg>`
    },
    {
      title: "Collaboration",
      description: "Working together with service providers and community organizations to maximize impact.",
      icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-4 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>`
    }
  ];
  return renderTemplate`${maybeRenderHead()}<section class="mb-16"> <div class="max-w-3xl mx-auto text-center mb-16"> <h2 class="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2> <p class="text-xl text-gray-600 leading-relaxed"> ${mission} </p> </div> <div class="max-w-3xl mx-auto text-center mb-16"> <h2 class="text-3xl font-bold text-gray-900 mb-6">Our Vision</h2> <p class="text-xl text-gray-600 leading-relaxed"> ${vision} </p> </div> <div class="max-w-4xl mx-auto"> <h2 class="text-3xl font-bold text-gray-900 mb-12 text-center">Our Values</h2> <div class="grid md:grid-cols-3 gap-8"> ${values.map((value) => renderTemplate`<div class="text-center p-6 rounded-lg hover:bg-gray-50 transition-colors duration-200"> ${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate`${unescapeHTML(value.icon)}` })} <h3 class="text-xl font-semibold text-gray-900 mb-3">${value.title}</h3> <p class="text-gray-600">${value.description}</p> </div>`)} </div> </div> </section>`;
}, "/Users/bakari/Downloads/dzaleka heritage archive/src/components/about/MissionStatement.astro", void 0);

const $$CampInfo = createComponent(($$result, $$props, $$slots) => {
  const campInfo = {
    location: {
      title: "Location and Establishment",
      content: "Dzaleka Refugee Camp is located in Dowa district, about 50km north of Lilongwe, Malawi's capital city. It was established in 1994 in response to a surge of refugees fleeing conflicts in the Great Lakes region of Africa."
    },
    population: {
      title: "Population",
      content: "Initially designed to host around 10,000 refugees, Dzaleka has grown to accommodate over 50,000 people as of 2024. The camp hosts refugees primarily from the Democratic Republic of Congo, Burundi, and Rwanda."
    },
    features: {
      title: "Life in Dzaleka",
      content: "Despite challenges such as overcrowding and limited resources, Dzaleka has evolved into a vibrant community.",
      list: [
        "Schools and vocational training centers",
        "Health facilities",
        "Markets and small businesses",
        "Community centers and places of worship",
        "Arts and cultural initiatives"
      ]
    },
    challenges: {
      title: "Challenges and Opportunities",
      content: "Residents of Dzaleka face significant challenges, including:",
      list: [
        "Limited freedom of movement",
        "Restricted access to formal employment",
        "Overcrowding and strain on resources",
        "Limited opportunities for higher education"
      ],
      conclusion: "Despite these challenges, many refugees have shown remarkable resilience, creating businesses, pursuing education, and contributing to the cultural richness of Malawi."
    }
  };
  return renderTemplate`${maybeRenderHead()}<section class="space-y-12"> ${Object.values(campInfo).map((section) => renderTemplate`<div class="bg-white p-8 rounded-xl shadow-sm"> <h2 class="text-2xl font-bold text-gray-900 mb-4">${section.title}</h2> <p class="text-gray-600 mb-4">${section.content}</p> ${section.list && renderTemplate`<ul class="list-disc list-inside space-y-2 text-gray-600 ml-4"> ${section.list.map((item) => renderTemplate`<li>${item}</li>`)} </ul>`} ${section.conclusion && renderTemplate`<p class="text-gray-600 mt-4">${section.conclusion}</p>`} </div>`)} </section>`;
}, "/Users/bakari/Downloads/dzaleka heritage archive/src/components/about/CampInfo.astro", void 0);

const $$About = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "About Us" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="container mx-auto px-4 py-8"> ${renderComponent($$result2, "AboutHero", $$AboutHero, { "title": "About Us", "description": "Empowering the Dzaleka community through digital connectivity" })} ${renderComponent($$result2, "MissionStatement", $$MissionStatement, {})} ${renderComponent($$result2, "CampInfo", $$CampInfo, {})} </main> ` })}`;
}, "/Users/bakari/Downloads/dzaleka heritage archive/src/pages/about.astro", void 0);

const $$file = "/Users/bakari/Downloads/dzaleka heritage archive/src/pages/about.astro";
const $$url = "/about";

export { $$About as default, $$file as file, $$url as url };
