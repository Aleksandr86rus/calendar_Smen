// sw.js — минимальный сервис-воркер для PWA (кэшируем только статику)

const CACHE_NAME = 'graphik-smen-2026-v1';
const urlsToCache = [
  '/',
  '/calendar_Smen/',
  // добавь сюда свои CSS, JS, иконки и другие важные файлы, если они есть отдельно
  // пример: '/calendar_Smen/style.css', '/calendar_Smen/app.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
  // сразу активируем новый SW, не ждём закрытия вкладок
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    })
  );
  // сразу берём контроль над страницами
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // если есть в кэше — отдаём из кэша
        if (response) {
          return response;
        }
        // иначе идём в сеть (и не кэшируем динамику)
        return fetch(event.request);
      })
  );
});
