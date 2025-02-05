export interface Update {
    date: string;
    type: 'announcement' | 'feature' | 'update' | 'data';
    title: string;
    text: string;
}

export interface UpdateWithLink extends Update {
    link: string;
    linkText: string;
}

export const updates: (Update | UpdateWithLink)[] = [
    {
        date: '2025-02-05',
        type: 'announcement',
        title: 'New Job Opportunities Available',
        text: 'We\'ve added new job listings to our job board, including a Driver position. Check out our jobs page to view all available opportunities.',
        link: '/jobs',
        linkText: 'View Jobs'
    },
    {
        date: '2025-02-03',
        type: 'feature',
        title: 'WhatsNew Widget Added',
        text: 'Added a new WhatsNew widget to keep users informed about latest updates and announcements.'
    },
    {
        date: '2025-02-03',
        type: 'improvement',
        title: 'SEO Enhancements',
        text: 'Added meta tags, OpenGraph tags, and dynamic sitemap generation for better search engine visibility.'
    },
    {
        date: '2025-02-02',
        type: 'feature',
        title: 'Emergency Application System',
        text: 'Launched new emergency application system for urgent assistance requests.'
    },
    {
        date: '2025-02-01',
        type: 'improvement',
        title: 'Enhanced Search Experience',
        text: 'Improved search functionality with better results filtering and presentation.'
    },
    {
        date: '2025-02-01',
        type: 'feature',
        title: 'Featured Services Section',
        text: 'Added new featured services section to highlight key community resources.'
    },
    {
        date: '2025-01-31',
        type: 'improvement',
        title: 'Mobile Navigation',
        text: 'Optimized navigation menu for better mobile responsiveness.'
    },
    {
        date: '2025-01-30',
        type: 'feature',
        title: 'Application Status Tracking',
        text: 'New system to track and view the status of submitted applications.'
    },
    {
        date: '2025-01-29',
        type: 'announcement',
        title: 'Service Directory Launch',
        text: 'Launched comprehensive directory of all available community services.'
    },
    {
        date: '2025-01-28',
        type: 'improvement',
        title: 'Search Results Layout',
        text: 'Redesigned search results page for better clarity and usability.'
    },
    {
        date: '2025-01-27',
        type: 'feature',
        title: 'Smart Search Suggestions',
        text: 'Implemented intelligent search suggestions based on user queries.'
    },
    {
        date: '2025-02-05',
        type: 'data',
        title: 'Data & Statistics Update',
        text: `Updated camp statistics from latest UNHCR and WFP reports:

• Total refugee population: 56,760 people
• Women & Girls: 60% of camp population
• Main nationalities: DRC (62%), Burundi (19%), Rwanda (7%), Others (2%)

Source: WFP Malawi Country Brief (Dec 2024) & UNHCR Malawi`
    }
];
