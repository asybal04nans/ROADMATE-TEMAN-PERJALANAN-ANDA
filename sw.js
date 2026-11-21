// Service worker RoadMate: menyimpan kerangka aplikasi agar terbuka tanpa internet.
// Data (CSV Google Sheets) disimpan terpisah oleh index.html di perangkat.
const VERSI = 'roadmate-v3';
const INTI = ['./', 'index.html', 'manifest.webmanifest', 'icons/icon-192.png', 'icons/icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSI).then(c => c.addAll(INTI)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSI).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return; // data dan Google Maps tidak disentuh
  // Cache dulu, lalu perbarui di latar belakang agar versi baru terambil pada kunjungan berikutnya.
  e.respondWith(
    caches.match(req, { ignoreSearch: true }).then(hit => {
      const jaringan = fetch(req).then(res => {
        if (res && res.ok) { const salinan = res.clone(); caches.open(VERSI).then(c => c.put(req, salinan)); }
        return res;
      }).catch(() => hit);
      return hit || jaringan;
    })
  );
});
