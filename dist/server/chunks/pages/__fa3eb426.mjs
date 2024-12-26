/* empty css                            */import { A as AstroError, e as UnknownContentCollectionError, f as createComponent, r as renderUniqueStylesheet, g as renderScriptElement, h as createHeadAndContent, i as renderTemplate, j as renderComponent, u as unescapeHTML, k as createAstro, m as maybeRenderHead, l as addAttribute, F as Fragment, n as renderHead, o as renderSlot } from '../astro_80255e7d.mjs';
import 'clsx';
import { format } from 'date-fns';
import { prependForwardSlash } from '@astrojs/internal-helpers/path';

function createCollectionToGlobResultMap({
  globResult,
  contentDir
}) {
  const collectionToGlobResultMap = {};
  for (const key in globResult) {
    const keyRelativeToContentDir = key.replace(new RegExp(`^${contentDir}`), "");
    const segments = keyRelativeToContentDir.split("/");
    if (segments.length <= 1)
      continue;
    const collection = segments[0];
    collectionToGlobResultMap[collection] ??= {};
    collectionToGlobResultMap[collection][key] = globResult[key];
  }
  return collectionToGlobResultMap;
}
const cacheEntriesByCollection = /* @__PURE__ */ new Map();
function createGetCollection({
  contentCollectionToEntryMap,
  dataCollectionToEntryMap,
  getRenderEntryImport
}) {
  return async function getCollection(collection, filter) {
    let type;
    if (collection in contentCollectionToEntryMap) {
      type = "content";
    } else if (collection in dataCollectionToEntryMap) {
      type = "data";
    } else {
      console.warn(
        `The collection **${collection}** does not exist or is empty. Ensure a collection directory with this name exists.`
      );
      return;
    }
    const lazyImports = Object.values(
      type === "content" ? contentCollectionToEntryMap[collection] : dataCollectionToEntryMap[collection]
    );
    let entries = [];
    if (!(Object.assign({"BASE_URL":"/","MODE":"production","DEV":false,"PROD":true,"SSR":true,"SITE":undefined,"ASSETS_PREFIX":undefined},{_:process.env._,}))?.DEV && cacheEntriesByCollection.has(collection)) {
      entries = [...cacheEntriesByCollection.get(collection)];
    } else {
      entries = await Promise.all(
        lazyImports.map(async (lazyImport) => {
          const entry = await lazyImport();
          return type === "content" ? {
            id: entry.id,
            slug: entry.slug,
            body: entry.body,
            collection: entry.collection,
            data: entry.data,
            async render() {
              return render({
                collection: entry.collection,
                id: entry.id,
                renderEntryImport: await getRenderEntryImport(collection, entry.slug)
              });
            }
          } : {
            id: entry.id,
            collection: entry.collection,
            data: entry.data
          };
        })
      );
      cacheEntriesByCollection.set(collection, entries);
    }
    if (typeof filter === "function") {
      return entries.filter(filter);
    } else {
      return entries;
    }
  };
}
async function render({
  collection,
  id,
  renderEntryImport
}) {
  const UnexpectedRenderError = new AstroError({
    ...UnknownContentCollectionError,
    message: `Unexpected error while rendering ${String(collection)} \u2192 ${String(id)}.`
  });
  if (typeof renderEntryImport !== "function")
    throw UnexpectedRenderError;
  const baseMod = await renderEntryImport();
  if (baseMod == null || typeof baseMod !== "object")
    throw UnexpectedRenderError;
  const { default: defaultMod } = baseMod;
  if (isPropagatedAssetsModule(defaultMod)) {
    const { collectedStyles, collectedLinks, collectedScripts, getMod } = defaultMod;
    if (typeof getMod !== "function")
      throw UnexpectedRenderError;
    const propagationMod = await getMod();
    if (propagationMod == null || typeof propagationMod !== "object")
      throw UnexpectedRenderError;
    const Content = createComponent({
      factory(result, baseProps, slots) {
        let styles = "", links = "", scripts = "";
        if (Array.isArray(collectedStyles)) {
          styles = collectedStyles.map((style) => {
            return renderUniqueStylesheet(result, {
              type: "inline",
              content: style
            });
          }).join("");
        }
        if (Array.isArray(collectedLinks)) {
          links = collectedLinks.map((link) => {
            return renderUniqueStylesheet(result, {
              type: "external",
              src: prependForwardSlash(link)
            });
          }).join("");
        }
        if (Array.isArray(collectedScripts)) {
          scripts = collectedScripts.map((script) => renderScriptElement(script)).join("");
        }
        let props = baseProps;
        if (id.endsWith("mdx")) {
          props = {
            components: propagationMod.components ?? {},
            ...baseProps
          };
        }
        return createHeadAndContent(
          unescapeHTML(styles + links + scripts),
          renderTemplate`${renderComponent(
            result,
            "Content",
            propagationMod.Content,
            props,
            slots
          )}`
        );
      },
      propagation: "self"
    });
    return {
      Content,
      headings: propagationMod.getHeadings?.() ?? [],
      remarkPluginFrontmatter: propagationMod.frontmatter ?? {}
    };
  } else if (baseMod.Content && typeof baseMod.Content === "function") {
    return {
      Content: baseMod.Content,
      headings: baseMod.getHeadings?.() ?? [],
      remarkPluginFrontmatter: baseMod.frontmatter ?? {}
    };
  } else {
    throw UnexpectedRenderError;
  }
}
function isPropagatedAssetsModule(module) {
  return typeof module === "object" && module != null && "__astroPropagation" in module;
}

// astro-head-inject

const contentDir = '/src/content/';

const contentEntryGlob = /* #__PURE__ */ Object.assign({"/src/content/docs/events-guide.md": () => import('../events-guide_89555960.mjs'),"/src/content/docs/getting-started.md": () => import('../getting-started_aa65873e.mjs'),"/src/content/docs/photo-archive.md": () => import('../photo-archive_48d9a997.mjs'),"/src/content/docs/resources-guide.md": () => import('../resources-guide_9e46440c.mjs'),"/src/content/docs/services-directory.md": () => import('../services-directory_48645d20.mjs'),"/src/content/docs/services-guide.md": () => import('../services-guide_b9536504.mjs'),"/src/content/events/art-exhibition-2024.md": () => import('../art-exhibition-2024_12424c49.mjs'),"/src/content/events/cultural-dance-showcase.md": () => import('../cultural-dance-showcase_5e8ee7bf.mjs'),"/src/content/events/tumaini-festival-2023.md": () => import('../tumaini-festival-2023_2e7685f0.mjs'),"/src/content/events/world-refugee-day-2023.md": () => import('../world-refugee-day-2023_27bcaa84.mjs'),"/src/content/events/youth-empowerment-workshop-2024.md": () => import('../youth-empowerment-workshop-2024_a5c5e00c.mjs'),"/src/content/events/youth-tech-workshop-2024.md": () => import('../youth-tech-workshop-2024_09045503.mjs'),"/src/content/news/community-center-renovation.md": () => import('../community-center-renovation_0f43fd9c.mjs'),"/src/content/news/dzaleka-artisans-cooperative-launch.md": () => import('../dzaleka-artisans-cooperative-launch_34feed32.mjs'),"/src/content/news/tech-startup-success.md": () => import('../tech-startup-success_dc2c5d04.mjs'),"/src/content/pages/about.md": () => import('../about_010bca21.mjs'),"/src/content/pages/events.md": () => import('../events_456c3fbf.mjs'),"/src/content/pages/home.md": () => import('../home_1f123a19.mjs'),"/src/content/pages/virtual-tours.md": () => import('../virtual-tours_a0747d27.mjs'),"/src/content/photos/Andy.md": () => import('../Andy_7c98b96f.mjs'),"/src/content/photos/Junior-Mafia.md": () => import('../Junior-Mafia_16f607d3.mjs'),"/src/content/photos/La-Pearl-DJ.md": () => import('../La-Pearl-DJ_069f26bc.mjs'),"/src/content/photos/Learning-Against-All-Odds.md": () => import('../Learning-Against-All-Odds_57be9a76.mjs'),"/src/content/photos/Obadiah.md": () => import('../Obadiah_cc96bc12.mjs'),"/src/content/photos/Raymond.md": () => import('../Raymond_4256f5bd.mjs'),"/src/content/photos/Surviving-in-Dzaleka.md": () => import('../Surviving-in-Dzaleka_e76e1399.mjs'),"/src/content/photos/a-man-collecting-cardboard.md": () => import('../a-man-collecting-cardboard_4f80ce24.mjs'),"/src/content/photos/building-hope.md": () => import('../building-hope_9bc50d82.mjs'),"/src/content/photos/struggling-to-feed-a-community.md": () => import('../struggling-to-feed-a-community_e61b60ea.mjs'),"/src/content/photos/tumaini-festival-2023.md": () => import('../tumaini-festival-2023_6299ffc9.mjs'),"/src/content/resources/business-plan-template.md": () => import('../business-plan-template_70f5a263.mjs'),"/src/content/resources/cv-writing-guide.md": () => import('../cv-writing-guide_efb37693.mjs'),"/src/content/resources/digital-marketing-course.md": () => import('../digital-marketing-course_2f4cb242.mjs'),"/src/content/resources/glimpse-into-dzaleka-life.md": () => import('../glimpse-into-dzaleka-life_2df0244e.mjs'),"/src/content/resources/malawi-refugee-guide.md": () => import('../malawi-refugee-guide_2cf5ea1d.mjs'),"/src/content/resources/refugee-entrepreneurship-in-malawi-success-factors-and-job-creation-effects.md": () => import('../refugee-entrepreneurship-in-malawi-success-factors-and-job-creation-effects_bb1d915c.mjs'),"/src/content/resources/research-report-refugee-relocation-intentions.md": () => import('../research-report-refugee-relocation-intentions_ea69f0bc.mjs'),"/src/content/resources/tumaini-impact-2019.md": () => import('../tumaini-impact-2019_36d23b69.mjs'),"/src/content/resources/tumaini-impact-2020.md": () => import('../tumaini-impact-2020_88468882.mjs'),"/src/content/services/adai-circle.md": () => import('../adai-circle_7788d9ce.mjs'),"/src/content/services/dzaleka-art-project.md": () => import('../dzaleka-art-project_1be431d6.mjs'),"/src/content/services/dzaleka-blood-donors-services.md": () => import('../dzaleka-blood-donors-services_62cb8bd4.mjs'),"/src/content/services/dzaleka-community-radio.md": () => import('../dzaleka-community-radio_0d2e2f58.mjs'),"/src/content/services/dzaleka-connect.md": () => import('../dzaleka-connect_b07769d3.mjs'),"/src/content/services/dzaleka-digital-heritage.md": () => import('../dzaleka-digital-heritage_472a1dbf.mjs'),"/src/content/services/dzaleka-rising.md": () => import('../dzaleka-rising_4b072dc4.mjs'),"/src/content/services/dzaleka-watch.md": () => import('../dzaleka-watch_dad97865.mjs'),"/src/content/services/dzaleka-youth-organization.md": () => import('../dzaleka-youth-organization_ddf71fdf.mjs'),"/src/content/services/fountain-of-hope-africa.md": () => import('../fountain-of-hope-africa_c5bdef3e.mjs'),"/src/content/services/fraternity-without-borders.md": () => import('../fraternity-without-borders_687204a7.mjs'),"/src/content/services/inside-dzaleka.md": () => import('../inside-dzaleka_ba4534f1.mjs'),"/src/content/services/inua-advocacy.md": () => import('../inua-advocacy_91f14996.mjs'),"/src/content/services/jesuit-worldwide-learning.md": () => import('../jesuit-worldwide-learning_4c4570f0.mjs'),"/src/content/services/jrs-malawi.md": () => import('../jrs-malawi_89d97148.mjs'),"/src/content/services/kibebe.md": () => import('../kibebe_0acb3a79.mjs'),"/src/content/services/plan-international-malawi.md": () => import('../plan-international-malawi_f3c5156f.mjs'),"/src/content/services/refugee-led-organisation-network-malawi.md": () => import('../refugee-led-organisation-network-malawi_8a4f21e2.mjs'),"/src/content/services/rock-your-world.md": () => import('../rock-your-world_defd1895.mjs'),"/src/content/services/salama-africa.md": () => import('../salama-africa_8770ade8.mjs'),"/src/content/services/takenolab.md": () => import('../takenolab_ed14602b.mjs'),"/src/content/services/there-is-hope-malawi.md": () => import('../there-is-hope-malawi_4290daae.mjs'),"/src/content/services/tumaini-festival.md": () => import('../tumaini-festival_cbf3bec3.mjs'),"/src/content/services/tumaini-letu.md": () => import('../tumaini-letu_20cf8002.mjs'),"/src/content/services/umoja-hand-craft-project.md": () => import('../umoja-hand-craft-project_8832f561.mjs'),"/src/content/services/unhcr-malawi.md": () => import('../unhcr-malawi_8551c533.mjs'),"/src/content/services/vijanafrica.md": () => import('../vijanafrica_0313215a.mjs'),"/src/content/services/village-book-builders.md": () => import('../village-book-builders_a3f34c3c.mjs'),"/src/content/services/world-food-programme.md": () => import('../world-food-programme_dbba16d3.mjs'),"/src/content/services/wusc-malawi.md": () => import('../wusc-malawi_ecaa949d.mjs'),"/src/content/services/zawadie-solutions.md": () => import('../zawadie-solutions_771982e5.mjs')});
const contentCollectionToEntryMap = createCollectionToGlobResultMap({
	globResult: contentEntryGlob,
	contentDir,
});

const dataEntryGlob = /* #__PURE__ */ Object.assign({});
const dataCollectionToEntryMap = createCollectionToGlobResultMap({
	globResult: dataEntryGlob,
	contentDir,
});
createCollectionToGlobResultMap({
	globResult: { ...contentEntryGlob, ...dataEntryGlob },
	contentDir,
});

let lookupMap = {};
lookupMap = {"docs":{"type":"content","entries":{"getting-started":"/src/content/docs/getting-started.md","events-guide":"/src/content/docs/events-guide.md","services-directory":"/src/content/docs/services-directory.md","services-guide":"/src/content/docs/services-guide.md","resources-guide":"/src/content/docs/resources-guide.md","photo-archive":"/src/content/docs/photo-archive.md"}},"events":{"type":"content","entries":{"art-exhibition-2024":"/src/content/events/art-exhibition-2024.md","cultural-dance-showcase":"/src/content/events/cultural-dance-showcase.md","tumaini-festival-2023":"/src/content/events/tumaini-festival-2023.md","world-refugee-day-2023":"/src/content/events/world-refugee-day-2023.md","youth-empowerment-workshop-2024":"/src/content/events/youth-empowerment-workshop-2024.md","youth-tech-workshop-2024":"/src/content/events/youth-tech-workshop-2024.md"}},"news":{"type":"content","entries":{"community-center-renovation":"/src/content/news/community-center-renovation.md","dzaleka-artisans-cooperative-launch":"/src/content/news/dzaleka-artisans-cooperative-launch.md","tech-startup-success":"/src/content/news/tech-startup-success.md"}},"pages":{"type":"content","entries":{"about":"/src/content/pages/about.md","events":"/src/content/pages/events.md","home":"/src/content/pages/home.md","virtual-tours":"/src/content/pages/virtual-tours.md"}},"photos":{"type":"content","entries":{"andy":"/src/content/photos/Andy.md","junior-mafia":"/src/content/photos/Junior-Mafia.md","obadiah":"/src/content/photos/Obadiah.md","learning-against-all-odds":"/src/content/photos/Learning-Against-All-Odds.md","raymond":"/src/content/photos/Raymond.md","surviving-in-dzaleka":"/src/content/photos/Surviving-in-Dzaleka.md","a-man-collecting-cardboard":"/src/content/photos/a-man-collecting-cardboard.md","la-pearl-dj":"/src/content/photos/La-Pearl-DJ.md","building-hope":"/src/content/photos/building-hope.md","tumaini-festival-2023":"/src/content/photos/tumaini-festival-2023.md","struggling-to-feed-a-community":"/src/content/photos/struggling-to-feed-a-community.md"}},"resources":{"type":"content","entries":{"business-plan-template":"/src/content/resources/business-plan-template.md","cv-writing-guide":"/src/content/resources/cv-writing-guide.md","digital-marketing-course":"/src/content/resources/digital-marketing-course.md","glimpse-into-dzaleka-life":"/src/content/resources/glimpse-into-dzaleka-life.md","malawi-refugee-guide":"/src/content/resources/malawi-refugee-guide.md","refugee-entrepreneurship-in-malawi-success-factors-and-job-creation-effects":"/src/content/resources/refugee-entrepreneurship-in-malawi-success-factors-and-job-creation-effects.md","research-report-refugee-relocation-intentions":"/src/content/resources/research-report-refugee-relocation-intentions.md","tumaini-impact-2019":"/src/content/resources/tumaini-impact-2019.md","tumaini-impact-2020":"/src/content/resources/tumaini-impact-2020.md"}},"services":{"type":"content","entries":{"adai-circle":"/src/content/services/adai-circle.md","dzaleka-art-project":"/src/content/services/dzaleka-art-project.md","dzaleka-connect":"/src/content/services/dzaleka-connect.md","dzaleka-blood-donors-services":"/src/content/services/dzaleka-blood-donors-services.md","dzaleka-community-radio":"/src/content/services/dzaleka-community-radio.md","dzaleka-digital-heritage":"/src/content/services/dzaleka-digital-heritage.md","dzaleka-rising":"/src/content/services/dzaleka-rising.md","dzaleka-watch":"/src/content/services/dzaleka-watch.md","dzaleka-youth-organization":"/src/content/services/dzaleka-youth-organization.md","fountain-of-hope-africa":"/src/content/services/fountain-of-hope-africa.md","fraternity-without-borders":"/src/content/services/fraternity-without-borders.md","inside-dzaleka":"/src/content/services/inside-dzaleka.md","inua-advocacy":"/src/content/services/inua-advocacy.md","jesuit-worldwide-learning":"/src/content/services/jesuit-worldwide-learning.md","jrs-malawi":"/src/content/services/jrs-malawi.md","kibebe":"/src/content/services/kibebe.md","rock-your-world":"/src/content/services/rock-your-world.md","refugee-led-organisation-network-malawi":"/src/content/services/refugee-led-organisation-network-malawi.md","salama-africa":"/src/content/services/salama-africa.md","plan-international-malawi":"/src/content/services/plan-international-malawi.md","takenolab":"/src/content/services/takenolab.md","there-is-hope-malawi":"/src/content/services/there-is-hope-malawi.md","tumaini-letu":"/src/content/services/tumaini-letu.md","tumaini-festival":"/src/content/services/tumaini-festival.md","umoja-hand-craft-project":"/src/content/services/umoja-hand-craft-project.md","unhcr-malawi":"/src/content/services/unhcr-malawi.md","vijanafrica":"/src/content/services/vijanafrica.md","village-book-builders":"/src/content/services/village-book-builders.md","wusc-malawi":"/src/content/services/wusc-malawi.md","world-food-programme":"/src/content/services/world-food-programme.md","zawadie-solutions":"/src/content/services/zawadie-solutions.md"}}};

function createGlobLookup(glob) {
	return async (collection, lookupId) => {
		const filePath = lookupMap[collection]?.entries[lookupId];

		if (!filePath) return undefined;
		return glob[collection][filePath];
	};
}

const renderEntryGlob = /* #__PURE__ */ Object.assign({"/src/content/docs/events-guide.md": () => import('../events-guide_10ea6a09.mjs'),"/src/content/docs/getting-started.md": () => import('../getting-started_fddf4b1d.mjs'),"/src/content/docs/photo-archive.md": () => import('../photo-archive_bb7d8890.mjs'),"/src/content/docs/resources-guide.md": () => import('../resources-guide_ebd4431d.mjs'),"/src/content/docs/services-directory.md": () => import('../services-directory_8a2ae296.mjs'),"/src/content/docs/services-guide.md": () => import('../services-guide_7fe48b11.mjs'),"/src/content/events/art-exhibition-2024.md": () => import('../art-exhibition-2024_0cff9158.mjs'),"/src/content/events/cultural-dance-showcase.md": () => import('../cultural-dance-showcase_b33fa393.mjs'),"/src/content/events/tumaini-festival-2023.md": () => import('../tumaini-festival-2023_a79e83ed.mjs'),"/src/content/events/world-refugee-day-2023.md": () => import('../world-refugee-day-2023_b7c314b7.mjs'),"/src/content/events/youth-empowerment-workshop-2024.md": () => import('../youth-empowerment-workshop-2024_f889099f.mjs'),"/src/content/events/youth-tech-workshop-2024.md": () => import('../youth-tech-workshop-2024_bc99cc4d.mjs'),"/src/content/news/community-center-renovation.md": () => import('../community-center-renovation_85bcce4f.mjs'),"/src/content/news/dzaleka-artisans-cooperative-launch.md": () => import('../dzaleka-artisans-cooperative-launch_7a67eaa7.mjs'),"/src/content/news/tech-startup-success.md": () => import('../tech-startup-success_32e059a9.mjs'),"/src/content/pages/about.md": () => import('../about_ebccf0b3.mjs'),"/src/content/pages/events.md": () => import('../events_5aafdcac.mjs'),"/src/content/pages/home.md": () => import('../home_75f377c6.mjs'),"/src/content/pages/virtual-tours.md": () => import('../virtual-tours_4a8a8253.mjs'),"/src/content/photos/Andy.md": () => import('../Andy_8fcceeda.mjs'),"/src/content/photos/Junior-Mafia.md": () => import('../Junior-Mafia_3087931c.mjs'),"/src/content/photos/La-Pearl-DJ.md": () => import('../La-Pearl-DJ_cfdd2734.mjs'),"/src/content/photos/Learning-Against-All-Odds.md": () => import('../Learning-Against-All-Odds_954d6939.mjs'),"/src/content/photos/Obadiah.md": () => import('../Obadiah_75401e0a.mjs'),"/src/content/photos/Raymond.md": () => import('../Raymond_8f9459ab.mjs'),"/src/content/photos/Surviving-in-Dzaleka.md": () => import('../Surviving-in-Dzaleka_f545ee33.mjs'),"/src/content/photos/a-man-collecting-cardboard.md": () => import('../a-man-collecting-cardboard_790b939f.mjs'),"/src/content/photos/building-hope.md": () => import('../building-hope_02465477.mjs'),"/src/content/photos/struggling-to-feed-a-community.md": () => import('../struggling-to-feed-a-community_48b64ee4.mjs'),"/src/content/photos/tumaini-festival-2023.md": () => import('../tumaini-festival-2023_db19b31c.mjs'),"/src/content/resources/business-plan-template.md": () => import('../business-plan-template_a9315b97.mjs'),"/src/content/resources/cv-writing-guide.md": () => import('../cv-writing-guide_7d506a1c.mjs'),"/src/content/resources/digital-marketing-course.md": () => import('../digital-marketing-course_722c4631.mjs'),"/src/content/resources/glimpse-into-dzaleka-life.md": () => import('../glimpse-into-dzaleka-life_299d24c5.mjs'),"/src/content/resources/malawi-refugee-guide.md": () => import('../malawi-refugee-guide_96f729db.mjs'),"/src/content/resources/refugee-entrepreneurship-in-malawi-success-factors-and-job-creation-effects.md": () => import('../refugee-entrepreneurship-in-malawi-success-factors-and-job-creation-effects_26bcfb80.mjs'),"/src/content/resources/research-report-refugee-relocation-intentions.md": () => import('../research-report-refugee-relocation-intentions_8f9be1c6.mjs'),"/src/content/resources/tumaini-impact-2019.md": () => import('../tumaini-impact-2019_4e89b1b1.mjs'),"/src/content/resources/tumaini-impact-2020.md": () => import('../tumaini-impact-2020_74e4a2cf.mjs'),"/src/content/services/adai-circle.md": () => import('../adai-circle_8a41c656.mjs'),"/src/content/services/dzaleka-art-project.md": () => import('../dzaleka-art-project_a5a3df0a.mjs'),"/src/content/services/dzaleka-blood-donors-services.md": () => import('../dzaleka-blood-donors-services_100e3ace.mjs'),"/src/content/services/dzaleka-community-radio.md": () => import('../dzaleka-community-radio_2d310ab6.mjs'),"/src/content/services/dzaleka-connect.md": () => import('../dzaleka-connect_6d820c95.mjs'),"/src/content/services/dzaleka-digital-heritage.md": () => import('../dzaleka-digital-heritage_ad3d697a.mjs'),"/src/content/services/dzaleka-rising.md": () => import('../dzaleka-rising_86940739.mjs'),"/src/content/services/dzaleka-watch.md": () => import('../dzaleka-watch_b80a2711.mjs'),"/src/content/services/dzaleka-youth-organization.md": () => import('../dzaleka-youth-organization_b8376b0d.mjs'),"/src/content/services/fountain-of-hope-africa.md": () => import('../fountain-of-hope-africa_1a98addf.mjs'),"/src/content/services/fraternity-without-borders.md": () => import('../fraternity-without-borders_ea3ed940.mjs'),"/src/content/services/inside-dzaleka.md": () => import('../inside-dzaleka_edce176b.mjs'),"/src/content/services/inua-advocacy.md": () => import('../inua-advocacy_1ae9a45f.mjs'),"/src/content/services/jesuit-worldwide-learning.md": () => import('../jesuit-worldwide-learning_f37c24bf.mjs'),"/src/content/services/jrs-malawi.md": () => import('../jrs-malawi_a78625aa.mjs'),"/src/content/services/kibebe.md": () => import('../kibebe_ea1a6965.mjs'),"/src/content/services/plan-international-malawi.md": () => import('../plan-international-malawi_0ce15083.mjs'),"/src/content/services/refugee-led-organisation-network-malawi.md": () => import('../refugee-led-organisation-network-malawi_f6fbe516.mjs'),"/src/content/services/rock-your-world.md": () => import('../rock-your-world_f9fa109b.mjs'),"/src/content/services/salama-africa.md": () => import('../salama-africa_e3f07473.mjs'),"/src/content/services/takenolab.md": () => import('../takenolab_54246605.mjs'),"/src/content/services/there-is-hope-malawi.md": () => import('../there-is-hope-malawi_113a90d8.mjs'),"/src/content/services/tumaini-festival.md": () => import('../tumaini-festival_27a3d6ac.mjs'),"/src/content/services/tumaini-letu.md": () => import('../tumaini-letu_49e540b2.mjs'),"/src/content/services/umoja-hand-craft-project.md": () => import('../umoja-hand-craft-project_23593136.mjs'),"/src/content/services/unhcr-malawi.md": () => import('../unhcr-malawi_f074f093.mjs'),"/src/content/services/vijanafrica.md": () => import('../vijanafrica_16639e1f.mjs'),"/src/content/services/village-book-builders.md": () => import('../village-book-builders_afa3d139.mjs'),"/src/content/services/world-food-programme.md": () => import('../world-food-programme_545c2614.mjs'),"/src/content/services/wusc-malawi.md": () => import('../wusc-malawi_d85c9ae3.mjs'),"/src/content/services/zawadie-solutions.md": () => import('../zawadie-solutions_9a3dd081.mjs')});
const collectionToRenderEntryMap = createCollectionToGlobResultMap({
	globResult: renderEntryGlob,
	contentDir,
});

const getCollection = createGetCollection({
	contentCollectionToEntryMap,
	dataCollectionToEntryMap,
	getRenderEntryImport: createGlobLookup(collectionToRenderEntryMap),
});

const navigationLinks = [
  {
    href: "/",
    label: "Home",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
    </svg>`
  },
  {
    href: "/services",
    label: "Services",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
    </svg>`
  },
  {
    href: "/events",
    label: "Events",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
    </svg>`
  },
  {
    href: "/resources",
    label: "Resources",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
    </svg>`
  },
  {
    href: "/photos",
    label: "Photos",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
    </svg>`
  },
  {
    href: "/about",
    label: "About",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
    </svg>`
  },
  {
    href: "/contact",
    label: "Contact",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fill-rule="evenodd" d="M14.243 5.757a6 6 0 10-.986 9.284 1 1 0 111.087 1.678A8 8 0 1118 10a3 3 0 01-4.8 2.401A4 4 0 1114 10a1 1 0 102 0c0-1.537-.586-3.07-1.757-4.243zM12 10a2 2 0 10-4 0 2 2 0 004 0z" clip-rule="evenodd" />
    </svg>`
  }
];

const $$Astro$e = createAstro();
const $$Navigation = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$e, $$props, $$slots);
  Astro2.self = $$Navigation;
  const currentPath = Astro2.url.pathname;
  return renderTemplate`${maybeRenderHead()}<nav class="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200" data-astro-cid-jhityggu> <div class="container mx-auto px-4" data-astro-cid-jhityggu> <div class="flex items-center justify-between h-16" data-astro-cid-jhityggu> <!-- Logo --> <a href="/" class="flex items-center space-x-2" data-astro-cid-jhityggu> <span class="text-xl font-bold text-primary-600" data-astro-cid-jhityggu>Dzaleka Online Services</span> </a> <!-- Desktop Navigation --> <div class="hidden md:flex items-center space-x-1" data-astro-cid-jhityggu> ${navigationLinks.map(({ href, label, icon }) => renderTemplate`<a${addAttribute(href, "href")}${addAttribute([
    "flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-600",
    "hover:text-primary-600 hover:bg-primary-50 transition-colors opacity-70 hover:opacity-100",
    currentPath === href && "opacity-100 border-b-2 border-primary-600"
  ], "class:list")} data-astro-cid-jhityggu> ${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate`${unescapeHTML(icon)}` })} <span data-astro-cid-jhityggu>${label}</span> </a>`)} </div> <!-- Mobile Menu Button --> <button id="mobile-menu-button" class="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500" aria-expanded="false" data-astro-cid-jhityggu> <span class="sr-only" data-astro-cid-jhityggu>Open main menu</span> <svg class="block h-6 w-6" id="menu-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-jhityggu> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" data-astro-cid-jhityggu></path> </svg> <svg class="hidden h-6 w-6" id="close-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-jhityggu> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" data-astro-cid-jhityggu></path> </svg> </button> </div> </div> <!-- Mobile Menu --> <div class="hidden md:hidden" id="mobile-menu" data-astro-cid-jhityggu> <div class="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200" data-astro-cid-jhityggu> ${navigationLinks.map(({ href, label, icon }) => renderTemplate`<a${addAttribute(href, "href")}${addAttribute([
    "flex items-center space-x-2 px-3 py-4 rounded-md text-base font-medium transition-colors",
    currentPath === href ? "text-primary-600 bg-primary-50" : "text-gray-600 hover:bg-gray-50 hover:text-primary-600"
  ], "class:list")} data-astro-cid-jhityggu> ${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate`${unescapeHTML(icon)}` })} <span data-astro-cid-jhityggu>${label}</span> </a>`)} </div> </div> </nav>  `;
}, "/Users/bakari/Downloads/dzaleka heritage archive/src/components/ui/Navigation.astro", void 0);

const $$Footer = createComponent(($$result, $$props, $$slots) => {
  const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
  const links = {
    services: [
      { name: "Humanitarian Aid", href: "/services?category=Humanitarian+Aid" },
      { name: "Education", href: "/services?category=Education" },
      { name: "Health", href: "/services?category=Health" },
      { name: "Cultural", href: "/services?category=Cultural" },
      { name: "Youth", href: "/services?category=Youth" }
    ],
    about: [
      { name: "About Us", href: "/about" },
      { name: "Events", href: "/events" },
      { name: "Photo Gallery", href: "/photo-gallery" },
      { name: "Virtual Tours", href: "/virtual-tours" }
    ],
    contact: [
      { name: "Contact Us", href: "/contact" },
      { name: "Support", href: "/support" },
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" }
    ]
  };
  return renderTemplate`${maybeRenderHead()}<footer class="bg-white border-t mt-auto"> <div class="container mx-auto px-4 py-12"> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"> <!-- Brand --> <div> <h2 class="text-xl font-bold text-primary-600 mb-4">Dzaleka Digital Heritage</h2> <p class="text-gray-600 mb-4">
Preserving and celebrating the cultural heritage of Dzaleka Refugee Camp.
</p> </div> <!-- Services --> <div> <h3 class="font-semibold text-gray-900 mb-4">Services</h3> <ul class="space-y-2"> ${links.services.map((link) => renderTemplate`<li> <a${addAttribute(link.href, "href")} class="text-gray-600 hover:text-primary-600 transition-colors"> ${link.name} </a> </li>`)} </ul> </div> <!-- About --> <div> <h3 class="font-semibold text-gray-900 mb-4">About</h3> <ul class="space-y-2"> ${links.about.map((link) => renderTemplate`<li> <a${addAttribute(link.href, "href")} class="text-gray-600 hover:text-primary-600 transition-colors"> ${link.name} </a> </li>`)} </ul> </div> <!-- Contact --> <div> <h3 class="font-semibold text-gray-900 mb-4">Contact</h3> <ul class="space-y-2"> ${links.contact.map((link) => renderTemplate`<li> <a${addAttribute(link.href, "href")} class="text-gray-600 hover:text-primary-600 transition-colors"> ${link.name} </a> </li>`)} </ul> </div> </div> <div class="border-t mt-8 pt-8 text-center text-gray-600"> <p>&copy; ${currentYear} Heritage Archive. All rights reserved.</p> </div> </div> </footer>`;
}, "/Users/bakari/Downloads/dzaleka heritage archive/src/components/Footer.astro", void 0);

const $$Astro$d = createAstro();
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$d, $$props, $$slots);
  Astro2.self = $$Layout;
  const { title } = Astro2.props;
  return renderTemplate`<html lang="en"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="description" content="Dzaleka Online Services - Preserving Our Cultural Legacy"><title>${title} | Dzaleka Online Services</title>${renderHead()}</head> <body class="bg-gray-50"> ${renderComponent($$result, "Navigation", $$Navigation, {})} <main class="flex-grow"> ${renderSlot($$result, $$slots["default"])} </main> ${renderComponent($$result, "Footer", $$Footer, {})} </body></html>`;
}, "/Users/bakari/Downloads/dzaleka heritage archive/src/layouts/Layout.astro", void 0);

const $$Astro$c = createAstro();
const $$Badge = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$c, $$props, $$slots);
  Astro2.self = $$Badge;
  const {
    variant = "blue",
    size = "sm"
  } = Astro2.props;
  const variants = {
    blue: "bg-blue-100 text-blue-800",
    green: "bg-green-100 text-green-800"
  };
  const sizes = {
    sm: "text-sm px-2 py-1",
    md: "text-base px-3 py-1.5"
  };
  return renderTemplate`${maybeRenderHead()}<span${addAttribute([
    "rounded-full inline-block",
    variants[variant],
    sizes[size]
  ], "class:list")}> ${renderSlot($$result, $$slots["default"])} </span>`;
}, "/Users/bakari/Downloads/dzaleka heritage archive/src/components/ui/Badge.astro", void 0);

const $$Astro$b = createAstro();
const $$SocialLinks = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$b, $$props, $$slots);
  Astro2.self = $$SocialLinks;
  const {
    facebook,
    twitter,
    instagram,
    linkedin,
    whatsapp,
    email,
    website,
    className = "",
    showShare = false,
    title = "",
    url = ""
  } = Astro2.props;
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  return renderTemplate`${maybeRenderHead()}<div${addAttribute(`flex items-center gap-3 ${className}`, "class")}> ${facebook && renderTemplate`<a${addAttribute(facebook, "href")} target="_blank" rel="noopener noreferrer" class="text-gray-500 hover:text-primary-600 transition-colors" title="Facebook"> <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"> <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"></path> </svg> </a>`} ${twitter && renderTemplate`<a${addAttribute(twitter, "href")} target="_blank" rel="noopener noreferrer" class="text-gray-500 hover:text-primary-600 transition-colors" title="Twitter"> <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"> <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"></path> </svg> </a>`} ${instagram && renderTemplate`<a${addAttribute(instagram, "href")} target="_blank" rel="noopener noreferrer" class="text-gray-500 hover:text-primary-600 transition-colors" title="Instagram"> <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"> <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.897 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.897-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"></path> </svg> </a>`} ${linkedin && renderTemplate`<a${addAttribute(linkedin, "href")} target="_blank" rel="noopener noreferrer" class="text-gray-500 hover:text-primary-600 transition-colors" title="LinkedIn"> <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"> <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"></path> </svg> </a>`} ${website && renderTemplate`<a${addAttribute(website, "href")} target="_blank" rel="noopener noreferrer" class="text-gray-500 hover:text-primary-600 transition-colors" title="Website"> <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.693l-6.444-6.444a2 2 0 00-2.828 0 2 2 0 000 2.828l6.615 6.615a1.5 1.5 0 002.121.305v1a2 2 0 001 2h-1a2 2 0 01-2 2v1a2 2 0 01-2 2 2 2 0 01-2.693 2.693l6.615-6.615a2.5 2.5 0 000-3.536l-6.615-6.615a2 2 0 00-2.828 0 2 2 0 000 2.828l6.444 6.444a8 8 0 01-12.948 0l-1.486-1.486a10 10 0 01-4.757-4.757 10 10 0 014.757-4.757 10 10 0 014.757 4.757 10 10 0 01-4.757 4.757L3.055 11z"></path> </svg> </a>`} ${email && renderTemplate`<a${addAttribute(`mailto:${email}`, "href")} class="text-gray-500 hover:text-primary-600 transition-colors" title="Email"> <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"> <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"></path> </svg> </a>`} ${showShare && renderTemplate`<div class="ml-4 flex items-center gap-2"> <button class="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:text-primary-600 hover:bg-primary-50 transition-colors" title="Share on Twitter"${addAttribute(`window.open('https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}', '_blank')`, "onclick")}> <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"> <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"></path> </svg> </button> </div>`} </div>`;
}, "/Users/bakari/Downloads/dzaleka heritage archive/src/components/ui/SocialLinks.astro", void 0);

const $$Astro$a = createAstro();
const $$ResourceGrid = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$a, $$props, $$slots);
  Astro2.self = $$ResourceGrid;
  const { resources } = Astro2.props;
  const baseUrl = "https://dzaleka.org";
  function getCategoryColor(category) {
    const colors = {
      "Templates": "bg-blue-50 text-blue-700",
      "Guides": "bg-green-50 text-green-700",
      "Reports": "bg-purple-50 text-purple-700",
      "Documents": "bg-amber-50 text-amber-700",
      "Media": "bg-rose-50 text-rose-700",
      "Research & Report": "bg-purple-50 text-purple-700"
    };
    return colors[category] || "bg-gray-50 text-gray-700";
  }
  function getFileTypeColor(fileType) {
    const colors = {
      "pdf": "bg-red-50 text-red-700",
      "docx": "bg-blue-50 text-blue-700",
      "xlsx": "bg-green-50 text-green-700",
      "pptx": "bg-orange-50 text-orange-700",
      "mp4": "bg-purple-50 text-purple-700",
      "mp3": "bg-indigo-50 text-indigo-700",
      "jpg": "bg-pink-50 text-pink-700",
      "png": "bg-cyan-50 text-cyan-700"
    };
    return colors[fileType?.toLowerCase()] || "bg-gray-50 text-gray-700";
  }
  function formatDate(date) {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    }).format(date);
  }
  function getDownloadUrl(resource) {
    const downloadUrl = resource.data.downloadUrl;
    if (!downloadUrl)
      return null;
    if (downloadUrl.startsWith("http://") || downloadUrl.startsWith("https://")) {
      return downloadUrl;
    }
    return `/resources/pdf/${downloadUrl}`;
  }
  return renderTemplate`${maybeRenderHead()}<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3"> ${resources.map((resource) => {
    const downloadUrl = getDownloadUrl(resource);
    return renderTemplate`<article class="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col border border-gray-100"> <div class="relative"> ${resource.data.thumbnail ? renderTemplate`<div class="aspect-video w-full overflow-hidden"> <img${addAttribute(resource.data.thumbnail, "src")}${addAttribute(resource.data.title, "alt")} class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"> </div>` : renderTemplate`<div class="aspect-video w-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center"> <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path> </svg> </div>`} <div class="absolute top-4 right-4 flex gap-2"> ${resource.data.fileType && renderTemplate`<span${addAttribute(`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium shadow-sm ${getFileTypeColor(resource.data.fileType)}`, "class")}> ${resource.data.fileType} </span>`} </div> </div> <div class="p-6 flex-1"> <div class="flex items-start justify-between"> <div> <h3 class="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors"> ${resource.data.title} </h3> <span${addAttribute(`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium mt-2 ${getCategoryColor(resource.data.category)}`, "class")}> ${resource.data.category} </span> </div> ${resource.data.fileSize && renderTemplate`<span class="text-sm font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded-md"> ${resource.data.fileSize} </span>`} </div> <p class="mt-3 text-gray-600 text-sm line-clamp-2"> ${resource.data.description} </p> ${resource.data.author && renderTemplate`<p class="mt-4 text-sm text-gray-500 flex items-center"> <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path> </svg> ${resource.data.author} </p>`} ${resource.data.lastUpdated && renderTemplate`<p class="mt-1 text-sm text-gray-500 flex items-center"> <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path> </svg>
Updated ${formatDate(resource.data.lastUpdated)} </p>`} </div> <div class="p-6 pt-0 mt-auto space-y-4"> ${downloadUrl && renderTemplate`<div class="flex items-center justify-between"> <a${addAttribute(downloadUrl, "href")} class="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors w-full" download target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation();"> <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path> </svg>
Download
</a> </div>`} <div class="pt-4 border-t border-gray-100"> ${renderComponent($$result, "SocialLinks", $$SocialLinks, { "showShare": true, "title": resource.data.title, "url": `${baseUrl}${resource.data.resourceUrl || downloadUrl}` })} </div> </div> </article>`;
  })} </div>`;
}, "/Users/bakari/Downloads/dzaleka heritage archive/src/components/resources/ResourceGrid.astro", void 0);

const $$Astro$9 = createAstro();
const $$SearchBar = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$9, $$props, $$slots);
  Astro2.self = $$SearchBar;
  const {
    placeholder = "Search...",
    initialValue = "",
    section = "",
    fullWidth = false
  } = Astro2.props;
  const formAction = section === "search" ? "/search" : `/${section || ""}`;
  return renderTemplate`${maybeRenderHead()}<form${addAttribute(formAction, "action")} method="GET"${addAttribute([
    "relative",
    {
      "w-full max-w-2xl mx-auto": fullWidth,
      "w-full max-w-md": !fullWidth
    }
  ], "class:list")}> <div class="relative"> <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"> <svg class="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20"> <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"></path> </svg> </div> <input type="text" id="search-input" name="q"${addAttribute(initialValue, "value")} class="block w-full p-3 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-primary-500 focus:border-primary-500"${addAttribute(placeholder, "placeholder")} required minlength="2"> <button type="submit" class="absolute right-2 bottom-2 top-2 px-4 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300">
Search
</button> </div> </form> `;
}, "/Users/bakari/Downloads/dzaleka heritage archive/src/components/ui/SearchBar.astro", void 0);

const $$Astro$8 = createAstro();
const $$ResourcePagination = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$8, $$props, $$slots);
  Astro2.self = $$ResourcePagination;
  const { currentPage, totalPages, baseUrl } = Astro2.props;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  return renderTemplate`${maybeRenderHead()}<nav class="flex justify-center mt-8" aria-label="Pagination"> <ul class="inline-flex items-center -space-x-px"> <li> <a${addAttribute(currentPage > 1 ? `${baseUrl}${currentPage - 1}` : null, "href")}${addAttribute(`block px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 ${currentPage === 1 ? "cursor-not-allowed opacity-50" : ""}`, "class")}${addAttribute(currentPage === 1, "aria-disabled")}> <span class="sr-only">Previous</span> <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"> <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd"></path> </svg> </a> </li> ${pages.map((page) => renderTemplate`<li> <a${addAttribute(page === currentPage ? null : `${baseUrl}${page}`, "href")}${addAttribute(`px-3 py-2 leading-tight border border-gray-300 ${page === currentPage ? "text-primary-600 bg-primary-50 border-primary-300" : "text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700"}`, "class")}${addAttribute(page === currentPage ? "page" : null, "aria-current")}> ${page} </a> </li>`)} <li> <a${addAttribute(currentPage < totalPages ? `${baseUrl}${currentPage + 1}` : null, "href")}${addAttribute(`block px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 ${currentPage === totalPages ? "cursor-not-allowed opacity-50" : ""}`, "class")}${addAttribute(currentPage === totalPages, "aria-disabled")}> <span class="sr-only">Next</span> <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"> <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path> </svg> </a> </li> </ul> </nav>`;
}, "/Users/bakari/Downloads/dzaleka heritage archive/src/components/resources/ResourcePagination.astro", void 0);

const $$Astro$7 = createAstro();
async function getStaticPaths$2({ paginate }) {
  const resources = await getCollection("resources");
  const sortedResources = resources.sort((a, b) => {
    const dateA = new Date(a.data.lastUpdated || a.data.date || 0);
    const dateB = new Date(b.data.lastUpdated || b.data.date || 0);
    return dateB.getTime() - dateA.getTime();
  });
  return paginate(sortedResources, { pageSize: 9 });
}
const $$$2 = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$7, $$props, $$slots);
  Astro2.self = $$$2;
  const { page } = Astro2.props;
  const searchQuery = Astro2.url.searchParams.get("search") || "";
  let filteredResources = page.data;
  if (searchQuery) {
    filteredResources = page.data.filter(
      (resource) => resource.data.title.toLowerCase().includes(searchQuery.toLowerCase()) || resource.data.description.toLowerCase().includes(searchQuery.toLowerCase()) || resource.data.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }
  console.log("Filtered Resources:", filteredResources.map((resource) => ({
    title: resource.data.title,
    downloadUrl: resource.data.downloadUrl,
    resourceUrl: resource.data.resourceUrl,
    fileType: resource.data.fileType,
    fileSize: resource.data.fileSize
  })));
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Resource Hub" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="container mx-auto px-4 py-8"> <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8"> <h1 class="text-3xl font-bold text-gray-900">Resource Hub</h1> ${renderComponent($$result2, "SearchBar", $$SearchBar, { "placeholder": "Search resources...", "initialValue": searchQuery, "section": "resources" })} </div> ${filteredResources.length > 0 ? renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": ($$result3) => renderTemplate` ${renderComponent($$result3, "ResourceGrid", $$ResourceGrid, { "resources": filteredResources })} ${renderComponent($$result3, "ResourcePagination", $$ResourcePagination, { "currentPage": page.currentPage, "totalPages": page.lastPage, "baseUrl": "/resources/" })} ` })}` : renderTemplate`<div class="text-center py-12"> <h2 class="text-xl font-semibold text-gray-900 mb-2">No resources found</h2> <p class="text-gray-600">Try adjusting your search terms or browse all resources.</p> </div>`} </main> ` })}`;
}, "/Users/bakari/Downloads/dzaleka heritage archive/src/pages/resources/[...page].astro", void 0);

const $$file$2 = "/Users/bakari/Downloads/dzaleka heritage archive/src/pages/resources/[...page].astro";
const $$url$2 = "/resources/[...page]";

const ____page_$2 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$$2,
  file: $$file$2,
  getStaticPaths: getStaticPaths$2,
  url: $$url$2
}, Symbol.toStringTag, { value: 'Module' }));

const $$Astro$6 = createAstro();
const $$ServiceCard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$6, $$props, $$slots);
  Astro2.self = $$ServiceCard;
  const {
    title,
    description,
    category,
    featured,
    verified,
    href,
    email,
    phone,
    address,
    logo,
    socialMedia
  } = Astro2.props;
  function getCategoryColor(category2) {
    const colors = {
      "Cultural": "bg-rose-50 text-rose-700 border-rose-200",
      "Education": "bg-blue-50 text-blue-700 border-blue-200",
      "Youth": "bg-purple-50 text-purple-700 border-purple-200",
      "Entrepreneurship": "bg-emerald-50 text-emerald-700 border-emerald-200",
      "Health": "bg-teal-50 text-teal-700 border-teal-200",
      "Humanitarian Aid": "bg-amber-50 text-amber-700 border-amber-200",
      "Advocacy": "bg-red-50 text-red-700 border-red-200"
    };
    return colors[category2] || "bg-gray-50 text-gray-700 border-gray-200";
  }
  console.log("ServiceCard props for", title, ":", {
    socialMedia,
    hasWebsite: !!socialMedia?.website,
    websiteUrl: socialMedia?.website
  });
  return renderTemplate`${maybeRenderHead()}<article class="group relative bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden h-full flex flex-col border border-gray-100"> <div class="p-6 flex flex-col h-full"> <!-- Header --> <div class="flex items-start gap-4 mb-4"> <div class="relative w-20 h-20 flex-shrink-0 bg-gray-50 rounded-lg p-3 flex items-center justify-center border border-gray-100 group-hover:border-gray-200 transition-colors"> <img${addAttribute(logo || "/logos/default.png", "src")}${addAttribute(`${title} logo`, "alt")} class="w-full h-full object-contain" loading="lazy" onerror="this.src='/logos/default.png'; this.onerror=null;"> </div> <div class="flex-grow min-w-0 relative"> <div class="flex items-start justify-between"> <h3 class="text-xl font-bold text-gray-900 truncate mb-2 group-hover:text-primary-600 transition-colors pr-20"> ${title} </h3> ${featured && renderTemplate`<div class="absolute top-0 right-0"> <span class="inline-flex items-center px-2 py-1 text-xs font-medium bg-primary-50 text-primary-700 rounded-md">
Featured
</span> </div>`} </div> <span${addAttribute(`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${getCategoryColor(category)}`, "class")}> ${category} </span> ${verified && renderTemplate`<span class="ml-2 inline-flex items-center text-sm font-medium text-primary-600"> <svg class="w-4 h-4 mr-1" viewBox="0 0 20 20" fill="currentColor"> <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path> </svg>
Verified
</span>`} </div> </div> <!-- Description --> <p class="text-gray-600 text-sm mb-4 line-clamp-3"> ${description} </p> <!-- Contact Info --> <div class="mt-auto space-y-3"> ${(email || phone || address || socialMedia?.website) && renderTemplate`<div class="flex flex-col gap-2 text-sm text-gray-600"> ${socialMedia?.website && renderTemplate`<div class="flex items-center gap-2"> <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path> </svg> <a${addAttribute(socialMedia.website, "href")} target="_blank" rel="noopener noreferrer" class="hover:text-primary-600 transition-colors z-20" onclick="event.stopPropagation();"> ${new URL(socialMedia.website).hostname} </a> </div>`} ${email && renderTemplate`<div class="flex items-center gap-2"> <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"> <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path> <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path> </svg> <a${addAttribute(`mailto:${email}`, "href")} class="hover:text-primary-600 transition-colors z-20" onclick="event.stopPropagation();">${email}</a> </div>`} ${phone && renderTemplate`<div class="flex items-center gap-2"> <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"> <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path> </svg> <a${addAttribute(`tel:${phone}`, "href")} class="hover:text-primary-600 transition-colors z-20" onclick="event.stopPropagation();">${phone}</a> </div>`} ${address && renderTemplate`<div class="flex items-center gap-2"> <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"> <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path> </svg> <span>${address}</span> </div>`} </div>`} <!-- Social Links --> ${socialMedia && Object.values(socialMedia).some(Boolean) && renderTemplate`<div class="border-t border-gray-100 pt-3"> <div class="flex items-center justify-between"> ${renderComponent($$result, "SocialLinks", $$SocialLinks, { "facebook": socialMedia.facebook, "twitter": socialMedia.twitter, "instagram": socialMedia.instagram, "linkedin": socialMedia.linkedin, "website": socialMedia.website, "className": "justify-start" })} ${socialMedia.website && renderTemplate`<a${addAttribute(socialMedia.website, "href")} target="_blank" rel="noopener noreferrer" class="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700 group/link z-20" onclick="event.stopPropagation();">
Visit Website
<svg class="w-4 h-4 ml-1 transform transition-transform group-hover/link:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path> </svg> </a>`} </div> </div>`} </div> </div> <a${addAttribute(href, "href")} class="absolute inset-0 z-10"${addAttribute(`View details for ${title}`, "aria-label")}> <span class="sr-only">View details</span> </a> </article>`;
}, "/Users/bakari/Downloads/dzaleka heritage archive/src/components/ServiceCard.astro", void 0);

const $$Astro$5 = createAstro();
const $$ServiceStats = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$5, $$props, $$slots);
  Astro2.self = $$ServiceStats;
  const { stats } = Astro2.props;
  console.log("ServiceStats component received:", stats);
  return renderTemplate`${maybeRenderHead()}<div class="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6"> <div class="bg-white rounded-lg shadow-sm border border-gray-100 p-3"> <p class="text-xs font-medium text-gray-500 mb-1">Total Services</p> <p class="text-lg font-semibold text-gray-900">${stats?.total || 0}</p> </div> <div class="bg-white rounded-lg shadow-sm border border-gray-100 p-3"> <p class="text-xs font-medium text-gray-500 mb-1">Active</p> <p class="text-lg font-semibold text-gray-900">${stats?.active || 0}</p> </div> <div class="bg-white rounded-lg shadow-sm border border-gray-100 p-3"> <p class="text-xs font-medium text-gray-500 mb-1">Featured</p> <p class="text-lg font-semibold text-gray-900">${stats?.featured || 0}</p> </div> <div class="bg-white rounded-lg shadow-sm border border-gray-100 p-3"> <p class="text-xs font-medium text-gray-500 mb-1">Verified</p> <p class="text-lg font-semibold text-gray-900">${stats?.verified || 0}</p> </div> <div class="bg-white rounded-lg shadow-sm border border-gray-100 p-3"> <p class="text-xs font-medium text-gray-500 mb-1">Categories</p> <p class="text-lg font-semibold text-gray-900">${stats?.categories || 0}</p> </div> </div>`;
}, "/Users/bakari/Downloads/dzaleka heritage archive/src/components/services/ServiceStats.astro", void 0);

const $$Astro$4 = createAstro();
const $$ServicePagination = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$4, $$props, $$slots);
  Astro2.self = $$ServicePagination;
  const { currentPage, totalPages, urlCategory, searchQuery } = Astro2.props;
  function getPageUrl(pageNum) {
    const params = new URLSearchParams();
    if (urlCategory)
      params.set("category", urlCategory);
    if (searchQuery)
      params.set("search", searchQuery);
    const queryString = params.toString();
    const basePath = `/services/${pageNum}`;
    return queryString ? `${basePath}?${queryString}` : basePath;
  }
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  return renderTemplate`${maybeRenderHead()}<nav class="flex justify-center mt-8" aria-label="Pagination"> <ul class="inline-flex items-center -space-x-px"> ${currentPage > 1 && renderTemplate`<li> <a${addAttribute(getPageUrl(currentPage - 1), "href")} class="block px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700"> <span class="sr-only">Previous</span> <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"> <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd"></path> </svg> </a> </li>`} ${pages.map((page) => renderTemplate`<li> <a${addAttribute(getPageUrl(page), "href")}${addAttribute([
    "px-3 py-2 leading-tight border border-gray-300",
    page === currentPage ? "text-primary-600 bg-primary-50 border-primary-300 hover:bg-primary-100" : "text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700"
  ], "class:list")}${addAttribute(page === currentPage ? "page" : void 0, "aria-current")}> ${page} </a> </li>`)} ${currentPage < totalPages && renderTemplate`<li> <a${addAttribute(getPageUrl(currentPage + 1), "href")} class="block px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700"> <span class="sr-only">Next</span> <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"> <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path> </svg> </a> </li>`} </ul> </nav>`;
}, "/Users/bakari/Downloads/dzaleka heritage archive/src/components/services/ServicePagination.astro", void 0);

function sortServices(services, sortBy = "featured") {
  return [...services].sort((a, b) => {
    switch (sortBy) {
      case "featured":
        if (a.data.featured !== b.data.featured) {
          return a.data.featured ? -1 : 1;
        }
        return a.data.title.localeCompare(b.data.title);
      case "name":
        return a.data.title.localeCompare(b.data.title);
      case "newest":
        const dateA = new Date(a.data.lastUpdated || 0);
        const dateB = new Date(b.data.lastUpdated || 0);
        return dateB.getTime() - dateA.getTime();
      default:
        return 0;
    }
  });
}

function calculateServiceStats(services) {
  return {
    total: services.length,
    featured: services.filter((s) => s.data.featured).length,
    verified: services.filter((s) => s.data.verified).length,
    active: services.filter((s) => s.data.status !== "inactive").length,
    categories: new Set(services.map((s) => s.data.category)).size
  };
}

const $$Astro$3 = createAstro();
async function getStaticPaths$1({ paginate }) {
  const allServices = await getCollection("services");
  return paginate(allServices, { pageSize: 6 });
}
const $$$1 = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$$1;
  const { page } = Astro2.props;
  const allServices = await getCollection("services");
  const serviceStats = calculateServiceStats(allServices);
  console.log("Service stats:", serviceStats);
  const sortBy = Astro2.url.searchParams.get("sort") || "featured";
  const verifiedOnly = Astro2.url.searchParams.get("verified") === "true";
  let filteredServices = allServices;
  if (verifiedOnly) {
    filteredServices = filteredServices.filter((service) => service.data.verified);
  }
  const sortedServices = sortServices(filteredServices, sortBy);
  const itemsPerPage = 6;
  const totalItems = sortedServices.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const currentPage = page.currentPage;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedServices = sortedServices.slice(startIndex, endIndex);
  console.log("Paginated services:", paginatedServices.map((service) => ({
    title: service.data.title,
    socialMedia: service.data.socialMedia,
    hasWebsite: !!service.data.socialMedia?.website,
    websiteUrl: service.data.socialMedia?.website
  })));
  if (currentPage < 1) {
    return Astro2.redirect("/services");
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Service Directory" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main> <!-- Hero Section --> <div class="bg-gradient-to-r from-primary-600 to-primary-800 px-4 py-16"> <div class="max-w-3xl mx-auto text-center"> <h1 class="text-4xl font-bold text-white mb-4">Discover Local Services</h1> <p class="text-lg text-white/90 mb-8">
Find and connect with organizations and services in Dzaleka Refugee Camp
</p> </div> </div> <!-- Service Stats --> <div class="max-w-7xl mx-auto px-4 -mt-8"> ${renderComponent($$result2, "ServiceStats", $$ServiceStats, { "stats": serviceStats })} </div> <!-- Main Content --> <div class="max-w-7xl mx-auto px-4 py-12"> <div class="flex justify-between items-center mb-8"> <div> <p class="text-gray-600">
Showing ${startIndex + 1}-${endIndex} of ${totalItems} services
</p> </div> <!-- Filters --> <div class="flex items-center gap-4"> <label class="flex items-center"> <input type="checkbox"${addAttribute(verifiedOnly, "checked")} class="form-checkbox h-5 w-5 text-primary-600 rounded" onchange="window.location.href = new URL(window.location.href).searchParams.set('verified', this.checked).toString()"> <span class="ml-2 text-gray-700">Verified Only</span> </label> <select class="form-select rounded-lg border-gray-300" onchange="window.location.href = new URL(window.location.href).searchParams.set('sort', this.value).toString()"> <option value="featured"${addAttribute(sortBy === "featured", "selected")}>Featured First</option> <option value="name"${addAttribute(sortBy === "name", "selected")}>Name (A-Z)</option> <option value="newest"${addAttribute(sortBy === "newest", "selected")}>Recently Updated</option> </select> </div> </div> <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3"> ${paginatedServices.map((service) => {
    const socialMedia = service.data.socialMedia ? {
      ...service.data.socialMedia.facebook && { facebook: service.data.socialMedia.facebook },
      ...service.data.socialMedia.twitter && { twitter: service.data.socialMedia.twitter },
      ...service.data.socialMedia.instagram && { instagram: service.data.socialMedia.instagram },
      ...service.data.socialMedia.linkedin && { linkedin: service.data.socialMedia.linkedin },
      ...service.data.socialMedia.website && { website: service.data.socialMedia.website }
    } : void 0;
    return renderTemplate`${renderComponent($$result2, "ServiceCard", $$ServiceCard, { "title": service.data.title, "description": service.data.description, "category": service.data.category, "featured": service.data.featured, "verified": service.data.verified, "href": `/services/${service.slug}`, "email": service.data.contact?.email, "phone": service.data.contact?.phone, "address": service.data.location?.address, "logo": service.data.logo, "socialMedia": socialMedia })}`;
  })} </div> <!-- Pagination --> ${totalPages > 1 && renderTemplate`<div class="mt-12"> ${renderComponent($$result2, "ServicePagination", $$ServicePagination, { "currentPage": currentPage, "totalPages": totalPages, "baseUrl": `/services?${new URLSearchParams({
    ...verifiedOnly && { verified: "true" },
    ...sortBy !== "featured" && { sort: sortBy }
  }).toString()}` })} </div>`} </div> </main> ` })}`;
}, "/Users/bakari/Downloads/dzaleka heritage archive/src/pages/services/[...page].astro", void 0);

const $$file$1 = "/Users/bakari/Downloads/dzaleka heritage archive/src/pages/services/[...page].astro";
const $$url$1 = "/services/[...page]";

const ____page_$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$$1,
  file: $$file$1,
  getStaticPaths: getStaticPaths$1,
  url: $$url$1
}, Symbol.toStringTag, { value: 'Module' }));

const $$Astro$2 = createAstro();
const $$EventGrid = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$EventGrid;
  const { events } = Astro2.props;
  function formatLocation(location) {
    if (typeof location === "string")
      return location;
    return location.venue && location.city ? `${location.venue}, ${location.city}` : location.venue || location.city || "Location TBA";
  }
  return renderTemplate`${maybeRenderHead()}<div class="grid gap-6 md:grid-cols-2 xl:grid-cols-4"> ${events.map((event) => renderTemplate`<article class="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300"> <a${addAttribute(`/events/${event.slug}`, "href")} class="block"> <div class="aspect-w-16 aspect-h-9"> <img${addAttribute(event.data.image, "src")}${addAttribute(event.data.title, "alt")} class="w-full h-full object-cover"> <div class="absolute bottom-4 right-4"> ${renderComponent($$result, "Badge", $$Badge, { "variant": event.data.status === "upcoming" ? "blue" : "green" }, { "default": ($$result2) => renderTemplate`${event.data.category}` })} </div> </div> <div class="p-4"> <div class="flex items-center justify-between mb-2"> <time${addAttribute(event.data.date.toISOString(), "datetime")} class="text-sm text-gray-500"> ${format(event.data.date, "MMM d, yyyy")} </time> <span${addAttribute(["text-sm font-medium capitalize", {
    "text-blue-600": event.data.status === "upcoming",
    "text-gray-500": event.data.status === "past"
  }], "class:list")}> ${event.data.status} </span> </div> <h3 class="text-lg font-bold text-gray-900 mb-2">${event.data.title}</h3> <p class="text-gray-600 text-sm mb-4 line-clamp-2">${event.data.description}</p> <div class="flex items-center text-gray-500 mb-4"> <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"> <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path> </svg> <span>${formatLocation(event.data.location)}</span> </div> <div class="flex items-center justify-between"> <div class="flex items-center text-gray-500"> <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"> <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"></path> </svg> <span>${event.data.time}</span> </div> <div class="flex items-center"> <span class="text-sm font-medium text-primary-600 hover:text-primary-700">
Learn More →
</span> </div> </div> </div> </a> </article>`)} </div>`;
}, "/Users/bakari/Downloads/dzaleka heritage archive/src/components/events/EventGrid.astro", void 0);

const $$Astro$1 = createAstro();
const $$EventPagination = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$EventPagination;
  const { currentPage, totalPages, baseUrl } = Astro2.props;
  const maxPagesToShow = 5;
  const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
  const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
  const pageNumbers = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );
  return renderTemplate`${maybeRenderHead()}<nav class="flex justify-center space-x-2" aria-label="Pagination"> <!-- Previous Page --> ${currentPage > 1 && renderTemplate`<a${addAttribute(baseUrl(currentPage - 1), "href")} class="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50" aria-label="Previous page">
Previous
</a>`} <!-- Page Numbers --> <div class="hidden sm:flex sm:space-x-2"> ${startPage > 1 && renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate` <a${addAttribute(baseUrl(1), "href")} class="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
1
</a> ${startPage > 2 && renderTemplate`<span class="px-3 py-2 text-sm text-gray-500">...</span>`}` })}`} ${pageNumbers.map((pageNum) => renderTemplate`<a${addAttribute(baseUrl(pageNum), "href")}${addAttribute([
    "px-3 py-2 text-sm font-medium rounded-md",
    pageNum === currentPage ? "bg-primary-600 text-white border border-primary-600" : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
  ], "class:list")}${addAttribute(pageNum === currentPage ? "page" : void 0, "aria-current")}> ${pageNum} </a>`)} ${endPage < totalPages && renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate`${endPage < totalPages - 1 && renderTemplate`<span class="px-3 py-2 text-sm text-gray-500">...</span>`}<a${addAttribute(baseUrl(totalPages), "href")} class="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"> ${totalPages} </a> ` })}`} </div> <!-- Next Page --> ${currentPage < totalPages && renderTemplate`<a${addAttribute(baseUrl(currentPage + 1), "href")} class="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50" aria-label="Next page">
Next
</a>`} </nav>`;
}, "/Users/bakari/Downloads/dzaleka heritage archive/src/components/events/EventPagination.astro", void 0);

const $$Astro = createAstro();
async function getStaticPaths() {
  const allEvents = await getCollection("events");
  const itemsPerPage = 6;
  const totalPages = Math.ceil(allEvents.length / itemsPerPage);
  return Array.from({ length: totalPages }, (_, i) => ({
    params: { page: (i + 2).toString() }
    // Start from page 2
  }));
}
const $$ = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$;
  const { page } = Astro2.params;
  const currentPage = parseInt(page);
  const allEvents = await getCollection("events");
  const searchQuery = Astro2.url.searchParams.get("search")?.trim() || "";
  let filteredEvents = allEvents;
  if (searchQuery) {
    filteredEvents = allEvents.filter(
      (event) => event.data.title.toLowerCase().includes(searchQuery.toLowerCase()) || event.data.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }
  const sortedEvents = filteredEvents.sort((a, b) => {
    if (a.data.status !== b.data.status) {
      return a.data.status === "upcoming" ? -1 : 1;
    }
    return new Date(b.data.date).getTime() - new Date(a.data.date).getTime();
  });
  const itemsPerPage = 6;
  const totalItems = sortedEvents.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const validCurrentPage = Math.max(1, Math.min(currentPage, totalPages));
  const startIndex = (validCurrentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedEvents = sortedEvents.slice(startIndex, endIndex);
  if (currentPage < 2) {
    return Astro2.redirect("/events");
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Events" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="container mx-auto px-4 py-8"> <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8"> <h1 class="text-3xl font-bold text-gray-900">Events</h1> ${renderComponent($$result2, "SearchBar", $$SearchBar, { "placeholder": "Search events...", "initialValue": searchQuery, "section": "events" })} </div> <div class="mb-4"> <p class="text-gray-600"> ${totalItems === 0 ? `No events found ${searchQuery ? `matching "${searchQuery}"` : ""}` : `Showing ${startIndex + 1}-${endIndex} of ${totalItems} events
          ${searchQuery ? ` matching "${searchQuery}"` : ""}`} </p> </div> ${totalItems > 0 ? renderTemplate`${renderComponent($$result2, "EventGrid", $$EventGrid, { "events": paginatedEvents })}` : renderTemplate`<div class="text-center py-8"> <p class="text-gray-500">No events found. Try adjusting your search criteria.</p> </div>`} ${totalPages > 1 && renderTemplate`${renderComponent($$result2, "EventPagination", $$EventPagination, { "currentPage": validCurrentPage, "totalPages": totalPages, "searchQuery": searchQuery })}`} </main> ` })}`;
}, "/Users/bakari/Downloads/dzaleka heritage archive/src/pages/events/[...page].astro", void 0);

const $$file = "/Users/bakari/Downloads/dzaleka heritage archive/src/pages/events/[...page].astro";
const $$url = "/events/[...page]";

const ____page_ = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$,
  file: $$file,
  getStaticPaths,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

export { $$Layout as $, ____page_$2 as _, $$Badge as a, $$SearchBar as b, $$ResourceGrid as c, $$EventGrid as d, $$EventPagination as e, calculateServiceStats as f, getCollection as g, $$ServiceStats as h, $$ServiceCard as i, $$ServicePagination as j, ____page_$1 as k, ____page_ as l, sortServices as s };
