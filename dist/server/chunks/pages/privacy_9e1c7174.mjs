/* empty css                            */import { f as createComponent, i as renderTemplate, j as renderComponent, m as maybeRenderHead, l as addAttribute } from '../astro_80255e7d.mjs';
import { $ as $$Layout } from './__fa3eb426.mjs';
/* empty css                             */
const $$Privacy = createComponent(($$result, $$props, $$slots) => {
  const lastUpdated = /* @__PURE__ */ new Date("2024-02-15");
  const sections = [
    {
      id: "information-collection",
      title: "Information Collection",
      content: `We collect information that you provide directly to us, including when you:
    - Create an account
    - Use our services
    - Contact us for support
    - Sign up for our newsletter`
    },
    {
      id: "information-use",
      title: "Information Use",
      content: `We use the information we collect to:
    - Provide and maintain our services
    - Improve user experience
    - Send important notifications
    - Respond to your requests`
    },
    {
      id: "information-sharing",
      title: "Information Sharing",
      content: `We do not sell or rent your personal information. We may share your information with:
    - Service providers
    - Legal authorities when required
    - Partners with your consent`
    },
    {
      id: "data-security",
      title: "Data Security",
      content: `We implement appropriate security measures to protect your information, including:
    - Encryption
    - Secure servers
    - Regular security audits
    - Access controls`
    },
    {
      id: "user-rights",
      title: "Your Rights",
      content: `You have the right to:
    - Access your data
    - Correct inaccurate data
    - Request deletion
    - Opt-out of communications`
    }
  ];
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Privacy Policy", "data-astro-cid-fb3qbcs3": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="container mx-auto px-4 py-8" data-astro-cid-fb3qbcs3> <div class="max-w-4xl mx-auto" data-astro-cid-fb3qbcs3> <!-- Header --> <div class="bg-white rounded-xl shadow-sm p-6 mb-8" data-astro-cid-fb3qbcs3> <h1 class="text-3xl font-bold text-gray-900 mb-4" data-astro-cid-fb3qbcs3>Privacy Policy</h1> <p class="text-gray-600 mb-4" data-astro-cid-fb3qbcs3>
This Privacy Policy describes how we collect, use, and handle your information.
</p> <p class="text-sm text-gray-500" data-astro-cid-fb3qbcs3>
Last updated: ${lastUpdated.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  })} </p> </div> <!-- Table of Contents --> <div class="bg-white rounded-xl shadow-sm p-6 mb-8" data-astro-cid-fb3qbcs3> <h2 class="text-xl font-bold text-gray-900 mb-4" data-astro-cid-fb3qbcs3>Contents</h2> <nav data-astro-cid-fb3qbcs3> <ul class="space-y-2" data-astro-cid-fb3qbcs3> ${sections.map((section) => renderTemplate`<li data-astro-cid-fb3qbcs3> <a${addAttribute(`#${section.id}`, "href")} class="text-primary-600 hover:text-primary-700 hover:underline" data-astro-cid-fb3qbcs3> ${section.title} </a> </li>`)} </ul> </nav> </div> <!-- Content Sections --> <div class="bg-white rounded-xl shadow-sm p-6" data-astro-cid-fb3qbcs3> <div class="prose prose-lg max-w-none" data-astro-cid-fb3qbcs3> ${sections.map((section) => renderTemplate`<section${addAttribute(section.id, "id")} class="mb-8" data-astro-cid-fb3qbcs3> <h2 class="text-2xl font-bold text-gray-900 mb-4" data-astro-cid-fb3qbcs3>${section.title}</h2> <div class="text-gray-600 whitespace-pre-line" data-astro-cid-fb3qbcs3> ${section.content} </div> </section>`)} </div> <!-- Print Button --> <div class="mt-8 text-center" data-astro-cid-fb3qbcs3> <button onclick="window.print()" class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500" data-astro-cid-fb3qbcs3> <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor" data-astro-cid-fb3qbcs3> <path fill-rule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clip-rule="evenodd" data-astro-cid-fb3qbcs3></path> </svg>
Print Policy
</button> </div> </div> </div> </main> ` })} `;
}, "/Users/bakari/Downloads/dzaleka heritage archive/src/pages/privacy.astro", void 0);

const $$file = "/Users/bakari/Downloads/dzaleka heritage archive/src/pages/privacy.astro";
const $$url = "/privacy";

export { $$Privacy as default, $$file as file, $$url as url };
