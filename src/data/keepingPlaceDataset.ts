import rawOsmPoints from './dzalekaOsmPoints.json';

export type CulturalProtocolLevel = 'public' | 'community' | 'restricted';

export type RecordCategory = 
  | 'cultural_site' 
  | 'land_tenement' 
  | 'heritage_survey' 
  | 'oral_history' 
  | 'public_service' 
  | 'archival_document';

export interface RelationshipLink {
  id: string;
  title: string;
  type: 'survey' | 'story' | 'document' | 'custodian' | 'boundary';
  summary: string;
  url?: string;
  publisher?: string;
  date?: string;
}

export interface SpatialBoundary {
  type: 'Polygon';
  coordinates: [number, number][];
}

export interface KeepingPlaceRecord {
  id: string;
  referenceId?: string;
  name: string;
  category: RecordCategory;
  categoryLabel: string;
  protocol: CulturalProtocolLevel;
  protocolBadge: string;
  protocolDescription: string;
  lat: number;
  lng: number;
  zone: string;
  custodian: string;
  surveyDate: string;
  summary: string;
  detailedDescription: string;
  academicNotes?: string;
  capacityOrStats?: string;
  boundary?: SpatialBoundary;
  relationships: RelationshipLink[];
  tags: string[];
  encyclopediaSlug?: string;
  siteRegisterSlug?: string;
}

// Deep enriched facts for verified key entities matching Site Register (/site-register) and Encyclopedia
const DEEP_ENTITY_RECORDS: Record<string, Partial<KeepingPlaceRecord>> = {
  'prison': {
    name: 'The Old Dzaleka Maximum Security Prison Site',
    referenceId: 'DZK-001',
    category: 'cultural_site',
    categoryLabel: 'Historical Prison Heritage',
    protocol: 'public',
    protocolBadge: 'Public Historical Record',
    protocolDescription: 'Community heritage site inscribed on the Dzaleka Site Register (Ref: DZK-001).',
    zone: 'Original Encampment Footprint',
    custodian: 'Malawi Government & Dzaleka Cultural Heritage Council',
    capacityOrStats: 'Originally built in 1964 as a maximum-security political prison footprint holding up to 10,000 political detainees; handed over in 1994 to establish Dzaleka Refugee Camp.',
    detailedDescription: 'The entire physical footprint of Dzaleka Refugee Camp was established in 1964 as a maximum-security political prison under President Dr. Hastings Kamuzu Banda. Named "N\'dzaleka" ("I will never do it again"), the prison encompassed the entire initial 0.74 km² camp perimeter until 1994 when it was closed down and repurposed by UNHCR.',
    academicNotes: 'Inscribed on the Dzaleka Site Register under Significance Criteria: Historical Witness, Community Memory, Political Heritage.',
    siteRegisterSlug: 'dzaleka-historical-prison',
    encyclopediaSlug: 'history-of-dzaleka',
    relationships: [
      { id: 'rel-pr1', title: 'Dzaleka Site Register Entry (DZK-001)', type: 'document', summary: 'Heritage inscription record and architectural history.', url: '/site-register/dzaleka-historical-prison', publisher: 'Dzaleka Heritage Board' },
      { id: 'rel-pr2', title: 'History of Dzaleka Encyclopedia Article', type: 'document', summary: 'Political transition from 1964 prison to 1994 refugee sanctuary.', url: '/encyclopedia/history-of-dzaleka' }
    ]
  },
  'dzaleka health centre': {
    name: 'Dzaleka Health Centre',
    referenceId: 'DZK-002',
    category: 'public_service',
    categoryLabel: 'Public Medical Facility',
    protocol: 'public',
    protocolBadge: 'Public Unrestricted',
    protocolDescription: 'Primary health facility data operated under Ministry of Health & UNHCR Memorandum of Understanding.',
    custodian: 'Malawi Ministry of Health & UNHCR Medical Wing',
    capacityOrStats: 'Catchment population: approx 86,000 people (~54,000 refugees + surrounding Dowa host community).',
    detailedDescription: 'Dzaleka Health Centre is the primary medical facility in the camp. Operates adult & pediatric outpatient care, HIV counseling/ART treatment, laboratory diagnostics, immunization, maternal antenatal/delivery care, and acute malnutrition management.',
    academicNotes: 'UNHCR August 2024 Fact Sheet & World Bank-UNHCR Joint Data Center Report (2026) document heavy workload expansion serving both refugee and Dowa District populations.',
    siteRegisterSlug: 'dzaleka-health-centre',
    encyclopediaSlug: 'dzaleka-health-centre',
    relationships: [
      { id: 'rel-h0', title: 'Site Register Entry (DZK-002)', type: 'document', summary: 'Community healthcare registry and facility specifications.', url: '/site-register/dzaleka-health-centre', publisher: 'Dzaleka Site Register' },
      { id: 'rel-h1', title: 'Dzaleka Health Centre Encyclopedia Entry', type: 'document', summary: 'Operational history, services, and capacity documentation.', url: '/encyclopedia/dzaleka-health-centre', publisher: 'Dzaleka Online Services Archive' },
      { id: 'rel-h2', title: 'MDHS 2024 Health & Nutrition Survey', type: 'survey', summary: 'Empirical health, nutrition, and malaria survey for Dowa District.', url: '/encyclopedia/maternal-health-and-malaria-mdhs-2024', publisher: 'Malawi Demographic and Health Survey' },
      { id: 'rel-h3', title: 'UNHCR August 2024 Malawi Fact Sheet', type: 'document', summary: 'Healthcare catchment statistics and partner support.', url: 'https://www.unhcr.org/sites/default/files/2024-11/Fact%20Sheet_Malawi_August%202024.pdf', publisher: 'UNHCR' }
    ]
  },
  'takenolab': {
    name: 'TakeNoLab Technology & Innovation Center',
    referenceId: 'DZK-003',
    category: 'cultural_site',
    categoryLabel: 'Innovation & Tech Education Hub',
    protocol: 'public',
    protocolBadge: 'Public Unrestricted',
    protocolDescription: 'Free refugee-founded tech school (Founded 2015 by Rémy Gakwaya). Inscribed DZK-003.',
    custodian: 'TakeNoLab Team & Deborah Ntakirutimana',
    capacityOrStats: 'Over 2,000 refugee and Malawian youth trained in programming and freelancing.',
    detailedDescription: 'TakeNoLab operates in the Katudza sector near the main gates of Dzaleka. Teaches computer programming, web development, and digital freelancing to refugees and host community members free of charge.',
    academicNotes: 'Profiled by the Wilson Center and Stammen (2025) as a prime model of digital "spatial relocation"—allowing youth to earn global remote income while transcending physical encampment boundaries.',
    siteRegisterSlug: 'takenolab',
    encyclopediaSlug: 'takenolab',
    relationships: [
      { id: 'rel-tk0', title: 'Dzaleka Site Register Record (DZK-003)', type: 'document', summary: 'Innovation hub registration and digital training assets.', url: '/site-register/takenolab' },
      { id: 'rel-tk1', title: 'TakeNoLab Encyclopedia Article', type: 'document', summary: 'Detailed history, leadership after 2022, and academic significance.', url: '/encyclopedia/takenolab' },
      { id: 'rel-tk2', title: 'Rémy Gakwaya Biography', type: 'story', summary: 'Founder profile and early coding education in Dzaleka.', url: '/encyclopedia/remy-gakwaya' },
      { id: 'rel-tk3', title: 'UNHCR Coding Feature: Refugees Learn to Code a New Future', type: 'document', summary: 'UNHCR global story on TakeNoLab digital education.', url: 'https://www.unhcr.org/news/stories/refugees-learn-code-new-future-malawi', publisher: 'UNHCR' }
    ]
  },
  'tumaini': {
    name: 'Tumaini Letu & Festival Grounds',
    referenceId: 'DZK-004',
    category: 'cultural_site',
    categoryLabel: 'Cultural & Performing Site',
    protocol: 'public',
    protocolBadge: 'Public Unrestricted',
    protocolDescription: 'Refugee-led cultural organization (Founded 2012 by Trésor Nzengu Mpauni / Menes la Plume). Inscribed DZK-004.',
    custodian: 'Tumaini Letu Council & Community Cultural Keepers',
    capacityOrStats: 'Recipient of the 2020 Sharjah International Award for Refugee Advocacy and 2018 World Bank Social Inclusion Award.',
    detailedDescription: 'Tumaini Letu ("Our Hope" in Swahili) stages the annual Tumaini Festival inside Dzaleka camp—widely recognized as the world\'s only arts festival hosted within a refugee camp. Combines music, poetry recitals, traditional theater, and artisan markets.',
    academicNotes: 'Academic research (Stammen 2025, University of Applied Sciences Erfurt; Makhumula 2019) analyzes Tumaini Letu\'s cultural events as spaces of refugee agency, spatial relocation, and counter-narratives against physical encampment.',
    siteRegisterSlug: 'tumaini-festival-grounds',
    encyclopediaSlug: 'tumaini-letu',
    relationships: [
      { id: 'rel-t0', title: 'Site Register Record (DZK-004)', type: 'document', summary: 'Festival grounds registration and cultural heritage listing.', url: '/site-register/tumaini-festival-grounds' },
      { id: 'rel-t1', title: 'Tumaini Letu Encyclopedia Entry', type: 'document', summary: 'Institutional overview and history of cultural programs.', url: '/encyclopedia/tumaini-letu', publisher: 'Dzaleka Online Services' },
      { id: 'rel-t2', title: 'Tumaini Festival BBC Documentary', type: 'document', summary: 'BBC broadcast coverage of refugee arts inside Dzaleka.', url: '/encyclopedia/tumaini-bbc-documentary', publisher: 'BBC / Tumaini Archive' },
      { id: 'rel-t3', title: 'Stammen (2025) Academic Master\'s Thesis', type: 'survey', summary: 'Research on agency through self- and community organization in Dzaleka.', url: 'https://www.db-thueringen.de/servlets/MCRFileNodeServlet/dbt_derivate_00069597/Stammen_Anna_Lena.pdf', publisher: 'University of Applied Sciences Erfurt' }
    ]
  },
  'salama africa': {
    name: 'Salama Africa Creative Centre',
    referenceId: 'DZK-005',
    category: 'cultural_site',
    categoryLabel: 'Cultural & Performing Site',
    protocol: 'public',
    protocolBadge: 'Public Unrestricted',
    protocolDescription: 'Youth arts and dance academy founded by Toussaint Farini Buunda. Inscribed DZK-005.',
    custodian: 'Salama Africa Team',
    capacityOrStats: 'Dozens of youth dance cohorts and music recording sessions.',
    detailedDescription: 'Salama Africa uses creative dance, hip-hop theater, traditional dance styles, and media production to empower youth, build mental health resilience, and bridge refugee-host community divides.',
    academicNotes: 'Featured in research on refugee youth cultural expressions and creative industry development.',
    siteRegisterSlug: 'salama-africa-creative-centre',
    encyclopediaSlug: 'salama-africa',
    relationships: [
      { id: 'rel-sa0', title: 'Site Register Record (DZK-005)', type: 'document', summary: 'Salama Africa Creative Centre heritage listing.', url: '/site-register/salama-africa-creative-centre' },
      { id: 'rel-sa1', title: 'Salama Africa Encyclopedia Entry', type: 'document', summary: 'Dance academy history and youth programs.', url: '/encyclopedia/salama-africa' },
      { id: 'rel-sa2', title: 'Toussaint Farini Buunda Profile', type: 'story', summary: 'Biography of founder and artistic director.', url: '/encyclopedia/toussaint-farini-buunda' }
    ]
  },
  'kibebe': {
    name: 'Kibebe Artisan Workspace',
    referenceId: 'DZK-009',
    category: 'cultural_site',
    categoryLabel: 'Social Enterprise & Craft Hub',
    protocol: 'public',
    protocolBadge: 'Public Unrestricted',
    protocolDescription: 'Fair-trade artisan craft workspace operated by There is Hope. Inscribed DZK-009.',
    custodian: 'Kibebe Artisans & There is Hope Malawi',
    capacityOrStats: 'Employs dozens of refugee and Malawian artisans producing ethical textiles and bags.',
    detailedDescription: 'Kibebe ("hug" in Swahili) is a fair-trade social enterprise workspace inside Dzaleka. Artisans craft handmade bags, home decor, and accessories from African wax print fabrics (Chitenje).',
    siteRegisterSlug: 'kibebe-artisan-workspace',
    encyclopediaSlug: 'there-is-hope-malawi',
    relationships: [
      { id: 'rel-kb0', title: 'Site Register Record (DZK-009)', type: 'document', summary: 'Kibebe Artisan Workspace registry listing.', url: '/site-register/kibebe-artisan-workspace' },
      { id: 'rel-kb1', title: 'There is Hope Malawi Encyclopedia Entry', type: 'document', summary: 'Parent NGO vocational & livelihood documentation.', url: '/encyclopedia/there-is-hope-malawi' }
    ]
  },
  'market': {
    name: 'Mardi Marché (Tuesday Market)',
    referenceId: 'DZK-010',
    category: 'cultural_site',
    categoryLabel: 'Commercial & Cultural Market',
    protocol: 'public',
    protocolBadge: 'Public Trade Area',
    protocolDescription: 'Primary weekly central market space in Dzaleka. Inscribed DZK-010.',
    custodian: 'Dzaleka Traders Association & Local Council',
    capacityOrStats: 'Hundreds of local vendor stalls operating weekly every Tuesday.',
    detailedDescription: 'Mardi Marché is the commercial heartbeat of Dzaleka. Traders from across Dowa District, Lilongwe, and the refugee community converge to sell produce, clothing, spices, household goods, and local food.',
    siteRegisterSlug: 'mardi-marche',
    relationships: [
      { id: 'rel-mm0', title: 'Site Register Record (DZK-010)', type: 'document', summary: 'Mardi Marché market registry listing.', url: '/site-register/mardi-marche' }
    ]
  },
  'there is hope': {
    name: 'There is Hope Malawi Campus',
    referenceId: 'DZK-011',
    category: 'public_service',
    categoryLabel: 'Vocational & Education Center',
    protocol: 'public',
    protocolBadge: 'Public Unrestricted',
    protocolDescription: 'NGO providing vocational training and university scholarships founded by Innocent Magambi. Inscribed DZK-011.',
    custodian: 'There is Hope Leadership Team',
    capacityOrStats: 'Over 500 vocational graduates and university scholarship recipients.',
    detailedDescription: 'Operates accredited vocational training workshops (carpentry, tailoring, bricklaying, mechanics) and awards university scholarships to refugee and Malawian students.',
    academicNotes: 'Featured in studies on economic self-reliance and education in refugee settings.',
    siteRegisterSlug: 'there-is-hope-campus',
    encyclopediaSlug: 'there-is-hope-malawi',
    relationships: [
      { id: 'rel-th0', title: 'Site Register Record (DZK-011)', type: 'document', summary: 'There is Hope Campus heritage registration.', url: '/site-register/there-is-hope-campus' },
      { id: 'rel-th1', title: 'There is Hope Malawi Entry', type: 'document', summary: 'Vocational courses and scholarship documentation.', url: '/encyclopedia/there-is-hope-malawi' },
      { id: 'rel-th2', title: 'Innocent Magambi Founder Biography', type: 'story', summary: 'Biography of founder Innocent Magambi.', url: '/encyclopedia/innocent-magambi' }
    ]
  },
  'filling station': {
    name: 'Dzaleka Filling Station & Commercial Hub',
    referenceId: 'DZK-013',
    category: 'cultural_site',
    categoryLabel: 'Commercial & Transport Landmark',
    protocol: 'public',
    protocolBadge: 'Public Commercial Landmark',
    protocolDescription: 'Primary community fuel station, motor vehicle service, and commercial transport landmark.',
    zone: 'Central Services Sector (Adjacent to Inua Advocacy)',
    custodian: 'Local Commercial Enterprise',
    capacityOrStats: 'Main fuel supplier, motorcycle taxi (boda-boda) assembly, and motor mechanics hub serving Dzaleka.',
    detailedDescription: 'Dzaleka Filling Station is a primary commercial landmark situated directly adjacent to Inua Advocacy (-13.6601, 33.86715). Serves as a key orientation landmark, fueling station for public transit buses, minibuses, motorcycle taxis, and vehicle repair services.',
    relationships: [
      { id: 'rel-fs1', title: 'Main Access Axis Survey', type: 'survey', summary: 'Commercial transport corridor survey and spatial mapping node.', publisher: 'Dzaleka Commercial Registry' }
    ]
  }
};

// Generate dataset combining 120+ OSM points with enriched deep entity records
export const KEEPING_PLACE_DATASET: KeepingPlaceRecord[] = (rawOsmPoints as any[]).map((pt) => {
  const lowerName = pt.name.toLowerCase();

  let matchedKey: string | undefined;
  for (const key of Object.keys(DEEP_ENTITY_RECORDS)) {
    if (lowerName.includes(key)) {
      matchedKey = key;
      break;
    }
  }

  const enriched = matchedKey ? DEEP_ENTITY_RECORDS[matchedKey] : {};

  let category: RecordCategory = enriched.category || 'public_service';
  if (!matchedKey) {
    if (pt.type === 'education') category = 'public_service';
    if (pt.type === 'culture') category = 'cultural_site';
    if (pt.type === 'market') category = 'cultural_site';
  }

  let protocol: CulturalProtocolLevel = enriched.protocol || 'public';
  let protocolBadge = enriched.protocolBadge || 'Public Unrestricted';
  let protocolDescription = enriched.protocolDescription || 'Verified open public facility data from OpenStreetMap dataset.';

  if (!matchedKey) {
    if (lowerName.includes('police') || lowerName.includes('unhcr') || lowerName.includes('immigration')) {
      protocol = 'restricted';
      protocolBadge = 'Restricted Legal Rights';
      protocolDescription = 'Administrative or protection facility; access is controlled by the operating agency.';
    } else if (lowerName.includes('customary') || lowerName.includes('land') || lowerName.includes('survey')) {
      protocol = 'community';
      protocolBadge = 'Community Access';
      protocolDescription = 'Community land & mapping registry data.';
    }
  }

  const defaultRelationships: RelationshipLink[] = [
    { 
      id: `rel-osm-${pt.id}`, 
      title: `OpenStreetMap GIS Audit (${pt.osmType.toUpperCase()} #${pt.osmId})`, 
      type: 'survey', 
      summary: `Verified spatial node at GPS coordinates ${pt.lat.toFixed(5)}, ${pt.lng.toFixed(5)}. Zone: ${pt.zone || 'Dzaleka Sector'}.`,
      publisher: 'OpenStreetMap Malawi Community'
    }
  ];

  return {
    id: pt.id,
    referenceId: enriched.referenceId,
    name: enriched.name || pt.name,
    category,
    categoryLabel: enriched.categoryLabel || pt.categoryLabel || 'Community Location',
    protocol,
    protocolBadge,
    protocolDescription,
    lat: pt.lat,
    lng: pt.lng,
    zone: pt.zone || 'Dzaleka Camp Sector',
    custodian: enriched.custodian || pt.operator || 'Dzaleka Community / NGO Partners',
    surveyDate: enriched.surveyDate || pt.surveyDate || 'Not recorded',
    summary: enriched.summary || pt.description || `Verified facility node in Dzaleka Refugee Camp (${pt.categoryLabel}).`,
    detailedDescription: enriched.detailedDescription || `${pt.name} is a verified spatial node recorded in Dzaleka Refugee Camp, Dowa District, Central Region, Malawi. Mapped under the Dzaleka OpenStreetMap project at GPS coordinates (${pt.lat}, ${pt.lng}).`,
    academicNotes: enriched.academicNotes,
    capacityOrStats: enriched.capacityOrStats,
    relationships: enriched.relationships ? [...enriched.relationships, ...defaultRelationships] : defaultRelationships,
    tags: enriched.tags || [pt.categoryLabel, pt.zone, pt.type].filter(Boolean),
    encyclopediaSlug: enriched.encyclopediaSlug,
    siteRegisterSlug: enriched.siteRegisterSlug
  };
});
