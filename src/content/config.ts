import { defineCollection, z } from 'astro:content';

// Define the profile schema
const profileSchema = z.object({
  name: z.string(),
  skill: z.string(),
  status: z.string(),
  requestStatus: z.string().optional(),
  helpOfferedBy: z.string().optional(),
  helpOfferedDate: z.string().optional(),
  location: z.string(),
  category: z.string().optional(),
  level: z.string().optional(),
  profileImage: z.string(),
  email: z.string(),
  phone: z.string(),
  website: z.string().optional(),
  socialMedia: z.object({
    instagram: z.string().optional(),
    facebook: z.string().optional(),
    twitter: z.string().optional(),
    linkedin: z.string().optional(),
  }).optional(),
  chargeType: z.enum(['free', 'paid']).optional(),
  rate: z.string().optional(),
  paymentMethods: z.array(
    z.object({
      type: z.string(),
      number: z.string(),
    })
  ).optional(),
  shortDescription: z.string(),
  description: z.string(),
});

// Define the service schema
const serviceSchema = z.object({
  title: z.string(),
  description: z.string(),
  category: z.string(),
  featured: z.boolean().optional(),
  verified: z.boolean().optional(),
  logo: z.string().optional(),
  image: z.string().optional(),
  contact: z.object({
    email: z.string().optional(),
    phone: z.string().optional(),
    whatsapp: z.string().optional(),
    hours: z.string().optional(),
  }).optional(),
  location: z.object({
    address: z.string(),
    city: z.string(),
    coordinates: z.object({
      lat: z.number(),
      lng: z.number(),
    }).optional(),
  }).optional(),
  socialMedia: z.object({
    website: z.string().optional(),
    facebook: z.string().optional(),
    instagram: z.string().optional(),
    twitter: z.string().optional(),
    linkedin: z.string().optional(),
  }).optional(),
  tags: z.array(z.string()).optional(),
  businessHours: z.array(z.object({
    day: z.string(),
    open: z.string(),
    close: z.string(),
    closed: z.boolean().optional(),
  })).optional(),
  lastUpdated: z.date().optional(),
  status: z.enum(['active', 'inactive']).optional().default('active'),
});

// Define the resource schema
const resourceSchema = z.object({
  title: z.string(),
  description: z.string(),
  category: z.string(),
  featured: z.boolean().optional(),
  date: z.date(),
  author: z.string().optional(),
  thumbnail: z.string().optional(),
  fileType: z.string().optional(),
  fileSize: z.string().optional(),
  downloadUrl: z.string().optional(),
  resourceUrl: z.string().optional(),
  lastUpdated: z.date().optional(),
  languages: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
});

// Define the event schema
const eventSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.date(),
  endDate: z.date().optional(),
  location: z.string(),
  category: z.string(),
  featured: z.boolean().optional(),
  image: z.string().optional(),
  organizer: z.string(),
  status: z.enum(['upcoming', 'past']).default('past'),
  contact: z.object({
    email: z.string().optional(),
    phone: z.string().optional(),
    whatsapp: z.string().optional(),
  }).optional(),
  registration: z.object({
    required: z.boolean(),
    url: z.string().optional(),
    deadline: z.date().optional(),
  }).optional(),
  panelists: z.array(z.object({
    name: z.string(),
    role: z.string().optional(),
    bio: z.string().optional(),
    image: z.string().optional(),
    organization: z.string().optional(),
    socialMedia: z.object({
      twitter: z.string().optional(),
      instagram: z.string().optional(),
      linkedin: z.string().optional(),
      website: z.string().optional(),
    }).optional(),
  })).optional(),
  tags: z.array(z.string()).optional(),
});

// Define the photo schema
const photoSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.union([
    z.string(),
    z.number(),
    z.date()
  ]).transform((val) => {
    if (val instanceof Date) return val;
    const date = new Date(val);
    if (isNaN(date.getTime())) {
      throw new Error(`Invalid date: ${val}`);
    }
    return date;
  }),
  image: z.string().refine((val) => {
    // Accept both relative paths to public directory and absolute URLs
    if (val.startsWith('/images/')) return true;
    try {
      new URL(val);
      return true;
    } catch {
      return false;
    }
  }, "Image must be either a path starting with '/images/' or a valid URL"),
  photographer: z.object({
    name: z.string(),
    bio: z.string().optional(),
    instagram: z.string().optional(),
    website: z.string().url().optional()
  }),
  contributor: z.string().optional(),
  tags: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
  location: z.string().optional()
});

// Define the page schema
const pageSchema = z.object({
  title: z.string(),
  description: z.string(),
  featured: z.boolean().optional(),
  image: z.string().optional(),
});

// Define the news schema
const newsSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.date(),
  category: z.enum(['business-spotlight', 'announcement', 'success-story', 'business-guide', 'news', 'education']),
  featured: z.boolean().optional(),
  image: z.string().optional(),
  author: z.string().optional(),
  tags: z.array(z.string()).optional(),
  businessName: z.string().optional(), // For business spotlights
  businessOwner: z.string().optional(), // For business spotlights
  contactInfo: z.object({
    email: z.string().optional(),
    phone: z.string().optional(),
    website: z.string().optional(),
  }).optional(),
});

// Define the docs schema
const docsSchema = z.object({
  title: z.string(),
  description: z.string(),
  section: z.string(),
  order: z.number().optional(),
  featured: z.boolean().optional(),
  lastUpdated: z.date().optional(),
});

// Define the talents schema
const talentSchema = z.object({
  name: z.string(),
  category: z.string(),
  bio: z.string().optional(),
  profilePic: z.string(),
  user: z.string().optional(),
  instagram: z.string().optional(),
  twitter: z.string().optional(),
  linkedin: z.string().optional(),
});

const talentsSchema = z.object({
  name: z.string(),
  category: z.string(),
  profilePic: z.string(),
  talents: z.array(talentSchema),
});

// Define the community voice schema
const communityVoiceSchema = z.object({
  title: z.string(),
  author: z.string(),
  date: z.string(),
  category: z.string(),
  excerpt: z.string(),
  image: z.string().optional(),
  featured: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
});

// Define the job schema
const jobSchema = z.object({
  title: z.string(),
  organization: z.string(),
  location: z.string(),
  type: z.enum(['full-time', 'part-time', 'contract', 'volunteer', 'internship']),
  category: z.enum([
    'education',
    'healthcare',
    'technology',
    'community',
    'business',
    'arts',
    'services',
    'other'
  ]),
  salary: z.string().optional(),
  deadline: z.coerce.date(),
  posted: z.coerce.date(),
  status: z.enum(['open', 'closed', 'draft']).default('open'),
  featured: z.boolean().default(false),
  skills: z.array(z.string()),
  contact: z.object({
    email: z.string().email(),
    phone: z.string().optional(),
    website: z.string().url().optional()
  }),
  description: z.string()
});

// Define the story schema
const storySchema = z.object({
  title: z.string(),
  description: z.string(),
  author: z.object({
    name: z.string(),
    role: z.string().optional(),
    bio: z.string().optional(),
  }),
  date: z.string(),
  tags: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
  coverImage: z.string(),
  photos: z.array(z.object({
    image: z.string(),
    caption: z.string().optional(),
    text: z.string().optional(),
    photographer: z.string().optional(),
    date: z.string().optional(),
  })),
  content: z.array(z.object({
    image: z.string().optional(),
    caption: z.string().optional(),
    text: z.string().optional(),
  })).optional(),
});

// Define the inspirational story schema
const inspirationalStorySchema = z.object({
  title: z.string(),
  name: z.string(),
  age: z.number().optional(),
  country: z.string(),
  description: z.string(),
  date: z.string(),
  featured: z.boolean().optional(),
  personImage: z.string().optional(),
  content: z.string(),
  tags: z.array(z.string()).optional(),
  contact: z.object({
    email: z.string().optional(),
    whatsapp: z.string().optional(),
    twitter: z.string().optional(),
    instagram: z.string().optional(),
    facebook: z.string().optional(),
    website: z.string().optional(),
  }).optional(),
});

// Define the collections
const profilesCollection = defineCollection({
  type: 'content',
  schema: profileSchema,
});

const servicesCollection = defineCollection({
  type: 'content',
  schema: serviceSchema,
});

const resourcesCollection = defineCollection({
  type: 'content',
  schema: resourceSchema,
});

const eventsCollection = defineCollection({
  type: 'content',
  schema: eventSchema,
});

const photosCollection = defineCollection({
  type: 'content',
  schema: photoSchema,
});

const pagesCollection = defineCollection({
  type: 'content',
  schema: pageSchema,
});

const newsCollection = defineCollection({
  type: 'content',
  schema: newsSchema,
});

const talentsCollection = defineCollection({
  type: 'data',
  schema: talentsSchema,
});

const communityVoicesCollection = defineCollection({
  type: 'content',
  schema: communityVoiceSchema,
});

const docsCollection = defineCollection({
  type: 'content',
  schema: docsSchema,
});

const jobsCollection = defineCollection({
  type: 'content',
  schema: jobSchema,
});

const photos = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    photographer: z.object({
      name: z.string(),
      instagram: z.string().optional(),
      website: z.string().optional(),
      bio: z.string().optional(),
    }),
    contributor: z.string().optional(),
    image: z.string(),
    date: z.string(),
    tags: z.array(z.string()).optional(),
    featured: z.boolean().optional(),
    location: z.string().optional(),
  }),
});

const stories = defineCollection({
  type: 'content',
  schema: storySchema,
});

const inspirationalStories = defineCollection({
  type: 'content',
  schema: inspirationalStorySchema,
});

// Define the store schema
const storeSchema = z.object({
  name: z.string(),
  description: z.string(),
  type: z.enum(['restaurant', 'cafe', 'bakery', 'grocery', 'retail', 'salon', 'workshop', 'other']),
  logo: z.string().optional(),
  coverImage: z.string().optional(),
  owner: z.object({
    name: z.string(),
    phone: z.string(),
    email: z.string().optional(),
    whatsapp: z.string().optional(),
  }),
  location: z.object({
    address: z.string(),
    zone: z.string().optional(),
    landmark: z.string().optional(),
  }),
  hours: z.array(z.object({
    day: z.string(),
    open: z.string(),
    close: z.string(),
    closed: z.boolean().optional(),
  })).optional(),
  menu: z.array(z.object({
    category: z.string(),
    items: z.array(z.object({
      name: z.string(),
      description: z.string().optional(),
      price: z.string(),
      image: z.string().optional(),
      popular: z.boolean().optional(),
      available: z.boolean().optional().default(true),
    })),
  })).optional(),
  services: z.array(z.object({
    name: z.string(),
    description: z.string().optional(),
    price: z.string(),
    duration: z.string().optional(),
  })).optional(),
  paymentMethods: z.array(z.string()).optional(),
  deliveryOptions: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
  status: z.enum(['active', 'pending', 'inactive']).default('pending'),
  dateJoined: z.coerce.date(),
  tags: z.array(z.string()).optional(),
  socialMedia: z.object({
    facebook: z.string().optional(),
    instagram: z.string().optional(),
    tiktok: z.string().optional(),
  }).optional(),
});

const storesCollection = defineCollection({
  type: 'content',
  schema: storeSchema,
});

// Define the marketplace listing schema
const marketplaceSchema = z.object({
  title: z.string(),
  description: z.string(),
  type: z.enum(['product', 'service']),
  category: z.string(),
  price: z.string().optional(),
  priceType: z.enum(['fixed', 'negotiable', 'free', 'contact']).default('contact'),
  images: z.array(z.string()).optional(),
  vendor: z.object({
    name: z.string(),
    phone: z.string().optional(),
    email: z.string().optional(),
    whatsapp: z.string().optional(),
    location: z.string().optional(),
  }),
  status: z.enum(['active', 'sold', 'pending', 'inactive']).default('pending'),
  featured: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  datePosted: z.coerce.date(),
  condition: z.enum(['new', 'used', 'refurbished']).optional(),
  quantity: z.number().optional(),
  deliveryOptions: z.array(z.string()).optional(),
  paymentMethods: z.array(z.string()).optional(),
  externalLink: z.string().url().optional(),
});

const marketplaceCollection = defineCollection({
  type: 'content',
  schema: marketplaceSchema,
});

// Define the course schema
const courseSchema = z.object({
  title: z.string(),
  author: z.string(),
  authorEmail: z.string().optional(),
  description: z.string(),
  category: z.enum(['technology', 'business', 'languages', 'arts', 'health', 'science', 'professional-skills', 'other']),
  duration: z.string(),
  level: z.enum(['beginner', 'intermediate', 'advanced']).optional().default('beginner'),
  tags: z.array(z.string()).optional(),
  thumbnail: z.string().optional(),
  videoUrl: z.string().optional(),
  externalLink: z.string().url().optional(),
  featured: z.boolean().optional(),
  status: z.enum(['published', 'draft', 'pending']).default('pending'),
  datePublished: z.coerce.date(),
  lastUpdated: z.coerce.date().optional(),
});

const coursesCollection = defineCollection({
  type: 'content',
  schema: courseSchema,
});

// Export collections
export const collections = {
  courses: coursesCollection,
  profiles: profilesCollection,
  services: servicesCollection,
  resources: resourcesCollection,
  events: eventsCollection,
  pages: pagesCollection,
  news: newsCollection,
  talents: talentsCollection,
  'community-voices': communityVoicesCollection,
  docs: docsCollection,
  jobs: jobsCollection,
  photos: photos,
  stories: stories,
  'inspirational-stories': inspirationalStories,
  marketplace: marketplaceCollection,
  stores: storesCollection,
} as const;