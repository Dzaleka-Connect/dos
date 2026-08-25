/**
 * Match encyclopedia entries to ongoing reporting from the news and resources
 * collections.
 *
 * Three sources are matched, because the reporting a reader wants is spread
 * across all of them:
 *   - `dispatch`: the dzaleka.com community news feed, the main publication
 *     and the source of current local reporting
 *   - `resource`: the humanitarian record (UNHCR situation reports, WFP press
 *     releases), where a reader of the food security entry finds the ration story
 *   - `news`: this site's own announcements and community reporting
 *
 * Matching runs at build time over the content collections, so the sidebar
 * refreshes whenever new reporting is published and needs no per-entry
 * curation. `coverageTopics` in an entry's frontmatter steers it when the
 * automatic signals are not enough.
 *
 * Tags across these collections are sparse and inconsistently cased, so tags
 * alone are a weak signal and are scored as one input among several.
 */

export type CoverageKind = 'news' | 'resource' | 'dispatch';

export interface CoverageCandidate {
  id: string;
  title: string;
  description: string;
  date: Date;
  category?: string;
  tags?: string[];
  kind: CoverageKind;
  href: string;
  publisher?: string;
  /** True when the link leaves this site, e.g. an item from dzaleka.com. */
  external?: boolean;
}

export interface ScoredCoverage extends CoverageCandidate {
  score: number;
  /** Which signals fired, for debugging and for the tests. */
  matched: string[];
}

export interface EntryMatchInput {
  title: string;
  aliases?: string[];
  category: string;
  summary: string;
  /** Curated topic keywords from entry frontmatter. */
  coverageTopics?: string[];
  /** Entry type from frontmatter; controls how subject matching is applied. */
  entryType?: string;
}

/**
 * Entry types that describe a subject rather than a named thing.
 *
 * A topic entry ("Education in Dzaleka") is legitimately covered by any story
 * on that subject. An entry about a named thing (a person, an organisation, a
 * film) is not covered by generic subject news just because the categories
 * align, so subject matching is restricted to the types below.
 */
const SUBJECT_ENTRY_TYPES = new Set(['topic', 'overview']);

/** Words too common in this corpus to carry meaning on their own. */
const STOP_WORDS = new Set([
  'the', 'and', 'for', 'with', 'from', 'that', 'this', 'have', 'has', 'are', 'was', 'were',
  'their', 'they', 'not', 'but', 'its', 'all', 'can', 'who', 'how', 'why', 'what', 'when',
  'where', 'a', 'an', 'of', 'in', 'on', 'at', 'to', 'by', 'is', 'it', 'as', 'or', 'be',
  'dzaleka', 'camp', 'refugee', 'refugees', 'malawi', 'people', 'community', 'new', 'more',
  'about', 'into', 'over', 'than', 'other', 'also', 'some', 'these', 'those', 'which',
]);

const SCORE = {
  topicInTitle: 10,
  topicInTags: 7,
  topicInDescription: 4,
  entryTitleInTitle: 9,
  aliasInTitle: 6,
  keywordInTitle: 3,
  keywordInDescription: 1,
  /** Publisher-assigned category on the item, e.g. the feed's "Food Security". */
  categoryTag: 6,
  /** The same word merely appearing in the headline. Incidental, so weaker. */
  categoryInTitle: 2,
} as const;

/** Minimum score for an item to be shown. Keeps weak keyword noise out. */
export const MIN_COVERAGE_SCORE = 6;

/**
 * Keyword overlap alone is weak evidence: an entry whose summary mentions
 * "services" or "work" will brush against unrelated announcements. When no
 * strong signal fires (a curated topic, the entry title, or an alias) the
 * candidate must clear this higher bar instead.
 */
export const MIN_KEYWORD_ONLY_SCORE = 7;

/**
 * Phrases stripped from candidate text before keyword matching. The site's own
 * name appears in many of its announcement headlines and would otherwise match
 * any entry whose summary happens to mention services or work.
 */
const IGNORED_PHRASES = [
  'dzaleka online services',
  'dzaleka digital heritage',
  'dzaleka.com',
];

function stripIgnoredPhrases(value: string): string {
  let out = value.toLowerCase();
  for (const phrase of IGNORED_PHRASES) out = out.split(phrase).join(' ');
  return out;
}

function normalise(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9\s-]/g, ' ').replace(/\s+/g, ' ').trim();
}

/** Whole-word containment, so "aid" does not match "said". */
function containsPhrase(haystack: string, needle: string): boolean {
  const n = normalise(needle);
  if (!n) return false;
  const escaped = n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(^|\\s)${escaped}(\\s|$)`).test(normalise(haystack));
}

/** Content words from a phrase, minus stop words and very short tokens. */
export function keywordsFrom(text: string): string[] {
  return [
    ...new Set(
      normalise(text)
        .split(' ')
        .filter((w) => w.length > 3 && !STOP_WORDS.has(w))
    ),
  ];
}

/**
 * Encyclopedia categories map to the reporting that tends to be relevant.
 * A weak signal, used only to break ties.
 */
const CATEGORY_AFFINITY: Record<string, string[]> = {
  Health: ['health', 'nutrition', 'medical', 'clinic', 'disease', 'cholera', 'vaccination'],
  Education: ['education', 'school', 'student', 'scholarship', 'learning', 'training'],
  Infrastructure: ['water', 'sanitation', 'shelter', 'housing', 'energy', 'electricity', 'road'],
  Institution: ['organisation', 'organization', 'agency', 'partner', 'programme', 'program'],
  History: ['anniversary', 'history', 'archive'],
  Culture: ['festival', 'music', 'art', 'film', 'poetry', 'dance'],
  People: ['profile', 'story', 'interview'],
  Place: ['site', 'location', 'market', 'centre', 'center'],
};

/**
 * Score one candidate against an entry. Returns null when the candidate does
 * not clear MIN_COVERAGE_SCORE.
 */
export function scoreCandidate(
  entry: EntryMatchInput,
  candidate: CoverageCandidate
): ScoredCoverage | null {
  let score = 0;
  const matched: string[] = [];

  const title = candidate.title ?? '';
  const description = candidate.description ?? '';
  const tags = (candidate.tags ?? []).map((t) => normalise(String(t)));

  let strongSignal = false;

  for (const topic of entry.coverageTopics ?? []) {
    if (containsPhrase(title, topic)) {
      strongSignal = true;
      score += SCORE.topicInTitle;
      matched.push(`topic:${topic}:title`);
    } else if (tags.some((tag) => containsPhrase(tag, topic))) {
      // Whole-word containment, so the topic "food" matches a publisher tag of
      // "Food Security" while "water" still does not match "wastewater".
      strongSignal = true;
      score += SCORE.topicInTags;
      matched.push(`topic:${topic}:tag`);
    } else if (containsPhrase(description, topic)) {
      score += SCORE.topicInDescription;
      matched.push(`topic:${topic}:description`);
    }
  }

  if (containsPhrase(title, entry.title)) {
    strongSignal = true;
    score += SCORE.entryTitleInTitle;
    matched.push('entryTitle:title');
  }

  for (const alias of entry.aliases ?? []) {
    if (containsPhrase(title, alias)) {
      strongSignal = true;
      score += SCORE.aliasInTitle;
      matched.push(`alias:${alias}`);
      break;
    }
  }

  // Keyword overlap from the entry's own title and summary.
  const entryKeywords = new Set([
    ...keywordsFrom(entry.title),
    ...keywordsFrom(entry.summary),
  ]);
  const titleForKeywords = stripIgnoredPhrases(title);
  const descForKeywords = stripIgnoredPhrases(description);
  let titleHits = 0;
  let descHits = 0;
  for (const keyword of entryKeywords) {
    if (containsPhrase(titleForKeywords, keyword)) titleHits += 1;
    else if (containsPhrase(descForKeywords, keyword)) descHits += 1;
  }
  // Cap keyword contribution so a long summary cannot dominate curated topics.
  if (titleHits) {
    score += Math.min(titleHits, 3) * SCORE.keywordInTitle;
    matched.push(`keywords:title:${titleHits}`);
  }
  if (descHits) {
    score += Math.min(descHits, 3) * SCORE.keywordInDescription;
    matched.push(`keywords:description:${descHits}`);
  }

  // A publisher-assigned category is curated metadata, so treat it as a strong
  // signal. The dzaleka.com feed tags items "Education", "Food Security" and so
  // on, which maps cleanly onto encyclopedia categories.
  const isSubjectEntry = SUBJECT_ENTRY_TYPES.has(entry.entryType ?? 'topic');
  const affinity = CATEGORY_AFFINITY[entry.category] ?? [];
  const tagMatch = isSubjectEntry
    ? affinity.find((word) => tags.some((tag) => containsPhrase(tag, word)))
    : undefined;
  if (tagMatch) {
    strongSignal = true;
    score += SCORE.categoryTag;
    matched.push(`categoryTag:${tagMatch}`);
  } else if (isSubjectEntry && affinity.some((word) => containsPhrase(title, word))) {
    score += SCORE.categoryInTitle;
    matched.push('categoryTitle');
  }

  const threshold = strongSignal ? MIN_COVERAGE_SCORE : MIN_KEYWORD_ONLY_SCORE;
  if (score < threshold) return null;
  return { ...candidate, score, matched };
}

/**
 * Rank candidates for an entry, newest first within the same score so the
 * sidebar leads with current reporting rather than the strongest old match.
 */
export function rankCoverage(
  entry: EntryMatchInput,
  candidates: CoverageCandidate[],
  limit = 4
): ScoredCoverage[] {
  const scored = candidates
    .map((candidate) => scoreCandidate(entry, candidate))
    .filter((c): c is ScoredCoverage => c !== null);

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return b.date.getTime() - a.date.getTime();
  });

  // The same story is often both a dzaleka.com dispatch and an archived
  // resource. Keep the higher-scoring copy; on a tie the sort above has already
  // put the newer one first.
  const seen = new Set<string>();
  const deduped: ScoredCoverage[] = [];
  for (const item of scored) {
    const key = normalise(item.title);
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(item);
  }

  return deduped.slice(0, limit);
}
