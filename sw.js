/* Service worker Doea Enam: cangkang aplikasi disimpan agar cepat terbuka.
   Halaman: jaringan dulu, cadangan dari simpanan. Panggilan ke server (script.google.com) tidak pernah disimpan. */
const CACHE = 'doea-enam-v1';
const ASET = ['./', 'index.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png', 'favicon-64.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASET)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(k => Promise.all(k.filter(n => n !== CACHE).map(n => caches.delete(n)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;
  e.respondWith(
    fetch(e.request).then(r => {
      if (r.ok) { const salin = r.clone(); caches.open(CACHE).then(c => c.put(e.request, salin)); }
      return r;
    }).catch(() => caches.match(e.request).then(r => r || caches.match('index.html')))
  );
});
