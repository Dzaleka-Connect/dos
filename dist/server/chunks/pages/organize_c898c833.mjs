/* empty css                            */import { f as createComponent, i as renderTemplate, j as renderComponent, m as maybeRenderHead } from '../astro_80255e7d.mjs';
import 'clsx';
import { $ as $$Layout } from './__fa3eb426.mjs';

const $$Organize = createComponent(async ($$result, $$props, $$slots) => {
  const pageTitle = "Organize an Event";
  const pageDescription = "Create and organize events in the Dzaleka community";
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": pageTitle, "description": pageDescription }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="bg-white"> <div class="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-20 lg:px-8"> <div class="max-w-3xl mx-auto text-center mb-12"> <h1 class="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
Organize an Event
</h1> <p class="mt-4 text-xl text-gray-500">
Share your events with the Dzaleka community
</p> </div> <div class="mt-12"> <form id="eventForm" class="space-y-8" enctype="multipart/form-data"> <div class="space-y-8 divide-y divide-gray-200"> <div class="space-y-6 sm:space-y-5"> <div> <h3 class="text-lg leading-6 font-medium text-gray-900">
Event Details
</h3> <p class="mt-1 max-w-2xl text-sm text-gray-500">
Provide information about your event
</p> </div> <div class="space-y-6 sm:space-y-5"> <div class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start"> <label for="title" class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
Event Title
</label> <div class="mt-1 sm:mt-0 sm:col-span-2"> <input type="text" name="title" id="title" required class="block w-full shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm border-gray-300 rounded-md"> </div> </div> <div class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start"> <label for="description" class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
Description
</label> <div class="mt-1 sm:mt-0 sm:col-span-2"> <textarea id="description" name="description" rows="4" required class="block w-full shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm border-gray-300 rounded-md"></textarea> </div> </div> <div class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start"> <label for="category" class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
Category
</label> <div class="mt-1 sm:mt-0 sm:col-span-2"> <select id="category" name="category" required class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"> <option value="">Select a category</option> <option value="cultural">Cultural</option> <option value="educational">Educational</option> <option value="sports">Sports</option> <option value="community">Community</option> <option value="arts">Arts & Entertainment</option> <option value="other">Other</option> </select> </div> </div> <div class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start"> <label for="date" class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
Date & Time
</label> <div class="mt-1 sm:mt-0 sm:col-span-2"> <input type="datetime-local" name="date" id="date" required class="block w-full shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm border-gray-300 rounded-md"> </div> </div> <div class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start"> <label for="location" class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
Location
</label> <div class="mt-1 sm:mt-0 sm:col-span-2"> <input type="text" name="location" id="location" required class="block w-full shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm border-gray-300 rounded-md"> </div> </div> <div class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start"> <label for="capacity" class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
Capacity (optional)
</label> <div class="mt-1 sm:mt-0 sm:col-span-2"> <input type="number" name="capacity" id="capacity" min="1" class="block w-full shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm border-gray-300 rounded-md"> </div> </div> <div class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start"> <label for="image" class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
Event Image
</label> <div class="mt-1 sm:mt-0 sm:col-span-2"> <input type="file" name="image" id="image" accept="image/*" class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"> </div> </div> </div> </div> <div class="pt-8 space-y-6 sm:pt-10 sm:space-y-5"> <div> <h3 class="text-lg leading-6 font-medium text-gray-900">
Organizer Information
</h3> <p class="mt-1 max-w-2xl text-sm text-gray-500">
Your contact information for event coordination
</p> </div> <div class="space-y-6 sm:space-y-5"> <div class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start"> <label for="organizerName" class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
Name
</label> <div class="mt-1 sm:mt-0 sm:col-span-2"> <input type="text" name="organizerName" id="organizerName" required class="block w-full shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm border-gray-300 rounded-md"> </div> </div> <div class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start"> <label for="organizerEmail" class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
Email
</label> <div class="mt-1 sm:mt-0 sm:col-span-2"> <input type="email" name="organizerEmail" id="organizerEmail" required class="block w-full shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm border-gray-300 rounded-md"> </div> </div> <div class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start"> <label for="organizerPhone" class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
Phone (optional)
</label> <div class="mt-1 sm:mt-0 sm:col-span-2"> <input type="tel" name="organizerPhone" id="organizerPhone" class="block w-full shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm border-gray-300 rounded-md"> </div> </div> </div> </div> </div> <div class="pt-5"> <div class="flex justify-end"> <button type="button" id="cancelButton" class="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
Cancel
</button> <button type="submit" id="submitButton" class="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"> <span>Create Event</span> <svg id="submitSpinner" class="hidden animate-spin ml-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"> <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle> <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path> </svg> </button> </div> </div> </form> <!-- Success Message --> <div id="successMessage" class="hidden mt-4 rounded-md bg-green-50 p-4"> <div class="flex"> <div class="flex-shrink-0"> <svg class="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"> <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path> </svg> </div> <div class="ml-3"> <p class="text-sm font-medium text-green-800">
Event created successfully! We'll review your submission and get back to you soon.
</p> </div> </div> </div> <!-- Error Message --> <div id="errorMessage" class="hidden mt-4 rounded-md bg-red-50 p-4"> <div class="flex"> <div class="flex-shrink-0"> <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"> <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path> </svg> </div> <div class="ml-3"> <p class="text-sm font-medium text-red-800">
Error creating event. Please try again.
</p> </div> </div> </div> </div> </div> </div> ` })} `;
}, "/Users/bakari/Downloads/dzaleka heritage archive/src/pages/events/organize.astro", void 0);

const $$file = "/Users/bakari/Downloads/dzaleka heritage archive/src/pages/events/organize.astro";
const $$url = "/events/organize";

export { $$Organize as default, $$file as file, $$url as url };
