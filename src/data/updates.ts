export interface Update {
    date: string;
    type: 'feature' | 'improvement' | 'bugfix' | 'announcement';
    title: string;
    description: string;
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
        description: 'We\'ve added new job listings to our job board, including a Driver position. Check out our jobs page to view all available opportunities.',
        link: '/jobs',
        linkText: 'View Jobs'
    },
    {
        date: '2025-02-03',
        type: 'feature',
        title: 'WhatsNew Widget Added',
        description: 'Added a new WhatsNew widget to keep users informed about latest updates and announcements.'
    },
    {
        date: '2025-02-03',
        type: 'improvement',
        title: 'SEO Enhancements',
        description: 'Added meta tags, OpenGraph tags, and dynamic sitemap generation for better search engine visibility.'
    },
    {
        date: '2025-02-02',
        type: 'feature',
        title: 'Emergency Application System',
        description: 'Launched new emergency application system for urgent assistance requests.'
    },
    {
        date: '2025-02-01',
        type: 'improvement',
        title: 'Enhanced Search Experience',
        description: 'Improved search functionality with better results filtering and presentation.'
    },
    {
        date: '2025-02-01',
        type: 'feature',
        title: 'Featured Services Section',
        description: 'Added new featured services section to highlight key community resources.'
    },
    {
        date: '2025-01-31',
        type: 'improvement',
        title: 'Mobile Navigation',
        description: 'Optimized navigation menu for better mobile responsiveness.'
    },
    {
        date: '2025-01-30',
        type: 'feature',
        title: 'Application Status Tracking',
        description: 'New system to track and view the status of submitted applications.'
    },
    {
        date: '2025-01-29',
        type: 'announcement',
        title: 'Service Directory Launch',
        description: 'Launched comprehensive directory of all available community services.'
    },
    {
        date: '2025-01-28',
        type: 'improvement',
        title: 'Search Results Layout',
        description: 'Redesigned search results page for better clarity and usability.'
    },
    {
        date: '2025-01-27',
        type: 'feature',
        title: 'Smart Search Suggestions',
        description: 'Implemented intelligent search suggestions based on user queries.'
    }
];
