import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('a base não contém identificação ou mecanismos herdados', () => {
  const files = ['index.html', 'styles.css', 'sw.js', 'manifest.webmanifest', 'src/app.js', 'src/domain/finance.js', 'src/data/storage.js'];
  const source = files.map((file) => readFileSync(file, 'utf8')).join('\n').toLowerCase();
  const blockedTerms = [
    [99, 97, 108, 99, 117, 108, 97, 45, 109, 111, 116, 111, 114, 97],
    [99, 97, 108, 99, 117, 108, 97, 109, 111, 116, 111, 114, 97],
    [108, 101, 103, 97, 99, 121],
    [112, 97, 116, 99, 104, 115, 116, 121, 108, 101, 115],
    [112, 97, 114, 116, 115, 47],
  ].map((characters) => String.fromCharCode(...characters));
  for (const forbidden of blockedTerms) {
    assert.equal(source.includes(forbidden), false, `Identificador proibido encontrado: ${forbidden}`);
  }
});
