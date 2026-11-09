// Офлайн-кеш: сначала сеть (всегда свежая версия), без сети — копия из кеша
const C = "nc-v1";
self.addEventListener("install", e => {
  e.waitUntil(caches.open(C).then(c => c.addAll(["./", "./index.html"])));
  self.skipWaiting();
});
self.addEventListener("activate", e => e.waitUntil(clients.claim()));
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const h = new URL(e.request.url).hostname;
  if (h !== location.hostname && h !== "fonts.googleapis.com" && h !== "fonts.gstatic.com") return;
  e.respondWith(
    fetch(e.request).then(r => {
      if (r && (r.ok || r.type === "opaque")){ const cp = r.clone(); caches.open(C).then(c => c.put(e.request, cp)); }
      return r;
    }).catch(() => caches.match(e.request).then(m => m || caches.match("./index.html")))
  );
});
