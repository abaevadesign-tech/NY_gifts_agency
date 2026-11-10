/**
 * One-off download of the original Figma assets into ./assets.
 * Run on a computer with network access: node download-assets.mjs
 * Source URLs are temporary Figma MCP export links and may expire after about a week.
 * Never serve these URLs at runtime: the website uses only local ./assets paths.
 */
import { mkdir, writeFile, stat } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const base = dirname(fileURLToPath(import.meta.url));
const assets = join(base, 'assets');
const manifest = {
  'hero-background.png': 'https://www.figma.com/api/mcp/asset/dfc95957-9cc6-41f8-8fe7-dd17dffefbdf.png',
  'hero-masking.svg': 'https://www.figma.com/api/mcp/asset/458392d3-cce6-4742-a608-60b0ef6cbd08.svg',
  'party-photo-1.png': 'https://www.figma.com/api/mcp/asset/34bc61cd-2e3d-45bc-98ab-3090bd18d10a.png',
  'party-photo-2.png': 'https://www.figma.com/api/mcp/asset/5b9b81f3-9578-4c6c-9ea3-15b8d616a5b7.png',
  'party-photo-3.png': 'https://www.figma.com/api/mcp/asset/6be0b78b-971d-468b-ac49-5051f64d4830.png',
  'new-year-title.png': 'https://www.figma.com/api/mcp/asset/43f20a16-8474-4696-bc5c-1b5527f7a157.png',
  'step-spoon.png': 'https://www.figma.com/api/mcp/asset/d5e1f052-74d6-4c1a-a0e0-be406e99b4a8.png',
  'step-kettle.png': 'https://www.figma.com/api/mcp/asset/767d4697-10f6-49db-93d5-39629074ca1b.png',
  'step-watch.png': 'https://www.figma.com/api/mcp/asset/75a964d3-e6b6-430a-9ef8-1010aaac0e68.png',
  'step-milk.png': 'https://www.figma.com/api/mcp/asset/be2c82d4-7a6a-49b4-97ab-564b99e970e0.png',
  'prediction-eye.png': 'https://www.figma.com/api/mcp/asset/509b36c8-5808-4abd-bd0b-02a9da975c18.png',
  'prediction-star.png': 'https://www.figma.com/api/mcp/asset/e37e0225-45ec-44de-87cf-899879c4127f.png',
  'prediction-lightning.png': 'https://www.figma.com/api/mcp/asset/3782e3d7-7d12-4532-adc8-d4ef98b887f6.png',
  'prediction-hand.png': 'https://www.figma.com/api/mcp/asset/3092505a-bd2c-4f2b-af5c-14491131e35d.png',
  'prediction-arrow.png': 'https://www.figma.com/api/mcp/asset/733c3f59-01a4-4bab-8d55-a7e2a727b84d.png',
  'prediction-lock.png': 'https://www.figma.com/api/mcp/asset/86f7a35f-f74e-4d45-95ea-e033ef4012f0.png',
  'prediction-goat.png': 'https://www.figma.com/api/mcp/asset/d88eba3e-4d6f-437f-a2f6-b1f77c9bff35.png',
  'prediction-fish.png': 'https://www.figma.com/api/mcp/asset/99c40ef8-d358-4c44-a7fa-f275bdc7bcd5.png',
  'prediction-mushroom.png': 'https://www.figma.com/api/mcp/asset/daaffefe-2ea9-4e36-9b09-a92007ef648a.png',
  'prediction-crown.png': 'https://www.figma.com/api/mcp/asset/348b6118-07f2-41e4-a04b-a00875b034ed.png',
  'final-promo.png': 'https://www.figma.com/api/mcp/asset/29e33df8-da8d-4d72-ac62-1f8f5a02f191.png',
};

await mkdir(assets, { recursive: true });
const check = process.argv.includes('--check');
const force = process.argv.includes('--force');
let okay = 0;
let failed = 0;
for (const [filename, url] of Object.entries(manifest)) {
  const target = join(assets, filename);
  let present = false;
  try { present = (await stat(target)).size > 128; } catch { /* not on disk yet */ }
  if (present && !force) { console.log(`✓ ${filename} — уже загружен`); okay++; continue; }
  if (check) { console.log(`✗ ${filename} — отсутствует`); failed++; continue; }
  try {
    const response = await fetch(url, { redirect: 'follow' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const type = response.headers.get('content-type') || '';
    if (!type.includes('image/') && !type.includes('svg') && !type.includes('octet-stream')) throw new Error(`Неожиданный формат: ${type}`);
    const bytes = Buffer.from(await response.arrayBuffer());
    if (bytes.length < 128) throw new Error('Файл слишком маленький');
    await writeFile(target, bytes);
    console.log(`✓ ${filename} (${(bytes.length / 1024).toFixed(0)} КБ)`);
    okay++;
  } catch (error) {
    console.error(`✗ ${filename}: ${error.message}`);
    failed++;
  }
}
console.log(`\nГотово: ${okay}/${Object.keys(manifest).length}. Ошибок: ${failed}.`);
if (failed) { console.error('Если ссылки истекли, экспортируйте исходные изображения из Figma под именами из списка.'); process.exitCode = 1; }
