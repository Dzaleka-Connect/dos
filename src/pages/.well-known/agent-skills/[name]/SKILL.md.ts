import type { APIRoute, GetStaticPaths } from 'astro';
import {
  AGENT_SKILLS_CACHE_CONTROL,
  publishedAgentSkills,
  publishedAgentSkillsByName,
} from '../../../../data/agentSkills';

export const getStaticPaths: GetStaticPaths = async () =>
  publishedAgentSkills.map((skill) => ({
    params: {
      name: skill.name,
    },
  }));

export const GET: APIRoute = async ({ params }) => {
  const skill = params.name ? publishedAgentSkillsByName.get(params.name) : undefined;

  if (!skill) {
    return new Response('Not found', {
      status: 404,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  }

  return new Response(skill.content, {
    status: 200,
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': AGENT_SKILLS_CACHE_CONTROL,
      'Access-Control-Allow-Origin': '*',
    },
  });
};

export const HEAD: APIRoute = GET;
