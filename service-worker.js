self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('venturalink-cache-v1').then(cache => {
      return cache.addAll([
        '/',
        '/index.html',
        '/about.html',
        '/login.html',
        '/register.html',
        '/styles/mainindex.css',
        '/V.png',
        '/favicon/favicon-96x96.png'
      ]);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
