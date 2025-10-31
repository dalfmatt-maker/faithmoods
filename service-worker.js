self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", () => clients.claim());

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.open("fm-cache").then(cache =>
      fetch(e.request).then(res => {
        cache.put(e.request, res.clone());
        return res;
      }).catch(() => cache.match(e.request))
    )
  );
});
