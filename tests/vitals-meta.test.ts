/// <reference types="vite/client" />
import { describe, expect, it } from 'vitest';
import html from '../index.html?raw';
import svg from '../public/og-image.svg?raw';
import agentsTxt from '../public/agents.txt?raw';
import wellKnownAgentsTxt from '../public/.well-known/agents.txt?raw';

const imageUrl = 'https://shrinkmyphoto.othrys.be/og-image.svg';

describe('social image metadata', () => {
  it('references the existing og-image.svg from og:image and twitter:image', () => {
    expect(svg).toContain('<svg');
    expect(html).toContain(`<meta property="og:image" content="${imageUrl}">`);
    expect(html).toContain(`<meta name="twitter:image" content="${imageUrl}">`);
    expect(html).toContain('<meta name="twitter:card" content="summary_large_image">');
  });
});

describe('agents.txt manifests', () => {
  it('public/agents.txt exists with required fields', () => {
    expect(agentsTxt).toContain('Name: ShrinkMyPhoto');
    expect(agentsTxt).toContain('URL: https://shrinkmyphoto.othrys.be/');
    expect(agentsTxt).toContain('Description:');
    expect(agentsTxt).toContain('LLMs-Txt:');
    expect(agentsTxt).toContain('Sitemap:');
    expect(agentsTxt).toContain('Protocol: public-read-only');
    expect(agentsTxt).toContain('Privacy: zero-tracking-cookies, local-browser-execution, zero-cloud-uploads');
  });
  it('public/.well-known/agents.txt exists with required fields', () => {
    expect(wellKnownAgentsTxt).toContain('Name: ShrinkMyPhoto');
    expect(wellKnownAgentsTxt).toContain('URL: https://shrinkmyphoto.othrys.be/');
    expect(wellKnownAgentsTxt).toContain('Description:');
    expect(wellKnownAgentsTxt).toContain('LLMs-Txt:');
    expect(wellKnownAgentsTxt).toContain('Sitemap:');
    expect(wellKnownAgentsTxt).toContain('Protocol: public-read-only');
    expect(wellKnownAgentsTxt).toContain('Privacy: zero-tracking-cookies, local-browser-execution, zero-cloud-uploads');
  });
});
