var Cache_Name = 'PwaCam';

var filesToCache = [

  '/',
  './index.html',
  'css/styles.css',
  'css/style.css',
  'js/main.js',
  './app.js'
];



/* Start the service worker and cache all of the app's content */

self.addEventListener('install', function(e) {

  e.waitUntil(

    caches.open(Cache_Name).then(function(cache) {

      return cache.addAll(filesToCache);

    })

  );

});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (Cache_Name !== cacheName) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});


/* Serve cached content when offline 

self.addEventListener('fetch', function(e) {

  e.respondWith(

    caches.match(e.request).then(function(response) {

      return response || fetch(e.request);

    })

  );

});
*/
self.addEventListener('fetch', function(event) {
    event.respondWith(
        fetch(event.request).catch(function() {
            return caches.match(event.request).then(function(response) {
                if (response) {
                    return response;
                } else if (event.request.headers.get("accept").includes("text/html")) {
                    return caches.match("/index.html");
                }
            });
        })
    );
});


