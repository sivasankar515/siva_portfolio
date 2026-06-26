// service-worker.js
const CACHE_NAME = 'portfolio-v1';
const CRITICAL_URLS = [
    './',
    'index.html',
    'style.css',
    'script.js',
    'siva.jpg'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Caching critical resources');
                return cache.addAll(CRITICAL_URLS);
            })
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});

// Sync storage when coming back online
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-storage') {
        event.waitUntil(syncStorageData());
    }
});

async function syncStorageData() {
    console.log('Syncing storage data...');
    // Implement storage sync logic here
}