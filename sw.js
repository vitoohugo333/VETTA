const CACHE = 'vetta-premium-ui-1';
const HAD_ACTIVE_WORKER = Boolean(self.registration.active);
const APP_SHELL = [
  './', './index.html', './app-shell.html',
  './ui/main.js', './ui/context.js', './ui/model.js', './ui/store.js', './ui/premium.css',
  './ui/screens/dashboard.js', './ui/screens/planning.js', './ui/screens/record.js', './ui/screens/results.js', './ui/screens/more.js', './ui/screens/onboarding.js',
  './manifest.webmanifest', './icon.svg', './icon-192.png', './icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(APP_SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)));
    if (HAD_ACTIVE_WORKER) await self.clients.claim();
  })());
});

self.addEventListener('message', event => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
  if (event.data?.type === 'SHOW_CONTEXT_NOTIFICATION') {
    const { title = 'VETTA', body = '', targetUrl = './app-shell.html' } = event.data;
    event.waitUntil(self.registration.showNotification(title, { body, icon: './icon-192.png', badge: './icon-192.png', data: { targetUrl } }));
  }
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const targetUrl = event.notification.data?.targetUrl || './app-shell.html';
  event.waitUntil((async () => {
    const target = new URL(targetUrl, self.registration.scope).href;
    const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const client of windows) {
      if ('focus' in client) { await client.navigate(target); return client.focus(); }
    }
    return self.clients.openWindow(target);
  })());
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  event.respondWith((async () => {
    try {
      const response = await fetch(request);
      if (response && response.ok) {
        const cache = await caches.open(CACHE);
        cache.put(request, response.clone()).catch(() => {});
      }
      return response;
    } catch (error) {
      const cached = await caches.match(request);
      if (cached) return cached;
      if (request.mode === 'navigate') return (await caches.match('./app-shell.html')) || (await caches.match('./index.html')) || (await caches.match('./'));
      throw error;
    }
  })());
});
