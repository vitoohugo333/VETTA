import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(process.argv[2] || '.');
const baseURL = process.env.VETTA_TEST_BASE_URL;
const files = JSON.parse(process.env.VETTA_VERIFY_FILES || '[]');
const attempts = Number(process.env.VETTA_PUBLISH_ATTEMPTS || 24);
const delayMs = Number(process.env.VETTA_PUBLISH_DELAY_MS || 10_000);

if (!baseURL || files.length === 0) {
  console.log('Comparação pública não necessária para esta branch.');
  process.exit(0);
}

const digest = value => createHash('sha256').update(value).digest('hex');
const sleep = ms => new Promise(resolvePromise => setTimeout(resolvePromise, ms));

for (let attempt = 1; attempt <= attempts; attempt += 1) {
  let complete = true;
  const failures = [];
  for (const file of files) {
    const local = readFileSync(resolve(root, file));
    const url = new URL(file.replace(/^\//, ''), baseURL.endsWith('/') ? baseURL : `${baseURL}/`);
    try {
      const response = await fetch(url, { cache: 'no-store' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const remote = Buffer.from(await response.arrayBuffer());
      if (digest(local) !== digest(remote)) {
        complete = false;
        failures.push(`${file}: conteúdo ainda diferente`);
      }
    } catch (error) {
      complete = false;
      failures.push(`${file}: ${error.message}`);
    }
  }
  if (complete) {
    console.log(`Ambiente publicado corresponde aos arquivos relevantes após ${attempt} tentativa(s).`);
    process.exit(0);
  }
  console.log(`Tentativa ${attempt}/${attempts}: ${failures.join(' | ')}`);
  if (attempt < attempts) await sleep(delayMs);
}

throw new Error('O ambiente publicado não correspondeu à branch dentro da janela de espera.');
