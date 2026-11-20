/// <reference types="vite/client" />
import { describe, expect, it } from 'vitest';
import html from '../index.html?raw';
import svg from '../public/og-image.svg?raw';

const imageUrl = 'https://shrinkmyphoto.othrys.be/og-image.svg';

describe('social image metadata', () => {
  it('references the existing og-image.svg from og:image and twitter:image', () => {
    expect(svg).toContain('<svg');
    expect(html).toContain(`<meta property="og:image" content="${imageUrl}">`);
    expect(html).toContain(`<meta name="twitter:image" content="${imageUrl}">`);
    expect(html).toContain('<meta name="twitter:card" content="summary_large_image">');
  });
});
