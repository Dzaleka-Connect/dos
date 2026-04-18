import type { APIRoute } from 'astro';
import {
  AGENT_SKILLS_CACHE_CONTROL,
  agentSkillsIndexDocument,
} from '../../../data/agentSkills';

export const GET: APIRoute = async () =>
  new Response(JSON.stringify(agentSkillsIndexDocument, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': AGENT_SKILLS_CACHE_CONTROL,
      'Access-Control-Allow-Origin': '*',
    },
  });

export const HEAD: APIRoute = GET;
