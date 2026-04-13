export type OpportunityStatus = 'open' | 'opening soon' | 'ongoing';
export type ExternalOpportunityStatus = 'open now' | 'ongoing support' | 'watchlist';
export type OpportunityAudience =
  | 'residents and families'
  | 'service providers and NGOs'
  | 'small businesses and traders'
  | 'visitors, researchers, and partners'
  | 'artists, educators, and job seekers';

export interface CuratedOpportunity {
  slug: string;
  title: string;
  summary: string;
  actionHref: string;
  actionLabel: string;
  status: OpportunityStatus;
  type: string;
  audience: OpportunityAudience[];
  organization: string;
  location: string;
  deadline?: string;
  intro: string;
  support: string[];
  eligibility: string[];
  applicationSteps: string[];
  contacts?: { label: string; value: string; href?: string }[];
}

export interface ExternalOpportunity {
  slug: string;
  title: string;
  summary: string;
  sourceUrl: string;
  sourceLabel: string;
  status: ExternalOpportunityStatus;
  type: string;
  audience: OpportunityAudience[];
  organization: string;
  location: string;
  region: 'Malawi' | 'Regional' | 'Global';
  deadline?: string;
  verifiedDate: string;
  eligibilityNote: string;
  note: string;
}

export const audienceLabels: OpportunityAudience[] = [
  'residents and families',
  'service providers and NGOs',
  'small businesses and traders',
  'visitors, researchers, and partners',
  'artists, educators, and job seekers'
];

export const audienceShortLabels: Record<OpportunityAudience, string> = {
  'residents and families': 'Residents & families',
  'service providers and NGOs': 'Service providers & NGOs',
  'small businesses and traders': 'Businesses & traders',
  'visitors, researchers, and partners': 'Visitors & partners',
  'artists, educators, and job seekers': 'Artists, educators & job seekers'
};

export const curatedGrantsPrograms: CuratedOpportunity[] = [
  {
    slug: 'marketplace-store-registration',
    title: 'Register a store in the marketplace',
    summary: 'List a shop, restaurant, salon, workshop, or other business in the public marketplace store directory.',
    actionHref: '/marketplace/stores/register',
    actionLabel: 'Register a store',
    status: 'ongoing',
    type: 'Business listing',
    audience: ['small businesses and traders'],
    organization: 'Dzaleka Online Services',
    location: 'Online / community-wide',
    intro:
      'This ongoing listing opportunity helps small businesses and market traders create a public storefront inside Dzaleka Online Services. It is designed for people who want to increase visibility, help customers find them more easily, and appear alongside other local businesses.',
    support: [
      'A public business profile in the marketplace store directory',
      'A structured listing with owner, location, and contact details',
      'An easier way for people to discover local businesses and services'
    ],
    eligibility: [
      'For small businesses, traders, shop owners, and community-based enterprises',
      'Best for businesses with clear contact details and basic service information',
      'Useful for both new and established businesses'
    ],
    applicationSteps: [
      'Open the store registration form',
      'Provide business details, owner information, and location',
      'Submit the form for review and publication'
    ],
    contacts: [
      { label: 'General support', value: 'Contact the team', href: '/contact' }
    ]
  },
  {
    slug: 'marketplace-listing-submission',
    title: 'Create a marketplace listing',
    summary: 'Promote a product, service, or community business offer through the Dzaleka marketplace.',
    actionHref: '/marketplace/submit',
    actionLabel: 'Create listing',
    status: 'ongoing',
    type: 'Business promotion',
    audience: ['small businesses and traders', 'artists, educators, and job seekers'],
    organization: 'Dzaleka Online Services',
    location: 'Online / community-wide',
    intro:
      'This opportunity is for individuals or groups who want to promote something they sell, make, or offer. It supports visibility for products, services, and practical offers that can be shared through the marketplace.',
    support: [
      'A marketplace listing with description and supporting information',
      'A public route that can be shared with customers and partners',
      'A low-barrier entry point for promoting local enterprise'
    ],
    eligibility: [
      'For entrepreneurs, makers, traders, and service providers',
      'Suitable for products, services, creative work, and business offers',
      'The listing should include enough detail for people to understand what is being offered'
    ],
    applicationSteps: [
      'Open the listing submission page',
      'Enter the title, description, contact details, and supporting content',
      'Submit for review and publication'
    ]
  },
  {
    slug: 'skills-exchange-profile',
    title: 'List your skill profile',
    summary: 'Share your experience, practical skills, or creative work so others can find and contact you.',
    actionHref: '/skills-exchange/list-profile',
    actionLabel: 'Add profile',
    status: 'ongoing',
    type: 'Skills profile',
    audience: ['residents and families', 'artists, educators, and job seekers'],
    organization: 'Dzaleka Skills Exchange',
    location: 'Online / community-wide',
    intro:
      'This is an ongoing participation opportunity for people who want to make their skills visible. It is useful for freelancers, creatives, educators, technicians, and community members offering practical help or training.',
    support: [
      'A public profile showing skills, short description, and contact methods',
      'Exposure to people searching for help, collaboration, or paid work',
      'A practical way to turn existing experience into visibility'
    ],
    eligibility: [
      'For people offering a skill, service, or area of experience',
      'Suitable for both paid and unpaid skills',
      'Helpful for freelancers, creatives, trainers, and community practitioners'
    ],
    applicationSteps: [
      'Open the profile form',
      'Add your skill, description, location, and contact details',
      'Submit your profile for inclusion in the exchange'
    ]
  },
  {
    slug: 'skills-exchange-learning-request',
    title: 'Request a skill or learning support',
    summary: 'Post what you want to learn or the support you need so community members can respond.',
    actionHref: '/skills-exchange/request',
    actionLabel: 'Submit request',
    status: 'ongoing',
    type: 'Learning request',
    audience: ['residents and families', 'artists, educators, and job seekers'],
    organization: 'Dzaleka Skills Exchange',
    location: 'Online / community-wide',
    intro:
      'This page helps people ask for learning or practical support from others in the community. It is useful when you know what you want to learn but do not yet know who can help.',
    support: [
      'A public request that explains the skill or support needed',
      'A way to attract responses from people already listed in Skills Exchange',
      'A low-pressure route for peer learning and collaboration'
    ],
    eligibility: [
      'For people who want to learn, improve, or receive practical help',
      'Suitable for short-term and ongoing learning needs',
      'Best when the request is clear and specific'
    ],
    applicationSteps: [
      'Open the learning request form',
      'Describe the skill, support need, or learning goal',
      'Submit the request so it can be shared publicly'
    ]
  },
  {
    slug: 'service-directory-registration',
    title: 'Register a community service',
    summary: 'Add an organisation, service, programme, or support point to the public services directory.',
    actionHref: '/services/register',
    actionLabel: 'Register service',
    status: 'ongoing',
    type: 'Service registration',
    audience: ['service providers and NGOs'],
    organization: 'Dzaleka Online Services',
    location: 'Online / community-wide',
    intro:
      'This is an ongoing directory opportunity for organisations and service providers that want people to find them more easily. It helps bring together public information about support, education, health, legal, and community services.',
    support: [
      'A public entry in the services directory',
      'A searchable page with location, contact details, and service description',
      'Better discoverability for residents, partners, and researchers'
    ],
    eligibility: [
      'For NGOs, service providers, community groups, schools, and support organisations',
      'Best for services with clear contact information and a defined role',
      'Useful for both established and newly operating programmes'
    ],
    applicationSteps: [
      'Open the registration form',
      'Provide organisation, service, contact, and location details',
      'Submit the listing for review and publication'
    ]
  },
  {
    slug: 'course-submission',
    title: 'Submit a course or learning opportunity',
    summary: 'Share a course, class, workshop, or educational offer for listing on the e-learning section.',
    actionHref: '/e-learning/courses/submit',
    actionLabel: 'Submit course',
    status: 'ongoing',
    type: 'Education opportunity',
    audience: ['artists, educators, and job seekers', 'service providers and NGOs'],
    organization: 'Dzaleka Online Services',
    location: 'Online / community-wide',
    intro:
      'This opportunity is for educators, trainers, and organisations that want to share structured learning offers with the community. It can be used for classes, workshops, online modules, and short practical courses.',
    support: [
      'A public course listing in the e-learning area',
      'A way to describe learning goals, access information, and resources',
      'Better visibility for education offers already available in the community'
    ],
    eligibility: [
      'For educators, trainers, organisations, and learning programmes',
      'Suitable for formal and informal learning offers',
      'Best when the course has a clear focus and target learner group'
    ],
    applicationSteps: [
      'Open the course submission form',
      'Enter the course title, description, format, and resource links',
      'Submit for review and publication'
    ]
  },
  {
    slug: 'job-posting-for-employers',
    title: 'Post a job opportunity',
    summary: 'Organisations and employers can submit vacancies for publication on the Dzaleka Community Job Board.',
    actionHref: '/jobs/post',
    actionLabel: 'Post a job',
    status: 'ongoing',
    type: 'Employer action',
    audience: ['service providers and NGOs', 'small businesses and traders'],
    organization: 'Dzaleka Community Job Board',
    location: 'Online / community-wide',
    intro:
      'This is an ongoing employer-facing opportunity for organisations and businesses that want to share vacancies with the community. It supports employment visibility and a more structured local job pipeline.',
    support: [
      'Publication on the public job board',
      'A standard structure for title, deadline, category, and contact details',
      'Improved visibility for local recruitment'
    ],
    eligibility: [
      'For employers, organisations, community projects, and businesses',
      'Suitable for full-time, part-time, contract, internship, and volunteer roles',
      'Best when deadline and contact details are clearly defined'
    ],
    applicationSteps: [
      'Open the job posting form',
      'Add organisation details, the job description, skills, and deadline',
      'Submit for review and publication'
    ]
  },
  {
    slug: 'local-guide-application',
    title: 'Apply to become a local guide',
    summary: 'Community members can register interest in guiding visits and sharing local knowledge with guests and partners.',
    actionHref: '/visit/become-guide',
    actionLabel: 'Apply now',
    status: 'ongoing',
    type: 'Community role',
    audience: ['residents and families', 'visitors, researchers, and partners'],
    organization: 'Visit Dzaleka',
    location: 'Dzaleka and surrounding area',
    intro:
      'This ongoing application is for community members who want to support visits and help guests understand local life, culture, and community activity. It is suitable for people interested in guiding, hosting, or representing the community.',
    support: [
      'A formal way to express interest in becoming a local guide',
      'An entry point for future visitor-facing opportunities',
      'A route for sharing local knowledge in a structured way'
    ],
    eligibility: [
      'For community members interested in tourism, guiding, or community hosting',
      'Best for people comfortable communicating with visitors',
      'Useful for those who want future visitor-related opportunities'
    ],
    applicationSteps: [
      'Open the guide registration form',
      'Complete the personal and experience questions',
      'Submit the form and wait for follow-up from the Visit Dzaleka team'
    ]
  },
  {
    slug: 'community-voice-submission',
    title: 'Share a story, update, or creative contribution',
    summary: 'Submit community voices, stories, and creative work that help document local experience and public knowledge.',
    actionHref: '/submit-voice',
    actionLabel: 'Submit now',
    status: 'ongoing',
    type: 'Community submission',
    audience: ['residents and families', 'artists, educators, and job seekers', 'service providers and NGOs'],
    organization: 'Dzaleka Online Services',
    location: 'Online / community-wide',
    intro:
      'This ongoing submission route helps build a stronger public record of local life. It is for stories, updates, creative work, and contributions that help represent the community in its own words.',
    support: [
      'A structured route for submitting stories or creative contributions',
      'A way to strengthen community knowledge and public record',
      'Visibility for local voices, updates, and lived experience'
    ],
    eligibility: [
      'For residents, organisations, artists, educators, and contributors',
      'Suitable for stories, local updates, reflections, and creative material',
      'Best when the submission is clear about what is being shared and why it matters'
    ],
    applicationSteps: [
      'Open the voice submission form',
      'Add the story, update, or creative contribution details',
      'Submit it for review and possible publication'
    ]
  },
  {
    slug: 'entrepreneurship-updates',
    title: 'Entrepreneurship updates and future programmes',
    summary: 'Join the entrepreneur mailing list to hear about future business support, marketplace opportunities, and programme updates.',
    actionHref: '/entrepreneurs',
    actionLabel: 'Join updates',
    status: 'opening soon',
    type: 'Programme updates',
    audience: ['small businesses and traders'],
    organization: 'Dzaleka Online Services',
    location: 'Online / community-wide',
    intro:
      'This is a lightweight way to stay connected to future entrepreneurship support, marketplace-related opportunities, and new programmes as they become available. It works more like an interest register than a formal grant application.',
    support: [
      'A way to receive updates about future business support programmes',
      'Early visibility into marketplace and entrepreneurship activity',
      'A simple route for staying connected without a full application'
    ],
    eligibility: [
      'For entrepreneurs, traders, and people planning to start or grow a business',
      'Suitable for those looking for future support rather than an immediate grant',
      'Useful for staying informed about new opportunities'
    ],
    applicationSteps: [
      'Visit the entrepreneurs page',
      'Complete the mailing list form with contact details and business information',
      'Watch for future programme and opportunity updates'
    ]
  }
];

export const externalOpportunities: ExternalOpportunity[] = [
  {
    slug: 'refugees-international-fellows-2026',
    title: 'Refugee Fellows Program 2026-2027',
    summary:
      'Year-long fellowship for forcibly displaced leaders who want tools, visibility, and support for advocacy and community leadership work.',
    sourceUrl:
      'https://www.refugeesinternational.org/events-and-testimony/info-session-applying-for-the-2026-2027-refugee-fellows-program/',
    sourceLabel: 'View official call',
    status: 'open now',
    type: 'Leadership fellowship',
    audience: ['artists, educators, and job seekers', 'service providers and NGOs'],
    organization: 'Refugees International',
    location: 'Global',
    region: 'Global',
    deadline: '2026-04-30',
    verifiedDate: '2026-04-13',
    eligibilityNote:
      'For forcibly displaced leaders. This is not a direct business grant, but it can help founders and community leaders build visibility, networks, and advocacy skills.',
    note: 'Applications were listed as open, with a deadline of April 30, 2026.'
  },
  {
    slug: 'acumen-green-rise-east-africa-2026',
    title: 'Green RISE East Africa Fellowship 2026',
    summary:
      'Regional fellowship for entrepreneurs building climate-aligned businesses and inclusive green jobs for women and youth.',
    sourceUrl: 'https://fellowship.acumenacademy.org/green-rise-east-africa-fellowship-2026',
    sourceLabel: 'View official programme',
    status: 'open now',
    type: 'Entrepreneur fellowship',
    audience: ['small businesses and traders', 'artists, educators, and job seekers'],
    organization: 'Acumen Academy',
    location: 'East Africa',
    region: 'Regional',
    deadline: '2026-05-11',
    verifiedDate: '2026-04-13',
    eligibilityNote:
      'Open to entrepreneurs working in Kenya, Uganda, Tanzania, Rwanda, Ethiopia, Burundi, South Sudan, and Somalia. Malawi-based founders would need a qualifying operating base in one of those countries.',
    note: 'Applications were listed as open, with a deadline of May 11, 2026.'
  },
  {
    slug: 'neef-malawi-loan-products',
    title: 'NEEF enterprise loan products',
    summary:
      'Malawi-based enterprise finance page for people seeking start-up or small-business capital through NEEF loan products.',
    sourceUrl: 'https://www.neef.mw/loanmen1',
    sourceLabel: 'View official NEEF page',
    status: 'ongoing support',
    type: 'Enterprise finance',
    audience: ['small businesses and traders', 'artists, educators, and job seekers'],
    organization: 'National Economic Empowerment Fund (NEEF)',
    location: 'Malawi',
    region: 'Malawi',
    verifiedDate: '2026-04-13',
    eligibilityNote:
      'This is not refugee-specific. Loan eligibility depends on documentation, product rules, and the lender’s requirements, so applicants should review the page carefully before applying.',
    note: 'NEEF publicly lists ongoing enterprise, youth, and artisan loan products on its official products pages.'
  },
  {
    slug: 'unhcr-brazil-refugee-entrepreneurs',
    title: 'UNHCR Brazil Refugee Entrepreneurs platform',
    summary:
      'Ongoing business visibility and support platform for refugees in Brazil, including referrals for marketing courses, formalisation, and access-to-credit options.',
    sourceUrl: 'https://help.unhcr.org/brazil/en/trabalho-e-renda/refugiados-empreendedores/',
    sourceLabel: 'View official platform',
    status: 'ongoing support',
    type: 'Business support platform',
    audience: ['small businesses and traders'],
    organization: 'UNHCR Brazil',
    location: 'Brazil',
    region: 'Global',
    verifiedDate: '2026-04-13',
    eligibilityNote:
      'Useful for displaced entrepreneurs living in Brazil. It is included here as an example of a live refugee-focused entrepreneurship support model outside Malawi.',
    note: 'The platform describes ongoing access to listing, learning, formalisation, and credit support.'
  },
  {
    slug: 'unhcr-dadaab-livelihoods',
    title: 'UNHCR Dadaab livelihoods support',
    summary:
      'Livelihoods support in Dadaab including business and entrepreneurship training, incubation, and support for youth and women.',
    sourceUrl: 'https://help.unhcr.org/kenya/dadaab/livelihoods/',
    sourceLabel: 'View official support page',
    status: 'ongoing support',
    type: 'Livelihoods support',
    audience: ['small businesses and traders', 'residents and families'],
    organization: 'UNHCR Kenya',
    location: 'Dadaab, Kenya',
    region: 'Regional',
    verifiedDate: '2026-04-13',
    eligibilityNote:
      'This support is specific to Dadaab, Kenya. It is not a Malawi programme, but it is a verified refugee entrepreneurship and livelihoods reference point in the region.',
    note: 'The page describes business training, incubation, youth and women financial support, and movement-pass support for business activity.'
  },
  {
    slug: 'unhcr-refugee-led-innovation-fund',
    title: 'UNHCR Refugee-led Innovation Fund',
    summary:
      'Global funding and technical support for refugee-led and displaced-led organisations testing community-led solutions.',
    sourceUrl: 'https://www.unhcr.org/innovation/refugee-led-innovation-fund/',
    sourceLabel: 'View official fund page',
    status: 'watchlist',
    type: 'Innovation fund',
    audience: ['service providers and NGOs', 'artists, educators, and job seekers'],
    organization: 'UNHCR Innovation Service',
    location: 'Global',
    region: 'Global',
    verifiedDate: '2026-04-13',
    eligibilityNote:
      'The fund is not currently accepting applications. It is generally aimed at teams applying through refugee-led or displaced-led organisations rather than individuals.',
    note: 'The official page says selected organisations can apply for up to USD 45,000 when calls reopen.'
  },
  {
    slug: 'unhcr-malawi-watch',
    title: 'UNHCR Malawi operational updates',
    summary:
      'A Malawi-specific source to monitor for refugee operations updates, funding context, and future livelihood or partnership announcements.',
    sourceUrl: 'https://www.unhcr.org/operational/operations/malawi',
    sourceLabel: 'View Malawi page',
    status: 'watchlist',
    type: 'Monitoring source',
    audience: ['service providers and NGOs', 'small businesses and traders', 'visitors, researchers, and partners'],
    organization: 'UNHCR',
    location: 'Malawi',
    region: 'Malawi',
    verifiedDate: '2026-04-13',
    eligibilityNote:
      'This is not a live application page. It is included because there were no clear public Malawi-specific refugee business grant calls available from official sources at the time of review.',
    note: 'Use this as a watchpoint for future Malawi-specific calls, partnerships, and refugee-support announcements.'
  }
];

export function getStatusClasses(status: OpportunityStatus) {
  if (status === 'open') return 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200';
  if (status === 'opening soon') return 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200';
  return 'bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-200';
}

export function getExternalStatusClasses(status: ExternalOpportunityStatus) {
  if (status === 'open now') return 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200';
  if (status === 'watchlist') return 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200';
  return 'bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-200';
}
