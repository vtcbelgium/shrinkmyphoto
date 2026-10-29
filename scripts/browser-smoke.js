// Run this entire expression in DevTools (or a browser automation evaluator) on the local app.
// It creates synthetic fixtures locally, exercises the real UI, and returns assertion names.
(async () => {
  const $ = id => document.getElementById(id), passed = [], live = new Map();
  const assert = (condition, message) => { if (!condition) throw new Error(message); passed.push(message); };
  const wait = async predicate => {
    const start = Date.now();
    while (!predicate()) { if (Date.now() - start > 15000) throw new Error('Timed out: ' + $('status').textContent); await new Promise(r => setTimeout(r, 25)); }
  };
  const create = URL.createObjectURL, revoke = URL.revokeObjectURL;
  URL.createObjectURL = blob => { const url = create.call(URL, blob); live.set(url, blob); return url; };
  URL.revokeObjectURL = url => { live.delete(url); revoke.call(URL, url); };
  const canvas = document.createElement('canvas'); canvas.width = 1000; canvas.height = 600;
  const ctx = canvas.getContext('2d'); ctx.fillStyle = '#ef9944'; ctx.fillRect(250, 150, 500, 300);
  const make = type => new Promise(resolve => canvas.toBlob(resolve, type));
  const load = async (blob, name) => {
    const transfer = new DataTransfer(); transfer.items.add(new File([blob], name, { type: blob.type }));
    $('file').files = transfer.files; $('file').dispatchEvent(new Event('change', { bubbles: true }));
    await wait(() => !$('file').disabled);
  };
  const change = (id, value) => { $(id).value = value; $(id).dispatchEvent(new Event('input', { bubbles: true })); $(id).dispatchEvent(new Event('change', { bubbles: true })); };
  const compress = async () => { $('settings').requestSubmit(); await wait(() => $('settings').getAttribute('aria-busy') === 'false'); };
  const pixel = async blob => {
    const bitmap = await createImageBitmap(blob), c = document.createElement('canvas'); c.width = 1; c.height = 1;
    const context = c.getContext('2d'); context.drawImage(bitmap, 0, 0); bitmap.close(); return [...context.getImageData(0, 0, 1, 1).data];
  };
  try {
    $('clear').click();
    change('format', 'keep'); change('resize', '0'); change('target', '200');
    await load(await make('image/png'), 'transparent.png');
    assert($('original-stats').textContent.includes((1000).toLocaleString()), 'PNG loads with dimensions');
    await compress();
    let output = live.get($('download').href);
    assert(output?.type === 'image/png', 'PNG output type preserved');
    assert((await pixel(output))[3] === 0, 'PNG transparency preserved');
    assert(output.size <= 200000, 'Actual blob meets displayed target');
    assert($('download').download === 'transparent-small.png', 'Download filename matches output');
    change('format', 'image/jpeg');
    assert($('result').hidden && live.size === 1, 'Settings revoke stale result URL');
    assert(!$('flatten-wrap').hidden && !$('flatten').checkValidity(), 'JPEG requires explicit flatten consent');
    $('flatten').checked = true;
    change('resize', '800'); await compress(); output = live.get($('download').href);
    assert(output?.type === 'image/jpeg', 'JPEG output type correct');
    assert((await pixel(output)).every(v => v === 255), 'JPEG transparent corner becomes white');
    assert($('result-stats').textContent.includes('800 × 480'), 'Resize cap applied');
    change('format', 'image/webp'); await compress(); output = live.get($('download').href);
    assert(output?.type === 'image/webp' && (await pixel(output))[3] === 0, 'WebP output retains alpha');
    await load(await make('image/jpeg'), 'photo.jpg');
    change('format', 'keep'); await compress();
    assert(live.get($('download').href)?.type === 'image/jpeg', 'JPEG input and same-format output work');
    await load(await make('image/webp'), 'photo.webp');
    await compress(); assert(live.get($('download').href)?.type === 'image/webp', 'WebP input works');
    await load(new Blob(['not an image'], { type: 'image/png' }), 'broken.png');
    assert(!$('error').hidden && $('compress').disabled, 'Corrupt file produces error and disables compression');
    assert(live.size === 0, 'Replacement releases all previous blob URLs');
    assert(document.documentElement.scrollWidth <= innerWidth, 'No horizontal overflow at current viewport');
    $('clear').click();
    return { passed, count: passed.length };
  } finally { URL.createObjectURL = create; URL.revokeObjectURL = revoke; canvas.width = 0; canvas.height = 0; }
})()
