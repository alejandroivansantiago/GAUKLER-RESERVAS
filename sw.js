// Cambiar este número cada vez que se actualice la app
const CACHE = "gaukler-v2";
const ASSETS = ["./", "./index.html", "./manifest.json"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting(); // Fuerza activación inmediata
});

self.addEventListener("activate", e => {
  // Borra todos los caches viejos
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => {
        console.log("Borrando cache viejo:", k);
        return caches.delete(k);
      }))
    )
  );
  self.clients.claim(); // Toma control de todas las tabs abiertas
});

self.addEventListener("fetch", e => {
  // Network-first para el HTML (siempre fresco), cache para el resto
  if (e.request.url.includes("index.html") || e.request.url.endsWith("/")) {
    e.respondWith(
      fetch(e.request).catch(() => caches.match("./index.html"))
    );
  } else {
    e.respondWith(
      caches.match(e.request).then(r => r || fetch(e.request))
    );
  }
});
