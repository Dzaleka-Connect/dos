export interface Update {
    date: string;
    type: 'announcement' | 'feature' | 'update' | 'data' | 'improvement';
    title: string;
    text: string;
}

export interface UpdateWithLink extends Update {
    link: string;
    linkText: string;
}

export const updates: (Update | UpdateWithLink)[] = [
    {
        date: '2025-02-11',
        type: 'feature',
        title: 'Enhanced Radio Player Features',
        text: 'Added new interactive features to the Yetu Radio player including favorite button with local storage persistence, share functionality with Web Share API support, and dynamic now playing information based on time of day.'
    },
    {
        date: '2025-02-11',
        type: 'feature',
        title: 'Radio Player Visual Enhancements',
        text: 'Introduced new visual elements to the radio player including animated radio waves, pulsing status indicators, and improved volume control with custom styling. Added smooth transitions and hover effects for better interactivity.'
    },
    {
        date: '2025-02-11',
        type: 'improvement',
        title: 'Radio Player Mobile Optimization',
        text: 'Enhanced mobile responsiveness of the Yetu Radio player. Improved layout and controls for better user experience on mobile devices, including optimized language badges, status indicators, and player controls.'
    },
    {
        date: '2025-02-11',
        type: 'improvement',
        title: 'Radio Status Display Enhancement',
        text: 'Streamlined the radio status display by combining live broadcast and 24/7 indicators. Added clear frequency and coverage area information with improved visual hierarchy.'
    },
    {
        date: '2025-02-10',
        type: 'feature',
        title: 'Skills Exchange Matching',
        text: 'New matching algorithm helps connect people offering skills with those requesting them. The system now suggests potential matches based on skill categories and availability.',
        link: '/skills-exchange/matches',
        linkText: 'View Matches'
    },
    {
        date: '2025-02-09',
        type: 'improvement',
        title: 'API Performance Improved',
        text: 'Export API response time reduced by 40%. Data exports now process faster with improved error handling and better format options.'
    },
    {
        date: '2025-02-08',
        type: 'data',
        title: 'Content Update Required',
        text: '5 resources need metadata updates. Please review and update the missing information to improve searchability.',
        link: '/dashboard',
        linkText: 'View Content Issues'
    },
    {
        date: '2025-02-07',
        type: 'announcement',
        title: 'New Community Voice Submission',
        text: 'A new community story has been submitted for review. Check the submission and approve or request changes.',
        link: '/community-voices/admin',
        linkText: 'Review Submission'
    },
    {
        date: '2025-02-06',
        type: 'improvement',
        title: 'Dashboard Enhancements',
        text: 'Added new Platform Overview cards for all content types. The dashboard now provides comprehensive statistics for all collections including Talents, Documentation, and Pages.'
    },
    {
        date: '2025-02-05',
        type: 'announcement',
        title: 'New Job Opportunities Available',
        text: 'We\'ve added new job listings to our job board, including a Driver position. Check out our jobs page to view all available opportunities.',
        link: '/jobs',
        linkText: 'View Jobs'
    },
    {
        date: '2025-02-04',
        type: 'feature',
        title: 'API Documentation & Improvements',
        text: 'Released comprehensive API documentation for developers. Enhanced API endpoints for all collections with improved error handling and Netlify compatibility.',
        link: '/docs/api-documentation',
        linkText: 'View API Docs'
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
    },
    {
        date: '2025-02-11',
        type: 'feature',
        title: 'Help Desk & Support Center Launched',
        text: 'Introduced a new Help Desk page for user support, including a support form, FAQ, and support categories. Users can now submit requests and get assistance for technical, business, and community issues.',
        link: '/help-desk',
        linkText: 'Visit Help Desk'
    },
    {
        date: '2025-02-11',
        type: 'feature',
        title: 'API Reference Updated',
        text: 'Published the latest API reference for developers working with Dzaleka Online Services data and integrations.',
        link: '/api-docs',
        linkText: 'View API Reference'
    },
    {
        date: '2025-02-11',
        type: 'feature',
        title: 'Weather & Climate Page',
        text: 'Launched a real-time weather and climate information page for Dzaleka, including live weather, seasonal patterns, and weather alerts.',
        link: '/weather',
        linkText: 'View Weather'
    },
    {
        date: '2025-02-11',
        type: 'feature',
        title: 'Analytics Dashboard',
        text: 'Released a privacy-focused analytics dashboard for tracking site activity, engagement, and performance metrics.',
        link: '/analytics',
        linkText: 'View Analytics'
    },
    {
        date: '2025-02-11',
        type: 'feature',
        title: 'Projects & MIT Solve Solutions Page',
        text: 'Created a new Projects page showcasing innovative solutions from Dzaleka recognized by MIT Solve, with categories, highlights, and project details.',
        link: '/projects',
        linkText: 'Explore Projects'
    }
];
