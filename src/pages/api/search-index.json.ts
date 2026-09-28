import { getCollection, getEntry } from 'astro:content';
import { essentials, guideLanguages } from '../../data/essentials';
import { curatedGrantsPrograms } from '../../data/grantsPrograms';
import { toolsLibrary, templatePath } from '../../utils/startupTemplates';

export const GET = async () => {
    // Fetch all collections
    const profiles = await getCollection('profiles');
    const services = await getCollection('services');
    const stories = await getCollection('stories');
    const events = await getCollection('events');
    const resources = await getCollection('resources');
    const communityVoices = await getCollection('community-voices');
    const news = await getCollection('news');
    const photos = await getCollection('photos');
    const jobs = await getCollection('jobs');
    const inspirationalStories = await getCollection('inspirational-stories');
    const encyclopedia = await getCollection('encyclopedia');
    const startupTemplates = await getCollection('startup-templates');

    // Fetch talents (data collection)
    let talents: any[] = [];
    try {
        const talentsData = await getEntry('talents', 'data/talents');
        if (talentsData && talentsData.data) {
            talents = talentsData.data.talents;
        }
    } catch (e) {
        console.error("Error fetching talents:", e);
    }

    // Map to search index format
    const searchIndex = [
        { title: toolsLibrary.title, description: toolsLibrary.description, type: 'Resource', category: 'Business planning', url: '/tools-and-templates', tags: ['tools', 'templates', 'worksheets'] },
        ...startupTemplates.map(item => ({
            title: item.data.title,
            description: item.data.description,
            type: 'Template',
            category: 'Business planning',
            url: templatePath(item.id),
            tags: ['business', 'worksheet', ...item.data.sections.map(section => section.title)],
        })),
        ...guideLanguages.map(lang => ({ title: essentials[lang].title, description: essentials[lang].intro, type: 'Guide', category: 'Newcomer essentials', url: `/essentials/${lang}`, tags: [essentials[lang].name, 'newcomer', 'offline', 'language'] })),
        { title: 'Accessibility', description: 'Reading options, accessibility limitations and how to report a barrier.', type: 'Guide', category: 'Website help', url: '/accessibility', tags: ['accessibility', 'easy read'] },
        { title: 'About the service directory', description: 'Service information, listing updates and provider confirmations.', type: 'Guide', category: 'Services', url: '/services/about', tags: ['directory', 'confirmation'] },
        ...curatedGrantsPrograms.map(item => ({
            title: item.title,
            description: item.summary,
            type: 'Opportunity',
            category: item.type,
            url: `/grants-and-programs/${item.slug}`,
            image: item.image?.src,
            tags: [...item.audience, item.organization],
        })),
        ...profiles.map(item => {
            const data = item.data as any;
            return {
                title: data.name,
                description: data.shortDescription || data.description,
                type: 'Profile',
                category: data.category || data.role || 'Member',
                url: `/skills-exchange/profile/${item.id}`,
                image: data.profileImage,
                tags: data.tags || []
            };
        }),
        ...services.map(item => ({
            title: item.data.title,
            description: item.data.description,
            type: 'Service',
            category: item.data.category,
            url: `/services/${item.id}`,
            image: item.data.logo || item.data.image,
            tags: item.data.tags || []
        })),
        ...stories.map(item => ({
            title: item.data.title,
            description: item.data.description,
            type: 'Story',
            category: 'Story',
            url: `/stories/${item.id}`,
            image: item.data.coverImage,
            tags: item.data.tags || []
        })),
        ...communityVoices.map(item => ({
            title: item.data.title,
            description: item.data.excerpt,
            type: 'Community Voice',
            category: item.data.category,
            url: `/community-voices/${item.id}`,
            image: item.data.image,
            tags: item.data.tags || []
        })),
        ...events.map(item => ({
            title: item.data.title,
            description: item.data.description,
            type: 'Event',
            category: item.data.category,
            url: `/events/${item.id}`,
            image: item.data.image,
            tags: item.data.tags || []
        })),
        ...resources.map(item => ({
            title: item.data.title,
            description: item.data.description,
            type: 'Resource',
            category: item.data.category,
            url: `/resources/${item.id}`,
            image: item.data.thumbnail,
            tags: item.data.tags || []
        })),
        ...news.map(item => ({
            title: item.data.title,
            description: item.data.description,
            type: 'News',
            category: item.data.category,
            url: `/news/${item.id}`,
            image: item.data.image,
            tags: item.data.tags || []
        })),
        ...photos.map(item => ({
            title: item.data.title,
            description: item.data.description,
            type: 'Photo',
            category: 'Gallery',
            url: `/photos/${item.id}`,
            image: item.data.image,
            tags: item.data.tags || []
        })),
        ...jobs.map(item => ({
            title: item.data.title,
            description: item.data.description,
            type: 'Job',
            category: item.data.category,
            url: `/jobs/${item.id}`,
            image: null, // Jobs usually don't have a main image in the list view
            tags: item.data.skills || []
        })),
        ...inspirationalStories.map(item => ({
            title: item.data.title,
            description: item.data.description,
            type: 'Inspirational Story',
            category: 'Story',
            url: `/inspirational-stories/${item.id}`,
            image: item.data.personImage,
            tags: item.data.tags || []
        })),
        ...encyclopedia.map(item => ({
            title: item.data.title,
            description: item.data.summary,
            type: 'Encyclopedia',
            category: item.data.category,
            url: `/encyclopedia/${item.id}`,
            image: item.data.image,
            tags: item.data.aliases || []
        })),
        ...talents.map((item: any, index: number) => ({
            title: item.name,
            description: item.bio || `${item.name} - ${item.category}`,
            type: 'Talent',
            category: item.category,
            url: `/talents`, // Talents usually live on a single page or modal
            image: item.profilePic,
            tags: []
        }))
    ];

    return new Response(JSON.stringify(searchIndex), {
        headers: {
            'Content-Type': 'application/json'
        }
    });
};
