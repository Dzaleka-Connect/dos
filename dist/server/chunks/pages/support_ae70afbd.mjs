/* empty css                            */import { f as createComponent, i as renderTemplate, m as maybeRenderHead, l as addAttribute, j as renderComponent } from '../astro_80255e7d.mjs';
import 'clsx';
import { $ as $$Layout } from './__fa3eb426.mjs';

const $$Faq = createComponent(($$result, $$props, $$slots) => {
  const faqs = [
    {
      question: "What services are available at Dzaleka Digital Heritage?",
      answer: "We offer a range of digital services including resource access, cultural preservation, educational materials, and community support programs."
    },
    {
      question: "How can I access the resources?",
      answer: "Resources are available through our online platform. Simply browse the Resource Hub and click on the resource you'd like to access."
    },
    {
      question: "Is there a cost associated with using the services?",
      answer: "Most of our resources are free to access. Some specialized programs or materials may have associated costs, which will be clearly indicated."
    },
    {
      question: "Can I contribute to the platform?",
      answer: "Yes! We welcome contributions from community members. Please contact us to learn more about sharing your knowledge or resources."
    },
    {
      question: "How often are resources updated?",
      answer: "We regularly update our resources to ensure they remain relevant and useful. Check the 'last updated' date on each resource for specific information."
    }
  ];
  return renderTemplate`${maybeRenderHead()}<div class="space-y-4"> ${faqs.map((faq, index) => renderTemplate`<div class="border rounded-lg"> <button class="w-full px-6 py-4 text-left focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg"${addAttribute(`faq-button-${index}`, "id")} aria-expanded="false"${addAttribute(`faq-answer-${index}`, "aria-controls")}> <div class="flex items-center justify-between"> <span class="font-medium text-gray-900">${faq.question}</span> <svg class="w-5 h-5 text-gray-500 transform transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path> </svg> </div> </button> <div${addAttribute(`faq-answer-${index}`, "id")} class="hidden px-6 pb-4 text-gray-600" role="region"${addAttribute(`faq-button-${index}`, "aria-labelledby")}> ${faq.answer} </div> </div>`)} </div> `;
}, "/Users/bakari/Downloads/dzaleka heritage archive/src/components/Faq.astro", void 0);

const $$Support = createComponent(($$result, $$props, $$slots) => {
  const supportCategories = [
    {
      title: "General Support",
      icon: "\u{1F91D}",
      description: "Basic help and information about our services"
    },
    {
      title: "Technical Support",
      icon: "\u{1F527}",
      description: "Help with technical issues and platform access"
    },
    {
      title: "Resource Access",
      icon: "\u{1F4DA}",
      description: "Assistance with accessing and using resources"
    },
    {
      title: "Community Support",
      icon: "\u{1F465}",
      description: "Help with community engagement and participation"
    }
  ];
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Support" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="container mx-auto px-4 py-8"> <div class="max-w-5xl mx-auto"> <!-- Support Header --> <div class="text-center mb-12"> <h1 class="text-4xl font-bold text-gray-900 mb-4">Support Center</h1> <p class="text-xl text-gray-600">
Find help and answers to your questions
</p> </div> <!-- Support Categories --> <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12"> ${supportCategories.map((category) => renderTemplate`<div class="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"> <div class="text-3xl mb-4">${category.icon}</div> <h2 class="text-xl font-bold text-gray-900 mb-2">${category.title}</h2> <p class="text-gray-600">${category.description}</p> </div>`)} </div> <!-- FAQ Section --> <section class="mb-12"> <h2 class="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2> ${renderComponent($$result2, "Faq", $$Faq, {})} </section> <!-- Support Form --> <section class="bg-white rounded-xl shadow-sm p-6"> <h2 class="text-2xl font-bold text-gray-900 mb-6">Need More Help?</h2> <form class="space-y-6"> <div> <label for="name" class="block text-sm font-medium text-gray-700">Name *</label> <input type="text" id="name" name="name" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"> </div> <div> <label for="email" class="block text-sm font-medium text-gray-700">Email *</label> <input type="email" id="email" name="email" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"> </div> <div> <label for="priority" class="block text-sm font-medium text-gray-700">Priority Level</label> <select id="priority" name="priority" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"> <option value="low">Low - General Question</option> <option value="medium">Medium - Need Assistance</option> <option value="high">High - Urgent Issue</option> </select> </div> <div> <label for="message" class="block text-sm font-medium text-gray-700">Message *</label> <textarea id="message" name="message" rows="4" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"></textarea> </div> <button type="submit" class="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
Submit Support Request
</button> </form> </section> </div> </main> ` })}`;
}, "/Users/bakari/Downloads/dzaleka heritage archive/src/pages/support.astro", void 0);

const $$file = "/Users/bakari/Downloads/dzaleka heritage archive/src/pages/support.astro";
const $$url = "/support";

export { $$Support as default, $$file as file, $$url as url };
