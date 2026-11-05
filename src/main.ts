import './style.css';
import { inspect, MAX_BYTES, validateDimensions, targetBytes, formatBytes, needsFlatten, savings, targetMessage, search, type Format } from './logic';
import { initThemeController } from './theme';
import { showToast } from './toast';

const el = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const fileInput = el<HTMLInputElement>('file');
const form = el<HTMLFormElement>('settings');
const targetInput = el<HTMLInputElement>('target');
const formatInput = el<HTMLSelectElement>('format');
const resizeInput = el<HTMLSelectElement>('resize');
const flatten = el<HTMLInputElement>('flatten');
const button = el<HTMLButtonElement>('compress');
const original = el<HTMLImageElement>('original');
const optimized = el<HTMLImageElement>('optimized');
const download = el<HTMLAnchorElement>('download');
const copyImageBtn = el<HTMLButtonElement>('copy-image');

let source: { bitmap: ImageBitmap; file: File; format: Format } | undefined;
let sourceUrl: string | undefined;
let resultUrl: string | undefined;
let lastResultBlob: Blob | undefined;
let generation = 0;
let busy = false;

const supported = typeof createImageBitmap === 'function' && typeof HTMLCanvasElement.prototype.toBlob === 'function';
const status = (message: string) => { el('status').textContent = message; };
const error = (message = '') => { el('error').hidden = !message; el('error').textContent = message; };

function clearResult() {
  optimized.removeAttribute('src');
  download.removeAttribute('href');
  if (resultUrl) URL.revokeObjectURL(resultUrl);
  resultUrl = undefined;
  lastResultBlob = undefined;
  el('result').hidden = true;
  if (copyImageBtn) copyImageBtn.disabled = true;
}

function releaseSource() {
  original.removeAttribute('src');
  source?.bitmap.close();
  source = undefined;
  if (sourceUrl) URL.revokeObjectURL(sourceUrl);
  sourceUrl = undefined;
  el('source-info').hidden = true;
}

function outputFormat(): Format {
  return formatInput.value === 'keep' ? source!.format : (formatInput.value as Format);
}

function syncConsent() {
  const required = !!source && needsFlatten(source.format, outputFormat());
  el('flatten-wrap').hidden = !required;
  flatten.required = required;
  button.disabled = !source || busy || !supported;
}

function setBusy(value: boolean) {
  busy = value;
  form.setAttribute('aria-busy', String(value));
  for (const control of form.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLButtonElement>('input, select, button')) {
    control.disabled = value;
  }
  fileInput.disabled = value;
  el<HTMLButtonElement>('clear').disabled = value;
  button.textContent = value ? 'Compressing photo…' : 'Shrink my photo ↘';
  syncConsent();
}

function clear() {
  generation++;
  clearResult();
  releaseSource();
  fileInput.value = '';
  flatten.checked = false;
  syncConsent();
  error();
  status('Ready when you are. Your photo never leaves this device.');
}

async function selectFile(file: File) {
  if (busy) return;
  clear();
  const current = generation;
  setBusy(true);
  status('Checking your photo…');

  try {
    if (!supported) {
      throw new Error('Your browser lacks the image tools needed here. Try a current Chrome, Edge, Firefox or Safari browser.');
    }
    if (!file.size || file.size > MAX_BYTES) {
      throw new Error('Choose an image up to 20 MB. Files stay on your machine.');
    }
    const header = inspect(new Uint8Array(await file.arrayBuffer()));
    let bitmap: ImageBitmap;
    try {
      bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
    } catch {
      throw new Error('Your browser could not decode this photo. It may be corrupt or unsupported.');
    }
    if (current !== generation) {
      bitmap.close();
      return;
    }
    try {
      validateDimensions(bitmap.width, bitmap.height);
    } catch (e) {
      bitmap.close();
      throw e;
    }

    source = { bitmap, file, format: header.format };
    sourceUrl = URL.createObjectURL(file);
    original.src = sourceUrl;
    el('filename').textContent = file.name;
    el('original-stats').textContent = `${bitmap.width.toLocaleString()} × ${bitmap.height.toLocaleString()} px · ${formatBytes(file.size)} (${file.size.toLocaleString()} bytes) · ${header.format.split('/')[1].toUpperCase()}`;
    el('source-info').hidden = false;
    status('Photo ready. Choose your target size and click Shrink.');
    showToast(`Loaded ${file.name}`);
  } catch (e) {
    error(e instanceof Error ? e.message : 'Unable to open this photo. Try another image.');
    status('No image loaded.');
  } finally {
    setBusy(false);
  }
}

fileInput.addEventListener('change', () => {
  if (fileInput.files?.[0]) void selectFile(fileInput.files[0]);
});

el('clear').addEventListener('click', clear);

const zone = el('drop-zone');
for (const event of ['dragenter', 'dragover']) {
  zone.addEventListener(event, (e) => {
    e.preventDefault();
    if (!busy) zone.classList.add('dragging');
  });
}
zone.addEventListener('dragleave', () => zone.classList.remove('dragging'));
zone.addEventListener('drop', (e) => {
  e.preventDefault();
  zone.classList.remove('dragging');
  if (busy) return;
  const files = (e as DragEvent).dataTransfer?.files;
  if (files?.length !== 1) {
    error('Please choose one image at a time.');
    return;
  }
  void selectFile(files[0]);
});

// Prevent accidental window navigation
window.addEventListener('dragover', (e) => e.preventDefault());
window.addEventListener('drop', (e) => e.preventDefault());

// Global Paste Event (Ctrl+V / ⌘+V) for instant screenshot pasting
window.addEventListener('paste', (e) => {
  const items = e.clipboardData?.items;
  if (!items) return;
  for (let i = 0; i < items.length; i++) {
    if (items[i].type.startsWith('image/')) {
      const file = items[i].getAsFile();
      if (file) {
        showToast('Pasting image from clipboard…');
        void selectFile(file);
        break;
      }
    }
  }
});

function settingsChanged() {
  clearResult();
  syncConsent();
  if (source) status('Settings updated. Shrink again to create a new result.');
  document.querySelectorAll<HTMLButtonElement>('[data-size]').forEach((b) => {
    b.setAttribute('aria-pressed', String(b.dataset.size === targetInput.value));
  });
}

form.addEventListener('input', settingsChanged);
formatInput.addEventListener('change', () => {
  flatten.checked = false;
  settingsChanged();
});

// Target Size Preset Pills
document.querySelectorAll<HTMLButtonElement>('[data-size]').forEach((b) => {
  b.addEventListener('click', () => {
    targetInput.value = b.dataset.size!;
    settingsChanged();
    showToast(`Target set to ${b.dataset.size} KB`);
  });
});

// Compress submit handler
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!source || busy || !form.reportValidity()) return;
  error();
  clearResult();

  const selected = source;
  const output = outputFormat();
  const current = generation;

  let target: number;
  try {
    target = targetBytes(Number(targetInput.value));
  } catch (err) {
    error((err as Error).message);
    return;
  }

  if (needsFlatten(selected.format, output) && !flatten.checked) {
    error('Please agree to a white background before converting to JPEG.');
    return;
  }

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    error('Canvas is unavailable. Try another browser or enable graphics support.');
    return;
  }

  setBusy(true);
  status('Finding optimal size… Your image stays on this device.');
  let attempts = 0;

  try {
    const result = await search(async (width, height, quality) => {
      if (current !== generation) throw new Error('Processing was interrupted.');
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        if (output === 'image/jpeg') {
          ctx.fillStyle = '#fff';
          ctx.fillRect(0, 0, width, height);
        }
        ctx.drawImage(selected.bitmap, 0, 0, width, height);
      } else {
        ctx.clearRect(0, 0, width, height);
        if (output === 'image/jpeg') {
          ctx.fillStyle = '#fff';
          ctx.fillRect(0, 0, width, height);
        }
        ctx.drawImage(selected.bitmap, 0, 0, width, height);
      }

      attempts++;
      status(`Searching optimal compression… Attempt ${attempts} · ${width} × ${height} px`);

      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (value) => (value ? resolve(value) : reject(new Error('Image encoding failed.'))),
          output,
          quality
        );
      });

      if (current !== generation) throw new Error('Processing was interrupted.');
      if (blob.type !== output) {
        throw new Error(`Browser cannot save ${output.split('/')[1].toUpperCase()}.`);
      }
      return blob;
    }, selected.bitmap.width, selected.bitmap.height, target, output, Number(resizeInput.value));

    lastResultBlob = result.blob;
    resultUrl = URL.createObjectURL(result.blob);
    optimized.src = resultUrl;
    download.href = resultUrl;
    download.download = `${selected.file.name.replace(/\.[^.]+$/, '') || 'photo'}-shrink-${targetInput.value}kb.${output === 'image/jpeg' ? 'jpg' : output.split('/')[1]}`;

    const saved = savings(selected.file.size, result.blob.size);
    el('result-stats').textContent = `${formatBytes(result.blob.size)} · ${result.width} × ${result.height} px · ${saved >= 0 ? `${saved.toFixed(1)}% smaller` : `${Math.abs(saved).toFixed(1)}% larger`}`;
    el('target-result').textContent = targetMessage(result.blob.size, target);
    el('target-result').classList.toggle('over-target', result.blob.size > target);
    el('result').hidden = false;
    if (copyImageBtn) copyImageBtn.disabled = false;

    status(`${result.blob.size <= target ? 'Success! Photo compressed within your target.' : 'Done. The closest result found is shown below.'}`);
    showToast('Photo compressed successfully!');
  } catch (err) {
    error(err instanceof Error ? err.message : 'Compression failed. Try a smaller image or another format.');
    status('No result created.');
  } finally {
    canvas.width = 0;
    canvas.height = 0;
    setBusy(false);
  }
});

// Copy Image Directly to Clipboard (with Universal Browser PNG Conversion)
copyImageBtn?.addEventListener('click', async () => {
  if (!lastResultBlob || !resultUrl) return;
  try {
    if (navigator.clipboard && typeof ClipboardItem !== 'undefined') {
      let pngBlob = lastResultBlob;
      // Browsers like Chrome/Edge only permit 'image/png' on clipboard write
      if (lastResultBlob.type !== 'image/png') {
        const img = new Image();
        img.src = resultUrl;
        await img.decode();
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const converted = await new Promise<Blob | null>((res) => canvas.toBlob(res, 'image/png'));
          if (converted) pngBlob = converted;
        }
      }
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': pngBlob })
      ]);
      showToast('Compressed image copied to clipboard! (Ready to paste)');
      return;
    }
    throw new Error('ClipboardItem unsupported');
  } catch (err) {
    console.error('Clipboard copy failed:', err);
    showToast('Direct image clipboard unsupported in this browser. Please use Download photo.');
  }
});

window.addEventListener('pagehide', () => {
  generation++;
  clearResult();
  releaseSource();
});

window.addEventListener('pageshow', () => {
  if (!source) {
    fileInput.value = '';
    syncConsent();
  }
});

if (!supported) {
  fileInput.disabled = true;
  error('This browser lacks local canvas tools. Please use a modern browser.');
}

// Initialize Theme Controller
initThemeController();
