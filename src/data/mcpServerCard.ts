import {
  API_CATALOG_URL,
  API_DOCS_URL,
  OPENAPI_URL,
  SITE_URL,
} from './agentDiscovery';
import { AGENT_SKILLS_INDEX_PATH } from './agentSkills';

export const MCP_SERVER_CARD_SCHEMA_URL =
  'https://static.modelcontextprotocol.io/schemas/mcp-server-card/v1.json';
export const MCP_SERVER_CARD_PATH = '/.well-known/mcp/server-card.json';
export const MCP_SERVER_CARD_URL = `${SITE_URL}${MCP_SERVER_CARD_PATH}`;
export const MCP_SERVER_CARD_CACHE_CONTROL = 'public, max-age=3600';
export const MCP_PROTOCOL_VERSION = '2025-06-18';
export const MCP_SERVER_NAME = 'dzaleka-online-services';
export const MCP_SERVER_TITLE = 'Dzaleka Online Services MCP';
/**
 * Version of the MCP surface (tools and their schemas), not of the site build.
 * Bump it when a tool is added, removed, or its input schema changes.
 * Previously read from npm_package_version, which is undefined at runtime and
 * so always reported 0.0.1.
 */
export const MCP_SERVER_VERSION = '1.0.0';
export const MCP_TRANSPORT_ENDPOINT = '/';

export const mcpServerCardDocument = {
  $schema: MCP_SERVER_CARD_SCHEMA_URL,
  version: '1.0',
  protocolVersion: MCP_PROTOCOL_VERSION,
  serverInfo: {
    name: MCP_SERVER_NAME,
    title: MCP_SERVER_TITLE,
    version: MCP_SERVER_VERSION,
  },
  description:
    'Read-only browser-side WebMCP tools and public discovery documents for Dzaleka Online Services.',
  iconUrl: `${SITE_URL}/images/dzaleka-digital-heritage.png`,
  documentationUrl: `${SITE_URL}/docs/agent-access-guide`,
  transport: {
    type: 'webmcp',
    endpoint: MCP_TRANSPORT_ENDPOINT,
  },
  capabilities: {
    tools: {
      listChanged: false,
    },
  },
  authentication: {
    required: false,
    schemes: [],
  },
  instructions:
    'Open any public page in a secure top-level browser context that supports navigator.modelContext. The site registers read-only tools on page load. Use the public JSON API for server-side integrations and scheduled jobs.',
  _meta: {
    surface: 'browser-webmcp',
    apiCatalogUrl: API_CATALOG_URL,
    openApiUrl: OPENAPI_URL,
    apiDocsUrl: API_DOCS_URL,
    agentSkillsUrl: `${SITE_URL}${AGENT_SKILLS_INDEX_PATH}`,
  },
};
