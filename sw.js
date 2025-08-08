// Service Worker for Shortcut Sensei
// Provides offline functionality and caching

const CACHE_NAME = 'shortcut-sensei-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/main-styles.css',
  '/main-nav.js',
  '/all-applications.html',
  '/blogs.html',
  '/About.htm',
  // Application pages
  '/Google Chrome.html',
  '/Visual Studio.html',
  '/Microsoft Excell.htm',
  '/Microsoft Word.htm',
  '/Adobe PhotoShop.html',
  '/Discord.html',
  '/Windows_11.html',
  // Images
  '/Google_Chrome.jpg',
  '/vscode.png',
  '/excell1.jpg',
  '/ps.jpg',
  '/discord.jpg',
  '/win11.jpg'
];

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
