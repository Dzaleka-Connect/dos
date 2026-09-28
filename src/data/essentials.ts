export const guideLanguages = ['en', 'fr', 'sw', 'ny'] as const;
export type GuideLanguage = typeof guideLanguages[number];
export const guideVersion = '2026-09-28';
export const guideSite = 'https://services.dzaleka.com';
export const unhcrContact = {
  phone: '+265 1 772 155',
  phoneHref: 'tel:+2651772155',
  email: 'mlwli@unhcr.org',
  source: 'https://www.unhcr.org/where-we-work/countries/malawi',
};
const sectionRoutes = {
  services: '/services',
  prepare: '/services/about',
  language: '/languages',
  save: '/get-help-now',
};
export const guideSections = ['services', 'prepare', 'language', 'save'] as const;
type SectionKey = typeof guideSections[number];
interface GuideCopy {
  name: string;
  title: string;
  intro: string;
  languageLabel: string;
  download: string;
  downloadHint: string;
  print: string;
  contents: string;
  sections: Record<SectionKey, { title: string; body: string; link: string }>;
  officeTitle: string;
  officeNote: string;
  phone: string;
  email: string;
  source: string;
  checked: string;
  shortcuts: string;
  health: string;
  education: string;
  online: string;
  linksNote: string;
  correction: string;
}
export const essentials: Record<GuideLanguage, GuideCopy> = {
  en: {
    name: 'English', title: 'New to Dzaleka: essentials',
    intro: 'A short guide to finding services and useful contacts in Dzaleka. Save a copy to read without an internet connection.',
    languageLabel: 'Read in another language', download: 'Download the guide', downloadHint: 'Small HTML file. Open in a browser to read offline. Links need an internet connection.', print: 'Print this guide', contents: 'In this guide',
    sections: {
      services: { title: 'Find a service', body: 'Use the directory to find schools, healthcare and community organisations. Open a listing to see its location and the contact details provided.', link: 'Browse services' },
      prepare: { title: 'Before you visit', body: 'Check any published costs, opening hours, documents and appointment requirements. If a detail is missing, ask the provider. A listing does not guarantee that support is available.', link: 'About the directory' },
      language: { title: 'Say which language you need', body: 'Tell the organisation which language you prefer. Ask whether someone can help in that language. Languages offered vary between services.', link: 'Language information' },
      save: { title: 'Keep useful contacts', body: 'Keep important phone numbers and your documents somewhere safe. This guide is general information. For urgent support contacts, use the Get help now page.', link: 'Get help now' },
    },
    officeTitle: 'UNHCR Malawi office', officeNote: 'Public office contact for questions about UNHCR’s work in Malawi. This is not an emergency hotline.', phone: 'Phone', email: 'Email', source: 'Source: UNHCR Malawi', checked: 'Contact checked: 28 September 2026', shortcuts: 'Useful links', health: 'Find healthcare', education: 'Find schools and courses', online: 'Open the online guide', linksNote: 'Linked pages are in English unless another language is shown.', correction: 'Report a problem with this guide',
  },
  fr: {
    name: 'Français', title: 'Nouveau à Dzaleka : l’essentiel',
    intro: 'Un petit guide pour trouver des services et des contacts utiles à Dzaleka. Enregistrez une copie pour la lire sans connexion internet.',
    languageLabel: 'Lire dans une autre langue', download: 'Télécharger le guide', downloadHint: 'Petit fichier HTML. Ouvrez-le dans un navigateur pour le lire hors connexion. Les liens nécessitent une connexion internet.', print: 'Imprimer ce guide', contents: 'Dans ce guide',
    sections: {
      services: { title: 'Trouver un service', body: 'Consultez l’annuaire pour trouver des écoles, des services de santé et des organisations communautaires. Ouvrez une fiche pour voir l’adresse et les coordonnées indiquées.', link: 'Consulter l’annuaire' },
      prepare: { title: 'Avant de vous déplacer', body: 'Vérifiez les frais, les horaires, les documents et les conditions de rendez-vous indiqués. Si une information manque, demandez-la à l’organisation. Une fiche ne garantit pas qu’une aide est disponible.', link: 'À propos de l’annuaire' },
      language: { title: 'Indiquer la langue dont vous avez besoin', body: 'Dites à l’organisation quelle langue vous préférez. Demandez si quelqu’un peut vous aider dans cette langue. Les langues proposées varient selon les services.', link: 'Informations sur les langues' },
      save: { title: 'Conserver les contacts utiles', body: 'Gardez vos numéros de téléphone importants et vos documents en lieu sûr. Ce guide donne des informations générales. Pour les contacts d’aide urgente, consultez la page « Get help now ».', link: 'Contacts d’aide urgente' },
    },
    officeTitle: 'Bureau du HCR au Malawi', officeNote: 'Coordonnées publiques du bureau pour les questions sur le travail du HCR au Malawi. Ce numéro n’est pas une ligne d’urgence.', phone: 'Téléphone', email: 'Courriel', source: 'Source : HCR Malawi', checked: 'Coordonnées vérifiées le 28 septembre 2026', shortcuts: 'Liens utiles', health: 'Trouver des services de santé', education: 'Trouver des écoles et des cours', online: 'Ouvrir le guide en ligne', linksNote: 'Les pages liées sont en anglais, sauf si une autre langue est indiquée.', correction: 'Signaler un problème dans ce guide',
  },
  sw: {
    name: 'Kiswahili', title: 'Mgeni Dzaleka: taarifa muhimu',
    intro: 'Mwongozo mfupi wa kupata huduma na mawasiliano muhimu Dzaleka. Hifadhi nakala ili uisome bila intaneti.',
    languageLabel: 'Soma kwa lugha nyingine', download: 'Pakua mwongozo', downloadHint: 'Faili ndogo ya HTML. Ifungue kwenye kivinjari ili kuisoma bila intaneti. Viungo vinahitaji intaneti.', print: 'Chapisha mwongozo huu', contents: 'Katika mwongozo huu',
    sections: {
      services: { title: 'Tafuta huduma', body: 'Tumia orodha ya huduma kutafuta shule, huduma za afya na mashirika ya jamii. Fungua ukurasa wa huduma ili kuona eneo lake na mawasiliano yaliyowekwa.', link: 'Angalia huduma' },
      prepare: { title: 'Kabla ya kwenda', body: 'Angalia gharama, saa za kazi, nyaraka na masharti ya miadi yaliyotangazwa. Ikiwa taarifa haipo, uliza mtoa huduma. Kuorodheshwa kwa huduma hakuhakikishi kwamba msaada unapatikana.', link: 'Kuhusu orodha ya huduma' },
      language: { title: 'Sema lugha unayohitaji', body: 'Liambie shirika lugha unayopendelea. Uliza kama kuna mtu anayeweza kukusaidia kwa lugha hiyo. Lugha zinazotumika hutofautiana kati ya huduma.', link: 'Taarifa kuhusu lugha' },
      save: { title: 'Hifadhi mawasiliano muhimu', body: 'Hifadhi namba muhimu za simu na nyaraka zako mahali salama. Mwongozo huu unatoa taarifa za jumla. Kwa mawasiliano ya msaada wa haraka, fungua ukurasa wa “Get help now”.', link: 'Mawasiliano ya msaada wa haraka' },
    },
    officeTitle: 'Ofisi ya UNHCR Malawi', officeNote: 'Mawasiliano ya umma ya ofisi kwa maswali kuhusu kazi ya UNHCR nchini Malawi. Hii si namba ya dharura.', phone: 'Simu', email: 'Barua pepe', source: 'Chanzo: UNHCR Malawi', checked: 'Mawasiliano yalikaguliwa: 28 Septemba 2026', shortcuts: 'Viungo muhimu', health: 'Tafuta huduma za afya', education: 'Tafuta shule na kozi', online: 'Fungua mwongozo mtandaoni', linksNote: 'Kurasa zilizounganishwa ziko kwa Kiingereza isipokuwa lugha nyingine imeonyeshwa.', correction: 'Ripoti tatizo katika mwongozo huu',
  },
  ny: {
    name: 'Chichewa', title: 'Mwafika ku Dzaleka: zofunika kudziwa',
    intro: 'Buku lalifupi lokuthandizani kupeza ntchito zothandiza anthu ndi manambala ofunika ku Dzaleka. Sungani bukuli kuti muwerenge popanda intaneti.',
    languageLabel: 'Werengani m’chinenero china', download: 'Tsitsani bukuli', downloadHint: 'Fayilo yaing’ono ya HTML. Itseguleni mu pulogalamu yotsegulira masamba kuti muwerenge popanda intaneti. Maulalo amafunika intaneti.', print: 'Sindikizani bukuli', contents: 'Zomwe zili m’bukuli',
    sections: {
      services: { title: 'Pezani ntchito zothandiza anthu', body: 'Gwiritsani ntchito mndandanda kuti mupeze masukulu, ntchito zaumoyo ndi mabungwe a m’dera. Tsegulani tsamba la bungwe kuti muone komwe lili ndi njira zolumikizirana nalo.', link: 'Onani mndandanda wa ntchito' },
      prepare: { title: 'Musanapite', body: 'Onani ndalama zolipira, nthawi yogwira ntchito, zikalata zofunika ndi ngati muyenera kupangana nthawi yokumana. Ngati mfundo ina palibe, funsani bungwelo. Kukhala pa mndandandawu sikutsimikizira kuti thandizo lilipo.', link: 'Za mndandanda wa ntchito' },
      language: { title: 'Nenani chinenero chimene mukufuna', body: 'Uzani bungwelo chinenero chimene mumakonda kugwiritsa ntchito. Funsani ngati pali munthu amene angakuthandizeni m’chinenerocho. Zilankhulo zomwe zimagwiritsidwa ntchito zimasiyana pakati pa mabungwe.', link: 'Zambiri za zilankhulo' },
      save: { title: 'Sungani njira zolumikizirana', body: 'Sungani manambala ofunika ndi zikalata zanu pamalo otetezeka. Bukuli lili ndi mfundo zodziwitsa anthu. Kuti mupeze njira zopezera thandizo lachangu, tsegulani tsamba la “Get help now”.', link: 'Njira zopezera thandizo lachangu' },
    },
    officeTitle: 'Ofesi ya UNHCR ku Malawi', officeNote: 'Njira zolumikizirana ndi ofesi pa mafunso okhudza ntchito ya UNHCR ku Malawi. Nambalayi si ya thandizo ladzidzidzi.', phone: 'Foni', email: 'Imelo', source: 'Gwero: UNHCR Malawi', checked: 'Mfundo zolumikizirana zinaunikidwa: 28 Seputembala 2026', shortcuts: 'Maulalo othandiza', health: 'Pezani ntchito zaumoyo', education: 'Pezani masukulu ndi maphunziro', online: 'Tsegulani bukuli pa intaneti', linksNote: 'Masamba olumikizidwa ali m’Chingelezi pokhapokha ngati chinenero china chasonyezedwa.', correction: 'Nenani vuto limene lili m’bukuli',
  },
};
export function sectionsFor(language: GuideLanguage) {
  return guideSections.map(key => ({ id: key, ...essentials[language].sections[key], href: sectionRoutes[key] }));
}
