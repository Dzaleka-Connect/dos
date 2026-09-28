import type { APIRoute, GetStaticPaths } from 'astro';
import { guideLanguages, type GuideLanguage } from '../../../data/essentials';
import { renderEssentialsDownload } from '../../../utils/essentialsDownload';
export const prerender = true;
export const getStaticPaths = (() => guideLanguages.map(lang => ({ params: { lang }, props: { lang } }))) satisfies GetStaticPaths;
export const GET: APIRoute<{ lang: GuideLanguage }> = ({ props }) => new Response(renderEssentialsDownload(props.lang), {
  headers: { 'Content-Type': 'text/html; charset=utf-8' },
});
