const VERSION = 'sweet-v4';
const ASSETS = [
  './', './index.html', './styles.css', './manifest.webmanifest', './sw.js',
  './js/config.js', './js/normalize.js', './js/game.js', './js/storage.js',
  './js/geo.js', './js/prepare.js', './js/app.js', './js/art.js', './js/photos.js', './assets/mapa.jpg',
  './assets/icons/apple-touch-icon.png', './assets/icons/icon-192.png',
  './assets/icons/icon-512.png', './assets/icons/icon-maskable-512.png', './assets/icons/favicon.png'
];
const CACHE = `sweet-${VERSION}`;
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS))));
self.addEventListener('activate',event=>event.waitUntil((async()=>{for(const key of await caches.keys()) if(key.startsWith('sweet-') && key!==CACHE) await caches.delete(key);await self.clients.claim();})()));
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET' || new URL(event.request.url).origin!==self.location.origin) return;
  event.respondWith((async()=>{const cache=await caches.open(CACHE);const hit=await cache.match(event.request.mode==='navigate'?'./index.html':event.request,{ignoreSearch:true});return hit || fetch(event.request);})());
});
self.addEventListener('message',event=>{
  if(event.data?.type==='SKIP_WAITING') event.waitUntil(self.skipWaiting());
  if(event.data?.type==='STATUS') event.waitUntil((async()=>{const cache=await caches.open(CACHE);const missing=[];for(const url of ASSETS) if(!await cache.match(url,{ignoreSearch:true})) missing.push(url);event.ports[0]?.postMessage({version:VERSION,missing});})());
});
