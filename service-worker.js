self.addEventListener('install', event => {
    console.log('Service Worker installé');
    event.waitUntil(
        caches.open('tiktok-vidown').then(cache => {
            return cache.addAll([
                './',
                './index.html',
                './css/main.css',
                './js/download.js',
            ]);
        })
    );
});

self.addEventListener('activate', event => {
    console.log('Service Worker activé');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
         
                    if (cacheName !== 'tiktok-vidown') {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {

            if (response) {

                fetch(event.request).then(networkResponse => {
  
                    caches.open('tiktok-vidown').then(cache => {
                        cache.put(event.request, networkResponse.clone());
                    });
                });
                return response; 
            }
       
            return fetch(event.request).then(networkResponse => {
                return caches.open('tiktok-vidown').then(cache => {
                    cache.put(event.request, networkResponse.clone());
                    return networkResponse;
                });
            });
        })
    );
});