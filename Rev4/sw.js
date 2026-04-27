// インストール時に必要なファイルをキャッシュする
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open('solitaire').then(cache => {
      return cache.addAll([
        './',
        './Minimalsolitaire.html'
      ]);
    })
  );
});