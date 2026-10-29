import { describe, expect, it } from 'vitest';
import { fit, formatBytes, inspect, needsFlatten, savings, search, targetBytes, targetMessage, validateDimensions, type Format } from '../src/logic';

describe('size and format decisions', () => {
  it('uses decimal KB and rejects invalid targets', () => {
    expect(targetBytes(200)).toBe(200_000);
    for (const value of [0, -1, NaN, Infinity, 0.5, 20001]) expect(() => targetBytes(value)).toThrow();
    expect(formatBytes(1500)).toBe('1.5 KB');
    expect(formatBytes(1_500_000)).toBe('1.50 MB');
  });
  it('fits without upscaling and keeps each dimension nonzero', () => {
    expect(fit(4000, 3000, 1920)).toEqual([1920, 1440]);
    expect(fit(300, 400, 1920)).toEqual([300, 400]);
    expect(fit(1, 1000, 10)).toEqual([1, 10]);
    expect(fit(300, 400, 0)).toEqual([300, 400]);
  });
  it('requires explicit JPEG flattening for formats that support alpha', () => {
    expect(needsFlatten('image/png', 'image/jpeg')).toBe(true);
    expect(needsFlatten('image/webp', 'image/jpeg')).toBe(true);
    expect(needsFlatten('image/jpeg', 'image/jpeg')).toBe(false);
    expect(needsFlatten('image/png', 'image/webp')).toBe(false);
  });
  it('reports larger results and unmet targets honestly', () => {
    expect(savings(1000, 1200)).toBeCloseTo(-20);
    expect(targetMessage(1000, 1000)).toContain('Target met');
    expect(targetMessage(1001, 1000)).toContain('Target not met');
  });
  it('rejects excessive or invalid decoded dimensions', () => {
    expect(() => validateDimensions(6000, 4000)).not.toThrow();
    for (const [w, h] of [[6001, 4000], [17000, 1], [0, 100], [NaN, 1]]) expect(() => validateDimensions(w, h)).toThrow();
  });
});

function png(width = 2, height = 3, animated = false) {
  const data = new Uint8Array(animated ? 65 : 45), v = new DataView(data.buffer);
  data.set([137, 80, 78, 71, 13, 10, 26, 10]); v.setUint32(8, 13);
  data.set(new TextEncoder().encode('IHDR'), 12); v.setUint32(16, width); v.setUint32(20, height);
  if (animated) { v.setUint32(33, 8); data.set(new TextEncoder().encode('acTL'), 37); }
  data.set(new TextEncoder().encode('IEND'), animated ? 57 : 37);
  return data;
}
describe('header inspection before decoding', () => {
  it('reads PNG dimensions and rejects APNG', () => {
    expect(inspect(png())).toEqual({ format: 'image/png', width: 2, height: 3 });
    expect(() => inspect(png(2, 3, true))).toThrow('Animated');
    expect(() => inspect(png(24000, 100))).toThrow('too large');
    expect(() => inspect(png().subarray(0, 36))).toThrow();
  });
  it('reads JPEG frame dimensions without EXIF guesses', () => {
    const jpg = new Uint8Array([255,216,255,224,0,4,0,0,255,192,0,8,8,0,30,0,40,1,255,217]);
    expect(inspect(jpg)).toEqual({ format: 'image/jpeg', width: 40, height: 30 });
  });
  it('reads extended WebP and rejects its animation flag', () => {
    const data = new Uint8Array(30), v = new DataView(data.buffer), e = new TextEncoder();
    data.set(e.encode('RIFF')); v.setUint32(4, 22, true); data.set(e.encode('WEBPVP8X'), 8); v.setUint32(16, 10, true);
    data[24] = 9; data[27] = 19;
    expect(inspect(data)).toEqual({ format: 'image/webp', width: 10, height: 20 });
    data[20] = 2; expect(() => inspect(data)).toThrow('Animated');
  });
  it('rejects unknown signatures even with an image filename', () => {
    expect(() => inspect(new TextEncoder().encode('<svg>not supported</svg>'))).toThrow('Unsupported');
  });
});
describe('bounded compression search', () => {
  const blob = (size: number, type = 'image/jpeg') => new Blob([new Uint8Array(size)], { type });
  it('returns high quality immediately when it fits', async () => {
    let calls = 0;
    const result = await search(async () => { calls++; return blob(500); }, 100, 100, 1000, 'image/jpeg', 0);
    expect(calls).toBe(1); expect(result.blob.size).toBe(500);
  });
  it('finds quality under target at original dimensions', async () => {
    let calls = 0;
    const result = await search(async (_w, _h, q) => { calls++; return blob(Math.ceil(q! * 10000)); }, 100, 80, 5000, 'image/webp', 0);
    expect(calls).toBeLessThanOrEqual(9); expect(result.blob.size).toBeLessThanOrEqual(5000);
    expect(result.blob.size).toBeGreaterThan(4900); expect(result.width).toBe(100);
  });
  it('reduces dimensions for PNG without supplying a quality value', async () => {
    const result = await search(async (w, h, q) => { expect(q).toBeUndefined(); return blob(w * h, 'image/png'); }, 100, 100, 2000, 'image/png', 50);
    expect(result.width).toBeLessThan(50); expect(result.blob.size).toBeLessThanOrEqual(2000);
  });
  it.each<Format>(['image/jpeg', 'image/png', 'image/webp'])('returns smallest observed result when %s target is impossible', async format => {
    let calls = 0;
    const result = await search(async () => { calls++; return blob(2000 + (calls % 3) * 100, format); }, 4000, 3000, 1, format, 0);
    expect(calls).toBeLessThanOrEqual(72); expect(result.blob.size).toBe(2000);
    expect(targetMessage(result.blob.size, 1)).toContain('Target not met');
  });
  it('propagates encoder failure instead of inventing a result', async () => {
    await expect(search(async () => { throw new Error('codec unavailable'); }, 10, 10, 1000, 'image/webp', 0)).rejects.toThrow('codec unavailable');
  });
});
