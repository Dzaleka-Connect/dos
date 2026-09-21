import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import matter from 'gray-matter';
import { collections } from '../src/content.config';

describe('creative profile content', () => {
  it('retains artists’ published contacts, biography dates and social handles', () => {
    const { data } = matter(readFileSync('src/content/artists/wabangwebangwe-francois.md', 'utf8'));
    const parsed = collections.artists.schema.parse(data);
    for (const key of ['whatsapp', 'phone', 'email', 'age', 'birthYear', 'instagram', 'facebook', 'youtube', 'twitter', 'tiktok']) {
      expect(parsed[key], key).toEqual(data[key]);
    }
  });
  it('retains the supplied poet photograph credit and writing history', () => {
    const { data } = matter(readFileSync('src/content/poets/hassan-c-honore.md', 'utf8'));
    const parsed = collections.poets.schema.parse(data);
    expect(parsed.photographer).toBe(data.photographer);
    expect(parsed.startedWriting).toBe(data.startedWriting);
    expect(parsed.volunteerWork).toBe(data.volunteerWork);
  });
  it('retains group video links and the contacts of named members', () => {
    const { data } = matter(readFileSync('src/content/dancers/forus-crew.md', 'utf8'));
    const parsed = collections.dancers.schema.parse(data);
    expect(parsed.youtubeChannel).toBe(data.youtubeChannel);
    expect(parsed.socialMedia).toEqual(data.socialMedia);
    expect(parsed.members?.map(member => member.email)).toEqual(data.members.map(member => member.email));
  });
});
