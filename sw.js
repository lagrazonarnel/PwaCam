var Cache_Name = 'PwaCam';

var filesToCache = [
  './',
  './index.html',
  './css/styles.css',
  './css/style.css',
  './js/main.js',
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
*/
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }

        return fetch(event.request).then(
          function(response) {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // IMPORTANT: Clone the response. A response is a stream
            // and because we want the browser to consume the response
            // as well as the cache consuming the response, we need
            // to clone it so we have two streams.
            var responseToCache = response.clone();

            caches.open(Cache_Name)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
    );
});

