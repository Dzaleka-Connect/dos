import { describe, it, expect } from 'vitest';
import { apiCatalogDocument, SITE_URL } from '../src/data/agentDiscovery';
import { mcpToolDescriptors, MCP_LIST_COLLECTIONS } from '../src/data/mcpTools';

describe('API catalog', () => {
  const apiAnchor = apiCatalogDocument.linkset.find(
    (entry: any) => entry.anchor === `${SITE_URL}/api`
  ) as any;

  it('anchors on the API base URL', () => {
    expect(apiAnchor).toBeDefined();
  });

  it('advertises the OpenAPI description, docs and status', () => {
    expect(apiAnchor['service-desc'][0].href).toContain('/api/openapi.json');
    expect(apiAnchor['service-doc'][0].href).toContain('/api-docs');
    expect(apiAnchor.status[0].href).toContain('/api/status');
  });

  it('advertises the agent guidance file and the MCP endpoint', () => {
    const hrefs = apiAnchor.describedby.map((link: any) => link.href);
    expect(hrefs).toContain(`${SITE_URL}/llms.txt`);
    expect(hrefs).toContain(`${SITE_URL}/.well-known/mcp`);
  });

  it('advertises the deprecation policy', () => {
    const hrefs = apiAnchor.describedby.map((link: any) => link.href);
    expect(hrefs).toContain(`${SITE_URL}/api/deprecation-policy`);
  });

  it('gives every catalog link an absolute URL and a media type', () => {
    for (const entry of apiCatalogDocument.linkset as any[]) {
      for (const [rel, links] of Object.entries(entry)) {
        if (rel === 'anchor') continue;
        for (const link of links as any[]) {
          expect(link.href, rel).toMatch(/^https:\/\//);
          expect(link.type, rel).toBeTruthy();
        }
      }
    }
  });
});

describe('MCP tool definitions', () => {
  it('exposes a stable, function-calling-safe tool name for each tool', () => {
    const names = mcpToolDescriptors.map((tool) => tool.name);
    expect(new Set(names).size).toBe(names.length);
    for (const name of names) {
      expect(name).toMatch(/^[a-z][a-z0-9_]*$/);
    }
  });

  it('declares required arguments on every tool', () => {
    for (const tool of mcpToolDescriptors) {
      const schema = tool.inputSchema as any;
      expect(schema.type).toBe('object');
      expect(Array.isArray(schema.required)).toBe(true);
      expect(schema.required.length).toBeGreaterThan(0);
      for (const field of schema.required) {
        expect(schema.properties, `${tool.name}.${field}`).toHaveProperty(field);
      }
    }
  });

  it('documents every property it declares', () => {
    for (const tool of mcpToolDescriptors) {
      for (const [name, prop] of Object.entries((tool.inputSchema as any).properties)) {
        expect((prop as any).description, `${tool.name}.${name}`).toBeTruthy();
      }
    }
  });

  it('restricts the collection argument to an allow-list', () => {
    const tool = mcpToolDescriptors.find((t) => t.name === 'list_dzaleka_collection')!;
    const values = (tool.inputSchema as any).properties.collection.enum;
    expect(values).toEqual([...MCP_LIST_COLLECTIONS]);
    // Nothing in the allow-list may escape the /api/ prefix.
    for (const name of values) {
      expect(name).toMatch(/^[a-z][a-z-]*$/);
    }
  });
});
