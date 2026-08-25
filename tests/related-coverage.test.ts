import { describe, it, expect } from 'vitest';
import {
  MIN_COVERAGE_SCORE,
  keywordsFrom,
  rankCoverage,
  scoreCandidate,
  type CoverageCandidate,
  type EntryMatchInput,
} from '../src/utils/relatedCoverage';

const foodEntry: EntryMatchInput = {
  title: 'Food security and assistance',
  category: 'Health',
  entryType: 'topic',
  summary: 'The food and cash assistance system at Dzaleka and the effects of funding shortfalls.',
  coverageTopics: ['food', 'rations', 'WFP', 'food assistance', 'hunger'],
};

function candidate(over: Partial<CoverageCandidate> = {}): CoverageCandidate {
  return {
    id: 'x',
    title: 'A headline',
    description: 'A description',
    date: new Date('2026-01-01'),
    kind: 'news',
    href: '/news/x',
    ...over,
  };
}

describe('keyword extraction', () => {
  it('drops stop words and short tokens', () => {
    const words = keywordsFrom('The food and cash assistance system at Dzaleka');
    expect(words).toContain('food');
    expect(words).toContain('assistance');
    expect(words).not.toContain('the');
    expect(words).not.toContain('and');
    // "dzaleka" appears in nearly every item here, so it carries no signal.
    expect(words).not.toContain('dzaleka');
  });

  it('de-duplicates repeated words', () => {
    const words = keywordsFrom('funding funding funding shortfall');
    expect(words.filter((w) => w === 'funding')).toHaveLength(1);
  });
});

describe('scoring', () => {
  it('matches a curated topic in the headline', () => {
    const result = scoreCandidate(
      foodEntry,
      candidate({ title: 'Hunger worsens as food assistance faces cuts' })
    );
    expect(result).not.toBeNull();
    expect(result!.score).toBeGreaterThanOrEqual(MIN_COVERAGE_SCORE);
    expect(result!.matched.some((m) => m.startsWith('topic:'))).toBe(true);
  });

  it('matches a curated topic carried as a publisher tag', () => {
    const result = scoreCandidate(
      foodEntry,
      candidate({ title: 'COOM raises concern over funding cuts', tags: ['COOM', 'Food Security'] })
    );
    expect(result).not.toBeNull();
  });

  it('rejects an unrelated item', () => {
    expect(
      scoreCandidate(foodEntry, candidate({ title: 'New mural completed by visiting artists' }))
    ).toBeNull();
  });

  it('does not match a word inside a longer word', () => {
    // "aid" must not match "said", which whole-word matching prevents.
    const entry: EntryMatchInput = { ...foodEntry, coverageTopics: ['aid'] };
    expect(
      scoreCandidate(entry, candidate({ title: 'Resident said conditions are improving' }))
    ).toBeNull();
  });

  /**
   * The site's own name appears in many of its announcement headlines. Without
   * stripping it, any entry whose summary mentions "services" matched them.
   */
  it('ignores the site name when keyword matching', () => {
    const entry: EntryMatchInput = {
      title: 'Livelihoods and the local economy',
      category: 'Infrastructure',
      entryType: 'topic',
      summary: 'How residents earn income through trade, services, and creative work.',
    };
    const result = scoreCandidate(
      entry,
      candidate({ title: 'Sharing Your Story or Creative Work on Dzaleka Online Services' })
    );
    expect(result).toBeNull();
  });
});

describe('subject matching is limited to topic entries', () => {
  const topicEntry: EntryMatchInput = {
    title: 'Education in Dzaleka',
    category: 'Education',
    entryType: 'topic',
    summary: 'Schooling and learning across the camp.',
  };
  const namedEntry: EntryMatchInput = {
    title: 'TakenoLAB',
    category: 'Education',
    entryType: 'organization',
    summary: 'A refugee-led organisation running technology and skills programmes.',
  };
  const generalEducationStory = candidate({
    title: 'Student pursues university dream through scholarship',
    tags: ['Education', 'Scholarship'],
  });

  it('lets a topic entry match subject news by publisher category', () => {
    expect(scoreCandidate(topicEntry, generalEducationStory)).not.toBeNull();
  });

  it('does not treat generic subject news as coverage of a named organisation', () => {
    expect(scoreCandidate(namedEntry, generalEducationStory)).toBeNull();
  });

  it('still matches a named entry when the item names it', () => {
    const result = scoreCandidate(
      namedEntry,
      candidate({ title: 'The success stories of TakenoLAB and ADAI Circle' })
    );
    expect(result).not.toBeNull();
    expect(result!.matched).toContain('entryTitle:title');
  });
});

describe('ranking', () => {
  it('returns the strongest matches first', () => {
    const items = [
      candidate({ id: 'weak', title: 'Assistance programmes reviewed', description: 'funding' }),
      candidate({ id: 'strong', title: 'Food assistance cut as hunger worsens' }),
    ];
    const ranked = rankCoverage(foodEntry, items);
    expect(ranked[0].id).toBe('strong');
  });

  it('prefers newer reporting when scores tie', () => {
    const older = candidate({
      id: 'older',
      title: 'Food assistance reduced',
      date: new Date('2024-01-01'),
    });
    const newer = candidate({
      id: 'newer',
      title: 'Food assistance reduced',
      date: new Date('2026-01-01'),
    });
    const ranked = rankCoverage(foodEntry, [older, newer]);
    expect(ranked[0].id).toBe('newer');
  });

  /** The same story is often both a dzaleka.com dispatch and an archived resource. */
  it('shows a story once even when two collections carry it', () => {
    const ranked = rankCoverage(foodEntry, [
      candidate({ id: 'feed', title: 'Hunger worsens as food assistance faces cuts', kind: 'dispatch' }),
      candidate({ id: 'archive', title: 'Hunger Worsens as Food Assistance Faces Cuts', kind: 'resource' }),
    ]);
    expect(ranked).toHaveLength(1);
  });

  it('respects the limit', () => {
    const many = Array.from({ length: 10 }, (_, i) =>
      candidate({ id: `n${i}`, title: `Food assistance update ${i}` })
    );
    expect(rankCoverage(foodEntry, many, 3)).toHaveLength(3);
  });

  it('returns nothing when no candidate is relevant', () => {
    expect(rankCoverage(foodEntry, [candidate({ title: 'Poetry night announced' })])).toEqual([]);
  });

  it('handles an empty candidate list', () => {
    expect(rankCoverage(foodEntry, [])).toEqual([]);
  });

  it('tolerates items with missing description or tags', () => {
    expect(() =>
      rankCoverage(foodEntry, [
        { ...candidate({ title: 'Food assistance cut' }), description: undefined as any, tags: undefined },
      ])
    ).not.toThrow();
  });
});
