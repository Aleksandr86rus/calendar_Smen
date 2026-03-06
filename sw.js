const CACHE_NAME = 'shift-calendar-v2';
const ASSETS = [
  '/calendar_Smen/',
  '/calendar_Smen/index.html',
  '/calendar_Smen/manifest.json'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
});

self.addEventListener('fetch', (e) => {
  e.respondWith(caches.match(e.request).then(res => res || fetch(e.request)));
});
