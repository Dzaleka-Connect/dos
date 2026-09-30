// Collections the CMS defines and can export. The seed creates all of them.
export const cmsCollections = ['news', 'events', 'jobs'];

// Collections the websites read from the CMS. Add a collection here only after
// its content has been imported on cms.dzaleka.com; until then it stays on Markdown.
export const liveCollections = ['news'];

export const isLive = name => liveCollections.includes(name);
export const isCmsCollection = name => cmsCollections.includes(name);
