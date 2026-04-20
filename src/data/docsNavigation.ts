export const docsGroups = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    description: 'Start here if you are new to the platform.',
    items: ['getting-started', 'platform-features', 'about'],
  },
  {
    id: 'community',
    title: 'Community',
    description: 'Stories, events, jobs, and community participation.',
    items: ['community-voice', 'community-events', 'community-resources', 'jobs', 'news'],
  },
  {
    id: 'services',
    title: 'Services',
    description: 'Service access, provider guidance, and skills exchange.',
    items: ['using-services', 'service-providers', 'skills-exchange', 'visit'],
  },
  {
    id: 'help',
    title: 'Help & Support',
    description: 'Support routes, search help, and common questions.',
    items: ['support', 'search', 'faq'],
  },
  {
    id: 'platform',
    title: 'Platform & Builders',
    description: 'How the platform is structured and how developers, agents, and integrators should approach it.',
    items: ['documentation-roadmap', 'platform-principles', 'api-reference', 'agent-access-guide', 'dzdk-cli'],
  },
  {
    id: 'policies',
    title: 'Policies & Contribution',
    description: 'Privacy, publishing expectations, and how to maintain documentation.',
    items: ['privacy-terms', 'privacy-guidelines', 'contribute', 'documentation-contributions', 'photo-gallery'],
  },
] as const;

export function groupDocs(docs) {
  return docsGroups.map((group) => ({
    ...group,
    items: group.items
      .map((slug) => docs.find((doc) => doc.id === slug))
      .filter(Boolean),
  }));
}

export function getDocGroup(docId: string) {
  return docsGroups.find((group) => group.items.includes(docId));
}

export function getRelatedDocs(docs, docId: string) {
  const currentGroup = getDocGroup(docId);
  if (!currentGroup) {
    return [];
  }

  return currentGroup.items
    .filter((slug) => slug !== docId)
    .map((slug) => docs.find((doc) => doc.id === slug))
    .filter(Boolean);
}
