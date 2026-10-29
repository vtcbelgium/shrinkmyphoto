export type Format = 'image/jpeg' | 'image/png' | 'image/webp';
export const MAX_BYTES = 20_000_000;
export const MAX_PIXELS = 24_000_000;
export const MAX_EDGE = 16_384;
export function targetBytes(kb: number): number {
  if (!Number.isInteger(kb) || kb < 1 || kb > 20_000) throw new Error('Enter a whole-number target between 1 and 20,000 KB.');
  return kb * 1000;
}
export function formatBytes(bytes: number): string {
  return bytes >= 1_000_000 ? `${(bytes / 1_000_000).toFixed(2)} MB` : `${(bytes / 1000).toFixed(1)} KB`;
}
export function fit(width: number, height: number, cap: number): [number, number] {
  const scale = cap > 0 ? Math.min(1, cap / Math.max(width, height)) : 1;
  return [Math.max(1, Math.round(width * scale)), Math.max(1, Math.round(height * scale))];
}
export function needsFlatten(source: Format, output: Format): boolean { return source !== 'image/jpeg' && output === 'image/jpeg'; }
export function savings(original: number, output: number): number { return (1 - output / original) * 100; }
export function targetMessage(actual: number, target: number): string {
  return actual <= target ? `Target met: ${actual.toLocaleString()} bytes, within your ${formatBytes(target)} maximum.` : `Target not met. Closest achieved in this search: ${actual.toLocaleString()} bytes (${formatBytes(actual)}), above your ${formatBytes(target)} maximum.`;
}
export function validateDimensions(width: number, height: number): void {
  if (!Number.isInteger(width) || !Number.isInteger(height) || width < 1 || height < 1) throw new Error('This image has invalid dimensions. Try another file.');
  if (width > MAX_EDGE || height > MAX_EDGE || width * height > MAX_PIXELS) throw new Error('This photo is too large to process safely. Use an image under 24 MP and 16,384 pixels per edge.');
}
// Inspect file signatures and dimensions before asking the browser to allocate decoded pixels.
export function inspect(bytes: Uint8Array): { format: Format; width: number; height: number } {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const ascii = (offset: number, count: number) => String.fromCharCode(...bytes.subarray(offset, offset + count));
  const fail = () => { throw new Error('Unsupported or damaged image. Choose a valid JPEG, PNG or WebP file.'); };
  const done = (format: Format, width: number, height: number) => { validateDimensions(width, height); return { format, width, height }; };
  if (bytes.length >= 33 && bytes[0] === 137 && ascii(1, 7) === 'PNG\r\n\x1a\n') {
    if (ascii(12, 4) !== 'IHDR' || view.getUint32(8) !== 13) return fail();
    let ended = false;
    for (let p = 8; p + 12 <= bytes.length;) {
      const size = view.getUint32(p), type = ascii(p + 4, 4);
      if (p + size + 12 > bytes.length) return fail();
      if (type === 'acTL') throw new Error('Animated PNG is not supported. Choose a still image instead.');
      if (type === 'IEND') { ended = true; break; }
      p += size + 12;
    }
    if (!ended) return fail();
    return done('image/png', view.getUint32(16), view.getUint32(20));
  }
  if (bytes.length >= 30 && ascii(0, 4) === 'RIFF' && ascii(8, 4) === 'WEBP') {
    const end = view.getUint32(4, true) + 8;
    if (end > bytes.length) return fail();
    let width = 0, height = 0;
    for (let p = 12; p + 8 <= end;) {
      const type = ascii(p, 4), size = view.getUint32(p + 4, true), d = p + 8;
      if (d + size > end) return fail();
      if (type === 'ANIM' || type === 'ANMF' || (type === 'VP8X' && (bytes[d] & 2))) throw new Error('Animated WebP is not supported. Choose a still image instead.');
      if (type === 'VP8X' && size >= 10) {
        width = 1 + bytes[d + 4] + (bytes[d + 5] << 8) + (bytes[d + 6] << 16);
        height = 1 + bytes[d + 7] + (bytes[d + 8] << 8) + (bytes[d + 9] << 16);
      } else if (!width && type === 'VP8 ' && size >= 10 && ascii(d + 3, 3) === '\x9d\x01\x2a') {
        width = view.getUint16(d + 6, true) & 0x3fff; height = view.getUint16(d + 8, true) & 0x3fff;
      } else if (!width && type === 'VP8L' && size >= 5 && bytes[d] === 0x2f) {
        const bits = view.getUint32(d + 1, true); width = (bits & 0x3fff) + 1; height = ((bits >>> 14) & 0x3fff) + 1;
      }
      p = d + size + (size % 2);
    }
    return done('image/webp', width, height);
  }
  if (bytes.length >= 4 && bytes[0] === 0xff && bytes[1] === 0xd8) {
    for (let p = 2; p + 3 < bytes.length;) {
      if (bytes[p++] !== 0xff) return fail();
      while (bytes[p] === 0xff) p++;
      const marker = bytes[p++];
      if (marker === 0xda || marker === 0xd9) break;
      if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) continue;
      if (p + 2 > bytes.length) return fail();
      const size = view.getUint16(p);
      if (size < 2 || p + size > bytes.length) return fail();
      if ([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf].includes(marker) && size >= 8) return done('image/jpeg', view.getUint16(p + 5), view.getUint16(p + 3));
      p += size;
    }
  }
  return fail();
}

export interface Candidate { blob: Blob; width: number; height: number }
export type Encoder = (width: number, height: number, quality?: number) => Promise<Blob>;
// At most 8 dimension passes × 9 encodes. Prefer the largest dimensions that meet the target.
export async function search(encode: Encoder, width: number, height: number, target: number, format: Format, cap: number): Promise<Candidate> {
  let [w, h] = fit(width, height, cap);
  let closest: Candidate | undefined;
  for (let pass = 0; pass < 8; pass++) {
    const attempt = async (quality?: number): Promise<Candidate> => {
      const blob = await encode(w, h, quality);
      const candidate = { blob, width: w, height: h };
      if (!closest || blob.size < closest.blob.size) closest = candidate;
      return candidate;
    };
    const high = await attempt(format === 'image/png' ? undefined : 0.94);
    if (high.blob.size <= target) return high;
    let smallestAtSize = high;
    if (format !== 'image/png') {
      const low = await attempt(0.18);
      if (low.blob.size < smallestAtSize.blob.size) smallestAtSize = low;
      if (low.blob.size <= target) {
        let best = low, lo = 0.18, hi = 0.94;
        for (let i = 0; i < 7; i++) {
          const q = (lo + hi) / 2, candidate = await attempt(q);
          if (candidate.blob.size <= target) { best = candidate; lo = q; } else hi = q;
        }
        return best;
      }
    }
    if (w === 1 && h === 1) break;
    const scale = Math.min(0.8, Math.max(0.25, Math.sqrt(target / smallestAtSize.blob.size) * 0.9));
    w = Math.max(1, Math.floor(w * scale)); h = Math.max(1, Math.floor(h * scale));
  }
  return closest!;
}
