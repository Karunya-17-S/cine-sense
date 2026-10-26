// CineSense service worker
// - lets Chrome install CineSense as an app
// - keeps the app working offline (last loaded movies are reused)
// When you change index.html, bump VERSION so phones pick up the new files.
const VERSION = 'cinesense-v1';
const API_CACHE = 'cinesense-api-v1';
const FONT_CACHE = 'cinesense-fonts-v1';
const SHELL = [
  './', './index.html', './config.js', './manifest.json',
  './icons/icon-192.png', './icons/icon-512.png', './icons/maskable-512.png',
  './icons/apple-touch-icon.png', './icons/favicon-64.png',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  const keep = [VERSION, API_CACHE, FONT_CACHE];
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => !keep.includes(k)).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

// Network first: always try for fresh data, fall back to the saved copy when offline
async function networkFirst(req, cacheName, fallbackUrl) {
  const cache = await caches.open(cacheName);
  try {
    const res = await fetch(req);
    if (res.ok) cache.put(req, res.clone());
    return res;
  } catch (err) {
    const hit = await cache.match(req, { ignoreSearch: req.mode === 'navigate' });
    if (hit) return hit;
    if (fallbackUrl) { const fb = await cache.match(fallbackUrl); if (fb) return fb; }
    throw err;
  }
}
// Stale while revalidate: answer instantly from cache, refresh it in the background
async function staleWhileRevalidate(req, cacheName) {
  const cache = await caches.open(cacheName);
  const hit = await cache.match(req);
  const net = fetch(req).then(res => { if (res.ok || res.type === 'opaque') cache.put(req, res.clone()); return res; }).catch(() => hit);
  return hit || net;
}
async function trim(cacheName, max) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  for (let i = 0; i < keys.length - max; i++) await cache.delete(keys[i]);
}

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  if (url.origin === self.location.origin) {
    // the page itself and the API key file: fresh when online
    if (req.mode === 'navigate' || url.pathname.endsWith('/index.html') || url.pathname.endsWith('/config.js')) {
      e.respondWith(networkFirst(req, VERSION, './index.html'));
    } else {
      e.respondWith(staleWhileRevalidate(req, VERSION));
    }
    return;
  }
  if (url.hostname === 'api.themoviedb.org') {
    e.respondWith(networkFirst(req, API_CACHE).finally(() => trim(API_CACHE, 150)));
    return;
  }
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    e.respondWith(staleWhileRevalidate(req, FONT_CACHE));
  }
  // TMDB posters are left to the browser's normal cache; offline, the app draws its own artwork instead
});
