const CACHE_NAME = "solitaire-v1";

// オフライン時に使うリソースを事前にキャッシュ
const OFFLINE_URLS = [
  "./",
  "./index.html"
];

self.addEventListener("install", (event) => {
  // 初回インストール時にキャッシュを作成
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(OFFLINE_URLS))
  );
});

self.addEventListener("fetch", (event) => {
  // GETリクエストのみ対象
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      // キャッシュがあればそれを返し、なければネットワークへ
      return cached || fetch(event.request);
    })
  );
});
