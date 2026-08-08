import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';

const installPage = readFileSync('index.html', 'utf8');
const shell = readFileSync('app-shell.html', 'utf8');
const manifest = JSON.parse(readFileSync('manifest.webmanifest', 'utf8'));
const sw = readFileSync('sw.js', 'utf8');

const bodyPosition = installPage.indexOf('<body');
const redirectPosition = installPage.indexOf("location.replace('./app-shell.html')");
const hidePosition = installPage.indexOf("document.documentElement.classList.add('standalone-launch')");

assert.equal(manifest.start_url, './app-shell.html', 'PWA instalado deve abrir diretamente o app shell');
assert.equal(manifest.short_name, 'VETTA');
assert.ok(hidePosition > -1 && hidePosition < bodyPosition, 'modo standalone deve ser escondido antes do primeiro paint');
assert.ok(redirectPosition > -1 && redirectPosition < bodyPosition, 'instalações antigas devem redirecionar antes do body');
assert.ok(installPage.includes('html.standalone-launch body'));
assert.ok(installPage.includes('visibility:hidden') || installPage.includes('visibility: hidden'));
assert.ok(!installPage.includes("fetch('./app-shell.html'"), 'troca assíncrona causava a piscada da instalação');
assert.ok(sw.includes('vetta-premium-ui-2'), 'cache deve mudar quando a autoridade ativa ganha novos assets');
assert.ok(sw.includes('HAD_ACTIVE_WORKER'), 'primeira instalação e atualização devem permanecer estados distintos');
for (const asset of ['./ui/main.js','./ui/context.js','./ui/model.js','./ui/store.js','./ui/premium.css','./ui/interaction.js','./ui/friendly.css']) assert.ok(sw.includes(`'${asset}'`), `${asset} deve existir offline`);
assert.ok(!sw.includes('refactor-360.js'), 'cache ativo não deve misturar a UI antiga');
assert.ok(!sw.includes('app.js?v='), 'cache ativo não deve carregar o controlador visual legado');
assert.ok(shell.includes('<script type="module" src="./ui/main.js"></script>'));
assert.ok(shell.includes('<script type="module" src="./ui/interaction.js"></script>'));
assert.ok(shell.includes('<link href="./ui/friendly.css" rel="stylesheet">'));
assert.ok(!shell.includes('maximum-scale=1') && !shell.includes('user-scalable=no'), 'zoom de acessibilidade deve permanecer disponível');
assert.ok(!sw.includes('location.reload') && !sw.includes('client.navigate("./app-shell.html")'));

console.log('PWA standalone launch + friendly UX contract passed');
