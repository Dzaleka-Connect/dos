import type { ServiceProvider } from '../types';

export const serviceProviders: ServiceProvider[] = [
  {
    id: 'jrs-malawi',
    name: 'JRS Malawi',
    category: 'Humanitarian Aid',
    description: 'Emergency assistance, education, and psychosocial support for refugees in Dzaleka Camp.',
    services: ['Emergency Assistance', 'Education', 'Psychosocial Support'],
    contact: {
      email: 'mwi.director@jrs.net',
      phone: '+265 1 471 102',
      website: 'https://jrs.net/en/country/malawi/',
      location: {
        address: 'Dzaleka Refugee Camp, Dowa District',
        coordinates: { lat: -13.7, lng: 33.9 }
      }
    },
    logo: '/logos/jrs.png'
  },
  {
    id: 'unhcr-malawi',
    name: 'UNHCR Malawi',
    category: 'Humanitarian Aid',
    description: 'UN Refugee Agency providing protection and humanitarian assistance in Malawi.',
    services: ['Protection', 'Humanitarian Assistance', 'Refugee Support'],
    contact: {
      email: 'mwili@unhcr.org',
      phone: '+265 1 771 027',
      website: 'https://www.unhcr.org/au/countries/malawi',
      location: {
        address: 'Lilongwe, Malawi',
        coordinates: { lat: -13.962612, lng: 33.774119 }
      }
    },
    logo: '/logos/unhcr.png'
  },
  {
    id: 'there-is-hope',
    name: 'There is Hope Malawi',
    category: 'Education',
    description: 'Education and vocational training for refugees and host communities.',
    services: ['Education', 'Vocational Training', 'Community Support'],
    contact: {
      email: 'comms@thereishopemalawi.org',
      phone: '+265 888 943949',
      website: 'https://thereishopemalawi.org/',
      location: {
        address: 'Dzaleka Refugee Camp',
        coordinates: { lat: -13.7, lng: 33.9 }
      }
    },
    logo: '/logos/there-is-hope.png'
  },
  {
    id: 'tumaini-letu',
    name: 'Tumaini Letu',
    category: 'Cultural',
    description: 'Cultural events and festivals promoting refugee talents and cultural exchange.',
    services: ['Cultural Events', 'Arts Programs', 'Community Building'],
    contact: {
      email: 'info@tumainiletu.org',
      phone: '+265 993 380983',
      website: 'https://tumainiletu.org/our_work/',
      location: {
        address: 'Dzaleka Refugee Camp',
        coordinates: { lat: -13.7, lng: 33.9 }
      }
    },
    logo: '/logos/tumaini.png'
  },
  {
    id: 'inua-advocacy',
    name: 'Inua Advocacy',
    category: 'Advocacy',
    description: 'Legal support and advocacy services for refugees in Malawi.',
    services: ['Legal Support', 'Advocacy', 'Rights Education'],
    contact: {
      email: 'info@inuaadvocacy.org',
      phone: '+265 882 717995',
      website: 'https://inuaadvocacy.org/',
      location: {
        address: 'Dzaleka Refugee Camp',
        coordinates: { lat: -13.7, lng: 33.9 }
      }
    },
    logo: '/logos/inua.png'
  }
];