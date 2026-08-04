import { readFileSync } from 'node:fs';

const changedFileList = process.argv[2];
const forcedMode = (process.argv[3] || 'auto').toLowerCase();
const files = changedFileList
  ? readFileSync(changedFileList, 'utf8').split(/\r?\n/).map(value => value.trim()).filter(Boolean)
  : [];

const writeOutput = (key, value) => {
  process.stdout.write(`${key}=${value}\n`);
};

if (forcedMode === 'full' || forcedMode === 'published' || files.length === 0) {
  writeOutput('profile', 'full');
  writeOutput('browser_matrix', JSON.stringify(['chromium', 'firefox', 'webkit']));
  writeOutput('published_required', 'true');
  process.exit(0);
}

const allMatch = pattern => files.every(file => pattern.test(file));
const anyMatch = pattern => files.some(file => pattern.test(file));

const docsOnly = allMatch(/^(?:[^/]+\.md|docs\/|\.github\/ISSUE_TEMPLATE\/)/i);
const pwa = anyMatch(/(?:^|\/)(?:sw\.js|manifest\.webmanifest|netlify\.toml|_headers|_redirects)$|icon(?:-|\.)|netlify\/edge-functions\//i);
const critical = anyMatch(/(?:^|\/)(?:app\.js|storage|migration|calculation|finance|money|cost|record|data|schema)/i);
const ui = anyMatch(/(?:^|\/)(?:styles\.css|index\.html|app-shell\.html)|\.(?:css|html|svg)$/i);
const engineering = anyMatch(/^(?:tests\/|scripts\/ci\/|ci\/|\.github\/workflows\/)|(?:^|\/)(?:package\.json|playwright\.config\.js)$/i);

if (docsOnly) {
  writeOutput('profile', 'docs');
  writeOutput('browser_matrix', '[]');
  writeOutput('published_required', 'false');
} else if (pwa) {
  writeOutput('profile', 'pwa');
  writeOutput('browser_matrix', JSON.stringify(['chromium', 'firefox', 'webkit']));
  writeOutput('published_required', 'true');
} else if (critical) {
  writeOutput('profile', 'critical');
  writeOutput('browser_matrix', JSON.stringify(['chromium', 'firefox', 'webkit']));
  writeOutput('published_required', 'true');
} else if (ui) {
  writeOutput('profile', 'ui');
  writeOutput('browser_matrix', JSON.stringify(['chromium', 'firefox', 'webkit']));
  writeOutput('published_required', 'true');
} else if (engineering) {
  writeOutput('profile', 'engineering');
  writeOutput('browser_matrix', JSON.stringify(['chromium']));
  writeOutput('published_required', 'false');
} else {
  writeOutput('profile', 'full');
  writeOutput('browser_matrix', JSON.stringify(['chromium', 'firefox', 'webkit']));
  writeOutput('published_required', 'true');
}
