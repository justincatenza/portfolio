const myCurrentCache = 'CacheVersion1';
const allCaches = [
  'index.html',
  'style.css',
  'iphone7.png',
  'iphone6swhite.png',
  'iphone6sblack.png',
  'applelogo800px.jpg',
  'apple_logo-512.png',
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(myCurrentCache).then(function(cache) {
      return cache.addAll(allCaches)
    })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          cacheName != myCurrentCache;
        }).map(function(cName) {
          return caches.delete(cName);
        })
      );
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.open(myCurrentCache).then(function(cache) {
      return cache.match(event.request).then(function (response) {
        return response || fetch(event.request).then(function(response) {
          cache.put(event.request, response.clone());
          return response;
        });
      });
    })
  );
});
