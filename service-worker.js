self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('v1').then((cache) => {
      return cache.addAll([
        '/CalendarioEventos/',
        '/CalendarioEventos/index.html',
        '/CalendarioEventos/css/style.css',
        '/CalendarioEventos/css/bootstrap.min.css',
        '/CalendarioEventos/js/app.js',
        '/CalendarioEventos/js/auth.js',
        '/CalendarioEventos/js/bootstrap.bundle.min.js',
        '/CalendarioEventos/js/firebase.js',
        '/CalendarioEventos/js/es.global.min.js',
        '/CalendarioEventos/js/index.global.min.js',
        '/CalendarioEventos/favicon.ico',

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