export interface Update {
    date: string;
    type: 'announcement' | 'feature' | 'data' | 'improvement';
    title: string;
    description: string;
    text: string;
    link?: string;
    linkText?: string;
}

export const updates: Update[] = [
    {
        date: '2025-02-11',
        type: 'feature',
        title: 'Help Desk opened as the site’s main support entry point',
        description: 'The platform now has one clear place to ask for technical help, business guidance, or follow-up support.',
        text: [
            'We added a dedicated Help Desk so support requests no longer have to be routed through scattered forms and contact pages.',
            'The page combines a submission form, support categories, and a short FAQ so users can quickly decide whether they need technical help, business support, or a general response from the team.',
            'This change matters because the rest of the site now has a consistent place to send people when they hit a dead end.'
        ].join('\n\n'),
        link: '/help-desk',
        linkText: 'Open Help Desk'
    },
    {
        date: '2025-02-11',
        type: 'feature',
        title: 'Yetu Radio player rebuilt around listening, not decoration',
        description: 'The Yetu Radio page now remembers favorites, shares cleanly, and reads more clearly on phones.',
        text: [
            'The Yetu Radio player was overhauled to behave like a real listening tool instead of a static media block.',
            'We added favorite-state persistence through local storage, share actions that can use the Web Share API when available, and clearer “now playing” messaging tied to the time of day.',
            'We also tightened the mobile layout, simplified the status indicators, and made the frequency and coverage details easier to scan on smaller screens.'
        ].join('\n\n'),
        link: '/yetu-radio',
        linkText: 'Listen to Yetu Radio'
    },
    {
        date: '2025-02-11',
        type: 'feature',
        title: 'Weather page launched with live conditions and alert handling',
        description: 'Dzaleka now has a dedicated weather page that combines current conditions, seasonal context, and alerts in one place.',
        text: [
            'We published a weather page that pulls together current conditions, forecast information, and weather alert data for Dzaleka.',
            'The work was not just visual. We also documented the related API endpoints and built the page so it can fail more safely when the upstream source is unavailable.',
            'That gives visitors and staff a single reference point for practical weather checks instead of relying on scattered sources.'
        ].join('\n\n'),
        link: '/weather',
        linkText: 'View weather page'
    },
    {
        date: '2025-02-11',
        type: 'feature',
        title: 'Projects page now groups flagship initiatives in one archive',
        description: 'Key community and partner projects now live in a dedicated section instead of being scattered across the site.',
        text: [
            'We created a Projects section to pull major initiatives into one place, including work that has been recognized by MIT Solve and other partner networks.',
            'The page gives each project room for its own description, outcomes, and supporting context instead of burying that information in news posts or general landing pages.',
            'This makes the platform feel more like an archive of ongoing work, not just a collection of announcements.'
        ].join('\n\n'),
        link: '/projects',
        linkText: 'Browse projects'
    },
    {
        date: '2025-02-11',
        type: 'feature',
        title: 'API reference refreshed around the endpoints people actually use',
        description: 'The API documentation now points more directly to weather, analytics, and collection endpoints already running on the site.',
        text: [
            'We revised the API reference so developers can see the live endpoint structure more quickly, with clearer examples for weather, weather alerts, and analytics pageviews.',
            'This update also aligns the documentation more closely with the endpoints already exposed by the platform instead of describing the API in abstract terms.',
            'The result is a better handoff between the public-facing site and anyone trying to reuse the data behind it.'
        ].join('\n\n'),
        link: '/api-docs',
        linkText: 'Read API docs'
    },
    {
        date: '2025-02-10',
        type: 'feature',
        title: 'Skills Exchange now surfaces direct matches by category',
        description: 'People offering and requesting skills can now be linked through a dedicated matches view instead of manual browsing alone.',
        text: [
            'We added a matching view to the Skills Exchange so offers and requests are grouped into more usable connections.',
            'Instead of making people scan long lists on their own, the new route highlights likely overlaps by category and helps users jump straight into the right cluster of profiles.',
            'It is a small structural change, but it makes the exchange feel more practical as a working tool.'
        ].join('\n\n'),
        link: '/skills-exchange/matches',
        linkText: 'See matches'
    },
    {
        date: '2025-02-08',
        type: 'data',
        title: 'Population figures and camp reference stats were refreshed',
        description: 'The site’s headline camp numbers were updated against late-2024 reporting instead of leaving older figures in circulation.',
        text: [
            'We refreshed the platform’s baseline Dzaleka figures using more recent reporting, including a total population estimate of 56,760 people.',
            'The update also restated the gender balance and the main nationality breakdown so the site’s core reference pages are working from the same frame of reference.',
            'This kind of maintenance is easy to ignore, but outdated numbers make the whole archive less trustworthy.'
        ].join('\n\n'),
        link: '/dashboard',
        linkText: 'Review platform data'
    },
    {
        date: '2025-02-07',
        type: 'announcement',
        title: 'A new community voice submission is waiting for editorial review',
        description: 'The editorial queue has a fresh community submission ready for checking, revision, or approval.',
        text: [
            'A new community voice entry has come into the review workflow.',
            'The update is here to flag editorial attention rather than celebrate a launch: someone needs to review the submission, decide whether it is ready, and request changes if the draft still needs work.',
            'Keeping this visible in the updates feed makes the editorial queue feel like part of the living site, not a hidden back-office task.'
        ].join('\n\n'),
        link: '/community-voices',
        linkText: 'View community voices'
    },
    {
        date: '2025-02-05',
        type: 'announcement',
        title: 'Job board received new listings and a cleaner handoff to applicants',
        description: 'Fresh openings were added to the jobs page, including practical roles users can act on immediately.',
        text: [
            'We refreshed the jobs area with new listings, including operational roles such as a driver position.',
            'This is a straightforward content update, but it matters because jobs are one of the most action-oriented parts of the platform and stale listings make the page feel abandoned fast.',
            'The update keeps the board looking active and gives users a clearer next step when they visit the site for opportunity-finding rather than browsing.'
        ].join('\n\n'),
        link: '/jobs',
        linkText: 'View jobs'
    },
    {
        date: '2025-02-04',
        type: 'improvement',
        title: 'API docs and export routes were tightened up together',
        description: 'The export and reference work now reads as one system instead of separate technical notes.',
        text: [
            'We cleaned up the API documentation and related export behavior so the public reference matches the way the site actually serves data.',
            'That included clearer endpoint descriptions, better error handling language, and a more usable explanation of what developers can expect from collection-based routes.',
            'The goal here was not to sound more technical; it was to make the platform easier to work with when someone needs the data behind the interface.'
        ].join('\n\n'),
        link: '/docs/api-reference',
        linkText: 'Open documentation'
    },
    {
        date: '2025-02-03',
        type: 'improvement',
        title: 'What’s New widget added to make site changes easier to notice',
        description: 'Recent platform changes now surface in a compact widget instead of disappearing into the background.',
        text: [
            'We added a lightweight What’s New widget so recent platform changes can appear across the site without forcing people to visit the full updates archive first.',
            'The purpose is simple: make active maintenance visible, especially when the changes are small but meaningful.',
            'This turns the updates log into a living part of the site’s interface rather than a page only staff ever open.'
        ].join('\n\n'),
        link: '/updates/1',
        linkText: 'View all updates'
    },
    {
        date: '2025-02-02',
        type: 'feature',
        title: 'Emergency application flow was added for urgent requests',
        description: 'The platform now includes a dedicated route for urgent assistance applications instead of forcing them through general forms.',
        text: [
            'We launched an emergency application path for requests that should not be buried inside general-purpose site forms.',
            'This separates urgent assistance traffic from routine submissions and gives the platform a clearer way to signal priority when something time-sensitive comes in.',
            'It is the kind of change users may only notice when they need it, which is exactly why it needs to be structured well.'
        ].join('\n\n')
    }
];
