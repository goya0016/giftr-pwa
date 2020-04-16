const staticCacheName = 'static-cache-giftr';
const dynamicCacheName = 'dynamic-cache-giftr';
const assets = [
    '/',
    '/index.html',
    './fallback.html',
    '/img/icon72.png',
    '/img/icon96.png',
    '/img/icon128.png',
    '/img/icon144.png',
    '/img/icon152.png',
    '/img/icon192.png',
    '/img/icon384.png',
    '/img/icon512.png',
    // '/favicon.ico',
    '/css/main.css',
    '/css/gifts.css',
    // '/css/materialize.css',
    '/js/main.js',
    '/js/gifts.js',
    // '/js/materialize.js',
   "https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js",
    "https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css",
    'https://fonts.googleapis.com/icon?family=Material+Icons',
    'https://fonts.gstatic.com/s/materialicons/v50/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2',

];

const limitCacheSize = (name, size) => {
    caches.open(name).then(cache => {
        cache.keys().then(keys => {
            if (keys.length > size) {
                cache.delete(keys[0]).then(limitCacheSize(name, size));
            }
        })
    })
};

self.addEventListener("install", evt => {

    evt.waitUntil(
        caches.open(staticCacheName).then(cache => {
            console.log("caching assets");
            cache.addAll(assets);
        })
    );

});

self.addEventListener("activate", evt => {
    evt.waitUntil(
        caches.keys().then(keys => {

            return Promise.all(keys
                .filter(key => key !== staticCacheName && key !== dynamicCacheName)
                .map(key => caches.delete(key))
            )
        })
    );
});

self.addEventListener("fetch", evt => {

    evt.respondWith(
        caches.match(evt.request).then(cacheRes => {
            return cacheRes || fetch(evt.request).then(fetchRes => {
                return caches.open(dynamicCacheName).then(cache => {
                    cache.put(evt.request.url, fetchRes.clone());
                    limitCacheSize(dynamicCacheName, 20);
                    return fetchRes;

                })
            });
        }).catch(() => {
            if (evt.request.url.indexOf('.html') > -1) {

                return caches.match('./fallback.html');
            }
        })
    );
});