const CACHE_NAME = 'version-1';
const urlsToCache = [ 'index.html' , 'offline.html'];
const self = this;

//install SW
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('caches opened');

            return cache.addAll(urlsToCache);
        })
    )
})

//listen for events
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then(() => {
            return fetch(event.request).catch(() => caches.match('offline.html'))
        })
    )
})

//activate SW
self.addEventListener('activate', (event) => {
    const cacheWhiteLists = [];
    cacheWhiteLists.push(CACHE_NAME);

    event.waitUntil(caches.keys().then((cacheNames) => Promise.all(
        cacheNames.map(cacheName => {
            if(!cacheWhiteLists.includes(cacheName)){
                return caches.delete(cacheName);
            }
        })
    )))
})