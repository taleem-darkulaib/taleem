// Simple offline-first cache for app shell
const CACHE_NAME = 'pwa-shell-v1';
const ASSETS = [
  '/',
  '/play.html',
  '/app.js',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  // Network-first for HTML, cache-first for others
  if (request.mode === 'navigate' || (request.destination === 'document')) {
    event.respondWith(networkThenCache(request));
  } else {
    event.respondWith(cacheThenNetwork(request));
  }
});

async function cacheThenNetwork(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  const resp = await fetch(request);
  const cache = await caches.open(CACHE_NAME);
  cache.put(request, resp.clone());
  return resp;
}

async function networkThenCache(request) {
  try {
    const resp = await fetch(request);
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, resp.clone());
    return resp;
  } catch (e) {
    const cached = await caches.match(request);
    if (cached) return cached;
    return new Response('Offline', { status: 503, statusText: 'Offline' });
  }
}
