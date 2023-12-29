importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js');

const CACHE = "pwabuilder-page";

const offlineFallbackPage = "index.html";

if (workbox.navigationPreload.isSupported()) {
  workbox.navigationPreload.enable();
}

self.addEventListener('install', async (event) => {
  event.waitUntil(
    caches.open(CACHE)
    .then((cache) => cache.add(offlineFallbackPage))
    );
});

self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const preloadResp = await event.preloadResponse;

        if (preloadResp) {
          return preloadResp;
        }

        const networkResp = await fetch(event.request);
        return networkResp;
      } catch (error) {

      const cache = await caches.open(CACHE);
      const cachedResp = await cache.match(offlineFallbackPage);
      return cachedResp;
      }
    })());
  }
});
