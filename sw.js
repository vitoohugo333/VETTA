const CACHE = 'vetta-shell-v1';
const SHELL = ['./', './index.html', './styles.css', './icon.svg', './manifest.webmanifest', './src/app.js', './src/domain/finance.js', './src/data/storage.js'];
self.addEventListener('install', (event) => event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(SHELL))));
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(caches.match(event.request, { ignoreSearch: true }).then((cached) => cached || fetch(event.request)));
});
