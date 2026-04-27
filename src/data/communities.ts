export interface CommunityGroup {
  slug: string;
  title: string;
  shortTitle: string;
  tagline: string;
  audience: string;
  description: string;
  category: string;
  topics: string[];
  activities: string[];
  relatedLinks: {
    label: string;
    href: string;
  }[];
  chairRole: string;
  joinUrl: string;
  isMain?: boolean;
}

export const communitiesHeroImage = {
  src: '/images/dos-communities-hero.jpg',
  seoUrl: 'https://services.dzaleka.com/images/dos-communities-og.jpg',
  alt: 'Dzaleka community members working together at a local marketplace',
  width: 1200,
  height: 630,
  type: 'image/jpeg',
};

export const communityGroups: CommunityGroup[] = [
  {
    slug: 'main-group',
    title: 'DOS Main Group',
    shortTitle: 'Main Group',
    tagline: 'The central entry point for Dzaleka Online Services Communities.',
    audience: 'Residents, entrepreneurs, community leaders, workers, partners, and anyone exploring DOS Communities.',
    description:
      'Join the main Community first if you are not sure where to begin. It is the central hub for orientation, important announcements, and pointers to the most relevant sector groups.',
    category: 'General',
    topics: ['Announcements', 'Community orientation', 'Service updates', 'Cross-sector questions'],
    activities: ['Main announcements', 'Community navigation', 'Shared notices', 'Admin support'],
    relatedLinks: [
      { label: 'Start Here', href: '/start-here' },
      { label: 'Services Directory', href: '/services' },
      { label: 'Contact DOS', href: '/contact' },
    ],
    chairRole: 'DOS Community Admins help new members find the right sector group and keep announcements clear.',
    joinUrl: 'https://chat.whatsapp.com/I5MpQ10t7jfIJjBD5eIS5I',
    isMain: true,
  },
  {
    slug: 'women-entrepreneurs',
    title: 'Women Entrepreneurs',
    shortTitle: 'Women Entrepreneurs',
    tagline: 'A peer space for women building businesses and income opportunities.',
    audience: 'Women entrepreneurs, traders, founders, service providers, and women testing new business ideas.',
    description:
      'Share business practices, local market information, customer service ideas, pricing questions, and practical solutions for running a small business in Dzaleka.',
    category: 'Business',
    topics: ['Marketing and sales', 'Customer service', 'Pricing and stock', 'Business confidence'],
    activities: ['Peer Q&A', 'Template sharing', 'Business clinics', 'Local networking'],
    relatedLinks: [
      { label: 'Entrepreneurs', href: '/entrepreneurs' },
      { label: 'Marketplace', href: '/marketplace' },
      { label: 'Tools and templates', href: '/tools-and-templates' },
    ],
    chairRole: 'Business mentors and local entrepreneurs help keep discussion practical and useful.',
    joinUrl: 'https://chat.whatsapp.com/JYKIvnkJeYQ8MfhJ194ZHH?mode=gi_t',
  },
  {
    slug: 'artisans-and-crafts',
    title: 'Artisans & Crafts',
    shortTitle: 'Artisans',
    tagline: 'For makers, craft sellers, designers, and handmade product teams.',
    audience: 'Artisans, craft producers, tailors, designers, sellers, and groups producing handmade goods.',
    description:
      'Exchange ideas on product quality, pricing, sourcing materials, taking photos of work, finding buyers, and preparing for markets or exhibitions.',
    category: 'Creative business',
    topics: ['Product design', 'Pricing', 'Buyer readiness', 'Craft markets'],
    activities: ['Product feedback', 'Sales tips', 'Photo sharing', 'Market coordination'],
    relatedLinks: [
      { label: 'Marketplace', href: '/marketplace' },
      { label: 'Public Art Catalogue', href: '/public-art-catalogue' },
      { label: 'Entrepreneurs', href: '/entrepreneurs' },
    ],
    chairRole: 'Creative and business leads help keep the group focused on practical artisan support.',
    joinUrl: 'https://chat.whatsapp.com/KejnbugnzOKFZayGWPrkbK?mode=gi_t',
  },
  {
    slug: 'content-creators',
    title: 'Content Creators',
    shortTitle: 'Creators',
    tagline: 'For writers, photographers, filmmakers, designers, and online storytellers.',
    audience: 'Content creators, media teams, photographers, videographers, writers, designers, and social media managers.',
    description:
      'Share creative opportunities, production tips, publishing questions, media ethics, platform updates, and collaboration requests.',
    category: 'Media',
    topics: ['Storytelling', 'Photography and video', 'Social media', 'Creative collaboration'],
    activities: ['Portfolio feedback', 'Opportunity sharing', 'Content planning', 'Creator meetups'],
    relatedLinks: [
      { label: 'Community Voice', href: '/community-voice' },
      { label: 'Photos', href: '/photos' },
      { label: 'Submit Voice', href: '/submit-voice' },
    ],
    chairRole: 'Media and creative leads help protect consent, credit, and respectful storytelling.',
    joinUrl: 'https://chat.whatsapp.com/Gya5TBKoCPIKOJ8nE3Dl0b?mode=gi_t',
  },
  {
    slug: 'dzaleka-developers',
    title: 'Dzaleka Developers',
    shortTitle: 'Developers',
    tagline: 'For coders, tech learners, digital builders, and problem solvers.',
    audience: 'Developers, digital learners, designers, repair technicians, trainers, and people entering technology.',
    description:
      'Exchange coding help, learning resources, project ideas, digital tool questions, and information about technology training opportunities.',
    category: 'Technology',
    topics: ['Coding support', 'AI and data skills', 'Digital tools', 'Project building'],
    activities: ['Problem-solving threads', 'Demo sessions', 'Resource drops', 'Mentor office hours'],
    relatedLinks: [
      { label: 'E-learning', href: '/e-learning' },
      { label: 'ADAI Circle', href: '/services/adai-circle' },
      { label: 'Open Data Platform', href: '/open-data-platform' },
    ],
    chairRole: 'Volunteer technologists and trainers guide learning conversations and project sharing.',
    joinUrl: 'https://chat.whatsapp.com/Jsg2PrtfuIIAtt8CgCE1BY?mode=hqctcli',
  },
  {
    slug: 'dzaleka-online',
    title: 'Dzaleka Online',
    shortTitle: 'Dzaleka Online',
    tagline: 'For DOS platform updates, digital services, feedback, and support.',
    audience: 'Residents, service providers, contributors, digital volunteers, and partners using Dzaleka Online Services.',
    description:
      'Discuss DOS platform updates, new pages, service listings, corrections, digital access questions, and ways to improve online information for Dzaleka.',
    category: 'Platform',
    topics: ['DOS updates', 'Service listings', 'Digital access', 'Website feedback'],
    activities: ['Update notices', 'Feedback threads', 'Contributor support', 'Service correction tips'],
    relatedLinks: [
      { label: 'Platform Features', href: '/platform-features' },
      { label: 'Services Directory', href: '/services' },
      { label: 'Help Desk', href: '/help-desk' },
    ],
    chairRole: 'DOS Admins and contributors help route feedback and keep platform information accurate.',
    joinUrl: 'https://chat.whatsapp.com/GIfIu7RoOTBAVrPi5Yd4Xi?mode=gi_t',
  },
  {
    slug: 'dzaleka-fundraising',
    title: 'Dzaleka Fundraising',
    shortTitle: 'Fundraising',
    tagline: 'For fundraising ideas, donor communication, and resource mobilisation.',
    audience: 'Community organisations, project leads, fundraisers, volunteers, and people preparing campaigns or proposals.',
    description:
      'Share fundraising ideas, proposal tips, campaign updates, donor communication practices, and resources that help local initiatives raise support responsibly.',
    category: 'Funding',
    topics: ['Campaign planning', 'Donor updates', 'Proposal support', 'Resource mobilisation'],
    activities: ['Fundraising Q&A', 'Template sharing', 'Campaign feedback', 'Grant alerts'],
    relatedLinks: [
      { label: 'Grants and programs', href: '/grants-and-programs' },
      { label: 'Support Our Work', href: '/support-our-work' },
      { label: 'Projects', href: '/projects' },
    ],
    chairRole: 'Fundraising and programme leads help keep shared opportunities clear and credible.',
    joinUrl: 'https://chat.whatsapp.com/F4emboVHvCO9CpiP1mbsEy?mode=gi_t',
  },
  {
    slug: 'teachers-exchange',
    title: "Teachers' Exchange",
    shortTitle: 'Teachers',
    tagline: 'For teachers, tutors, education workers, and learning supporters.',
    audience: 'Teachers, tutors, students, parents, education partners, and people sharing learning resources.',
    description:
      'Coordinate study support, teaching resources, learning challenges, scholarship alerts, and peer advice for education pathways.',
    category: 'Education',
    topics: ['Teaching resources', 'Study support', 'Classroom practice', 'Learning opportunities'],
    activities: ['Resource sharing', 'Teaching Q&A', 'Learning circles', 'Virtual workshops'],
    relatedLinks: [
      { label: 'E-learning', href: '/e-learning' },
      { label: 'Grants and programs', href: '/grants-and-programs' },
      { label: 'Skills Exchange', href: '/skills-exchange' },
    ],
    chairRole: 'Education practitioners help organise useful materials and meeting topics.',
    joinUrl: 'https://chat.whatsapp.com/HXddqCOOEj9A532xl5SV5e?mode=gi_t',
  },
];

export const mainCommunity = communityGroups.find((community) => community.isMain) ?? communityGroups[0];

export const getCommunityBySlug = (slug: string) =>
  communityGroups.find((community) => community.slug === slug);
