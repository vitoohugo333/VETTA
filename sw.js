const CACHE = 'calculaae-install-flow-6';
const APP_SHELL = [
  './',
  './index.html',
  './app-shell.html',
  './app.js?v=3.5.1',
  './styles.css',
  './planning-1a.js?v=1',
  './history-1b.js?v=1',
  './today-1c.js?v=1',
  './planning-3.js?v=1',
  './record-2.js?v=1',
  './history-4.js?v=1',
  './more-5.js?v=1',
  './onboarding-6.js?v=1',
  './refactor-360.js?v=1',
  './refactor-360.css?v=1',
  './manifest.webmanifest',
  './icon.svg',
  './icon-192.png',
  './icon-512.png'
];

// Na primeira instalação ainda não existe um worker ativo anterior. Em uma
// atualização existe. A distinção impede reload no meio de uma tarefa nova,
// mas preserva a troca imediata quando uma versão anterior está sendo trocada.
const HAD_ACTIVE_WORKER = Boolean(self.registration.active);

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await cache.addAll(APP_SHELL);
    await self.skipWaiting();
  })());
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
    const payload = event.data.payload || {};
    const title = payload.title || 'VETTA';
    event.waitUntil(self.registration.showNotification(title, {
      body: payload.body || '',
      tag: payload.tag || undefined,
      icon: './icon-192.png',
      badge: './icon-192.png',
      data: { url: payload.url || './app-shell.html' },
    }));
  }
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const targetUrl = new URL(event.notification.data?.url || './app-shell.html', self.location.href).href;
  event.waitUntil((async () => {
    const clientsList = await clients.matchAll({ type: 'window', includeUncontrolled: true });
    const current = clientsList.find(client => new URL(client.url).origin === self.location.origin);
    if (current) {
      await current.focus();
      if ('navigate' in current) await current.navigate(targetUrl);
      return;
    }
    await clients.openWindow(targetUrl);
  })());
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith((async () => {
    try {
      const response = await fetch(event.request, { cache: 'no-store' });
      if (response.ok) {
        const cache = await caches.open(CACHE);
        await cache.put(event.request, response.clone());
      }
      return response;
    } catch (error) {
      const cached = await caches.match(event.request, { ignoreSearch: true });
      if (cached) return cached;
      if (event.request.mode === 'navigate') {
        return (await caches.match('./index.html')) || (await caches.match('./'));
      }
      throw error;
    }
  })());
});
