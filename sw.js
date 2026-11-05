// Service worker de REMEXCUB.
// Solo maneja la navegación de esta misma web: red primero y, si no hay internet, la última copia.
// No toca las tasas (script.google.com) ni nada de otros dominios: siempre salen frescas.
const CACHE = 'remexcub-v1';

self.addEventListener('install', (e) => {
    e.waitUntil(caches.open(CACHE).then((c) => c.add('/')).catch(() => {}));
    self.skipWaiting();
});

self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys()
            .then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
            .then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (e) => {
    const req = e.request;
    if (req.method !== 'GET' || req.mode !== 'navigate') return;
    if (new URL(req.url).origin !== self.location.origin) return;
    e.respondWith(
        fetch(req)
            .then((res) => {
                const copia = res.clone();
                caches.open(CACHE).then((c) => c.put(req, copia)).catch(() => {});
                return res;
            })
            .catch(() =>
                caches.match(req, { ignoreSearch: true })
                    .then((r) => r || caches.match('/'))
                    .then((r) => r || Response.error())
            )
    );
});
