export const supportCategories = [
    {
      id: "technical",
      title: "Technical Support",
      description: "Get help with website access, account issues, or technical problems",
      icon: `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
      </svg>`,
      formId: "technical-support",
      fields: [
        { type: "text", name: "name", label: "Full Name", required: true },
        { type: "email", name: "email", label: "Email Address", required: true },
        { 
          type: "select", 
          name: "issue_type", 
          label: "Issue Type",
          required: true,
          options: [
            { value: "", label: "Select issue type" },
            { value: "website", label: "Website Access" },
            { value: "account", label: "Account Issues" },
            { value: "technical", label: "Technical Problems" },
            { value: "other", label: "Other" }
          ]
        },
        { type: "textarea", name: "message", label: "Your Message", required: true }
      ]
    },
    {
      id: "visit",
      title: "Visit Dzaleka",
      description: "Questions about tours, bookings, or becoming a guide",
      icon: `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
      </svg>`,
      formId: "visit-support",
      fields: [
        { type: "text", name: "name", label: "Full Name", required: true },
        { type: "email", name: "email", label: "Email Address", required: true },
        { 
          type: "select", 
          name: "inquiry_type", 
          label: "Inquiry Type",
          required: true,
          options: [
            { value: "", label: "Select inquiry type" },
            { value: "tour", label: "Tour Booking" },
            { value: "guide", label: "Becoming a Guide" },
            { value: "information", label: "General Information" },
            { value: "other", label: "Other" }
          ]
        },
        { type: "textarea", name: "message", label: "Your Message", required: true }
      ]
    },
    {
      id: "business",
      title: "Business Services",
      description: "Support for business registration, permits, and related services",
      icon: `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
      </svg>`,
      formId: "business-support",
      fields: [
        { type: "text", name: "name", label: "Full Name", required: true },
        { type: "email", name: "email", label: "Email Address", required: true },
        { 
          type: "select", 
          name: "service_type", 
          label: "Service Type",
          required: true,
          options: [
            { value: "", label: "Select service type" },
            { value: "registration", label: "Business Registration" },
            { value: "permits", label: "Permits & Licenses" },
            { value: "consultation", label: "Business Consultation" },
            { value: "other", label: "Other" }
          ]
        },
        { type: "textarea", name: "message", label: "Your Message", required: true }
      ]
    },
    {
      id: "community",
      title: "Community Voice",
      description: "Submit stories, experiences, or community-related inquiries",
      icon: `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"/>
      </svg>`,
      formId: "community-support",
      fields: [
        { type: "text", name: "name", label: "Full Name", required: true },
        { type: "email", name: "email", label: "Email Address", required: true },
        { 
          type: "select", 
          name: "content_type", 
          label: "Content Type",
          required: true,
          options: [
            { value: "", label: "Select content type" },
            { value: "story", label: "Personal Story" },
            { value: "experience", label: "Community Experience" },
            { value: "feedback", label: "Community Feedback" },
            { value: "other", label: "Other" }
          ]
        },
        { type: "textarea", name: "message", label: "Your Message", required: true }
      ]
    },
    {
      id: "culture",
      title: "Culture & Heritage",
      description: "Questions about cultural events, heritage preservation, or cultural activities",
      icon: `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
      </svg>`,
      formId: "culture-support",
      fields: [
        { type: "text", name: "name", label: "Full Name", required: true },
        { type: "email", name: "email", label: "Email Address", required: true },
        { 
          type: "select", 
          name: "topic", 
          label: "Topic",
          required: true,
          options: [
            { value: "", label: "Select topic" },
            { value: "events", label: "Cultural Events" },
            { value: "heritage", label: "Heritage Preservation" },
            { value: "activities", label: "Cultural Activities" },
            { value: "other", label: "Other" }
          ]
        },
        { type: "textarea", name: "message", label: "Your Message", required: true }
      ]
    },
    {
      id: "education",
      title: "E-Learning",
      description: "Support for online learning, courses, or educational resources",
      icon: `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
      </svg>`,
      formId: "education-support",
      fields: [
        { type: "text", name: "name", label: "Full Name", required: true },
        { type: "email", name: "email", label: "Email Address", required: true },
        { 
          type: "select", 
          name: "topic", 
          label: "Topic",
          required: true,
          options: [
            { value: "", label: "Select topic" },
            { value: "courses", label: "Course Access" },
            { value: "resources", label: "Learning Resources" },
            { value: "technical", label: "Technical Issues" },
            { value: "other", label: "Other" }
          ]
        },
        { type: "textarea", name: "message", label: "Your Message", required: true }
      ]
    },
    {
      id: "jobs",
      title: "Jobs & Employment",
      description: "Inquiries about job opportunities, employment services, or career development",
      icon: `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
      </svg>`,
      formId: "jobs-support",
      fields: [
        { type: "text", name: "name", label: "Full Name", required: true },
        { type: "email", name: "email", label: "Email Address", required: true },
        { 
          type: "select", 
          name: "topic", 
          label: "Topic",
          required: true,
          options: [
            { value: "", label: "Select topic" },
            { value: "opportunities", label: "Job Opportunities" },
            { value: "services", label: "Employment Services" },
            { value: "training", label: "Career Training" },
            { value: "other", label: "Other" }
          ]
        },
        { type: "textarea", name: "message", label: "Your Message", required: true }
      ]
    },
    {
      id: "gallery",
      title: "Photo Gallery",
      description: "Submit photos, request photo access, or report gallery issues",
      icon: `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
      </svg>`,
      formId: "gallery-support",
      fields: [
        { type: "text", name: "name", label: "Full Name", required: true },
        { type: "email", name: "email", label: "Email Address", required: true },
        { 
          type: "select", 
          name: "inquiry_type", 
          label: "Inquiry Type",
          required: true,
          options: [
            { value: "", label: "Select inquiry type" },
            { value: "submit", label: "Submit Photos" },
            { value: "access", label: "Request Access" },
            { value: "report", label: "Report Issue" },
            { value: "other", label: "Other" }
          ]
        },
        { type: "textarea", name: "message", label: "Your Message", required: true }
      ]
    },
    {
      id: "events",
      title: "Events",
      description: "Questions about upcoming events, event registration, or event hosting",
      icon: `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
      </svg>`,
      formId: "events-support",
      fields: [
        { type: "text", name: "name", label: "Full Name", required: true },
        { type: "email", name: "email", label: "Email Address", required: true },
        { 
          type: "select", 
          name: "inquiry_type", 
          label: "Inquiry Type",
          required: true,
          options: [
            { value: "", label: "Select inquiry type" },
            { value: "info", label: "Event Information" },
            { value: "register", label: "Event Registration" },
            { value: "host", label: "Host an Event" },
            { value: "other", label: "Other" }
          ]
        },
        { type: "textarea", name: "message", label: "Your Message", required: true }
      ]
    },
    {
      id: "resources",
      title: "Resources",
      description: "Access to documents, guides, and other community resources",
      icon: `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
      </svg>`,
      formId: "resources-support",
      fields: [
        { type: "text", name: "name", label: "Full Name", required: true },
        { type: "email", name: "email", label: "Email Address", required: true },
        { 
          type: "select", 
          name: "resource_type", 
          label: "Resource Type",
          required: true,
          options: [
            { value: "", label: "Select resource type" },
            { value: "documents", label: "Documents" },
            { value: "guides", label: "Guides" },
            { value: "templates", label: "Templates" },
            { value: "other", label: "Other" }
          ]
        },
        { type: "textarea", name: "message", label: "Your Message", required: true }
      ]
    },
    {
      id: "skills",
      title: "Skills Exchange",
      description: "Learn about skill sharing opportunities and workshops",
      icon: `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
      </svg>`,
      formId: "skills-support",
      fields: [
        { type: "text", name: "name", label: "Full Name", required: true },
        { type: "email", name: "email", label: "Email Address", required: true },
        { 
          type: "select", 
          name: "inquiry_type", 
          label: "Inquiry Type",
          required: true,
          options: [
            { value: "", label: "Select inquiry type" },
            { value: "learn", label: "Learn a Skill" },
            { value: "teach", label: "Teach a Skill" },
            { value: "workshop", label: "Workshop Information" },
            { value: "other", label: "Other" }
          ]
        },
        { type: "textarea", name: "message", label: "Your Message", required: true }
      ]
    },
    {
      id: "general",
      title: "General Inquiry",
      description: "Other questions or concerns not covered above",
      icon: `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>`,
      formId: "general-inquiry",
      fields: [
        { type: "text", name: "name", label: "Full Name", required: true },
        { type: "email", name: "email", label: "Email Address", required: true },
        { type: "textarea", name: "message", label: "Your Message", required: true }
      ]
    }
  ];