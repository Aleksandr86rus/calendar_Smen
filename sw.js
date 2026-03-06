// sw.js — минимальный кэширующий service worker для PWA
const CACHE_NAME = 'calendar-smen-v1';
const urlsToCache = [
  '/calendar_Smen/',
  '/calendar_Smen/index.html',
  '/calendar_Smen/manifest.json',
  '/calendar_Smen/icon-192.png',
  '/calendar_Smen/icon-512.png'
  // Добавь сюда другие файлы, если появятся (css, js и т.д.)
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Если есть в кэше — отдаём из кэша
        if (response) {
          return response;
        }
        // Иначе — сеть, и клонируем ответ для кэша
        return fetch(event.request).then(networkResponse => {
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
            return networkResponse;
          }
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });
          return networkResponse;
        });
      })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
