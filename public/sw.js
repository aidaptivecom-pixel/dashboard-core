const CACHE_NAME = 'hub-v1';

self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  
  const url = new URL(e.request.url);
  
  // Never cache auth routes or API calls
  if (url.pathname.startsWith('/auth') || 
      url.pathname.startsWith('/login') ||
      url.pathname.startsWith('/api') ||
      url.search.includes('code=')) return;
  
  // Only cache static assets (js, css, images, fonts)
  if (url.pathname.match(/\.(js|css|png|jpg|jpeg|svg|woff2?|ico)$/)) {
    e.respondWith(
      caches.match(e.request).then((cached) => {
        const fetchPromise = fetch(e.request).then((res) => {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(e.request, clone));
          return res;
        });
        return cached || fetchPromise;
      })
    );
  }
});
