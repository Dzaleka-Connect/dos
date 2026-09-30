import { defineLiveCollection } from 'astro:content';
import { loader } from '@dos/news-live';
export const collections = loader ? { _emdash: defineLiveCollection({ loader }) } : {};
