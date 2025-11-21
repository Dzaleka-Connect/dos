import { getCollection, getEntry } from 'astro:content';

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

    // Fetch talents (data collection)
    let talents = [];
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
        ...profiles.map(item => ({
            title: item.data.name,
            description: item.data.shortDescription || item.data.description,
            type: 'Profile',
            category: item.data.category || item.data.role || 'Member',
            url: `/skills-exchange/profile/${item.slug}`,
            image: item.data.profileImage,
            tags: item.data.tags || []
        })),
        ...services.map(item => ({
            title: item.data.title,
            description: item.data.description,
            type: 'Service',
            category: item.data.category,
            url: `/services/${item.slug}`,
            image: item.data.logo || item.data.image,
            tags: item.data.tags || []
        })),
        ...stories.map(item => ({
            title: item.data.title,
            description: item.data.description,
            type: 'Story',
            category: 'Story',
            url: `/stories/${item.slug}`,
            image: item.data.coverImage,
            tags: item.data.tags || []
        })),
        ...communityVoices.map(item => ({
            title: item.data.title,
            description: item.data.excerpt,
            type: 'Community Voice',
            category: item.data.category,
            url: `/community-voices/${item.slug}`,
            image: item.data.image,
            tags: item.data.tags || []
        })),
        ...events.map(item => ({
            title: item.data.title,
            description: item.data.description,
            type: 'Event',
            category: item.data.category,
            url: `/events/${item.slug}`,
            image: item.data.image,
            tags: item.data.tags || []
        })),
        ...resources.map(item => ({
            title: item.data.title,
            description: item.data.description,
            type: 'Resource',
            category: item.data.category,
            url: `/resources/${item.slug}`,
            image: item.data.thumbnail,
            tags: item.data.tags || []
        })),
        ...news.map(item => ({
            title: item.data.title,
            description: item.data.description,
            type: 'News',
            category: item.data.category,
            url: `/news/${item.slug}`,
            image: item.data.image,
            tags: item.data.tags || []
        })),
        ...photos.map(item => ({
            title: item.data.title,
            description: item.data.description,
            type: 'Photo',
            category: 'Gallery',
            url: `/photos/${item.slug}`,
            image: item.data.image,
            tags: item.data.tags || []
        })),
        ...jobs.map(item => ({
            title: item.data.title,
            description: item.data.description,
            type: 'Job',
            category: item.data.category,
            url: `/jobs/${item.slug}`,
            image: null, // Jobs usually don't have a main image in the list view
            tags: item.data.skills || []
        })),
        ...inspirationalStories.map(item => ({
            title: item.data.title,
            description: item.data.description,
            type: 'Inspirational Story',
            category: 'Story',
            url: `/inspirational-stories/${item.slug}`,
            image: item.data.personImage,
            tags: item.data.tags || []
        })),
        ...talents.map((item, index) => ({
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
