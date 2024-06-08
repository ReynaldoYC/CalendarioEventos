self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('v1').then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        './css/style.css',
        './css/bootstrap.min.css',
        './js/app.js',
        './js/auth.js',
        './js/bootstrap.bundle.min.js',
        './js/firebase.js',
        './js/es.global.min.js',
        './js/index.global.min.js',
        './js/',
        './favicon.ico',

        // Agrega aquí otros recursos que quieras cachear
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return; // Ignora las solicitudes que no son GET
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response; // Devuelve la respuesta desde el caché si está disponible
      }

      return fetch(event.request).then((networkResponse) => {
        return caches.open('v1').then((cache) => {
          cache.put(event.request, networkResponse.clone()); // Almacena la respuesta en el caché
          return networkResponse; // Devuelve la respuesta original
        });
      });
    })
  );
});