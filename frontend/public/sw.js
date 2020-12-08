// Update cache names any time any of the cached files change.
const CACHE_NAME = 'static-cache-v3'

const FILES_TO_CACHE = [
  '/offline.html',
  '/images/icons/icon-128x128.png',
  '/images/icons/icon-144x144.png',
  '/images/icons/icon-152x152.png',
  '/images/icons/icon-192x192.png',
  '/images/icons/icon-384x384.png',
  '/images/icons/icon-512x512-transparent.png',
  '/images/icons/icon-512x512.png',
  '/images/icons/icon-72x72.png',
  '/images/icons/icon-96x96.png',
  '/favicon.ico'
]

self.addEventListener('install', evt => {
  console.log('[ServiceWorker] Install')

  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE)
    })
  )

  self.skipWaiting()
})

self.addEventListener('activate', evt => {
  // Remove previous cached data from disk.

  evt.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          return caches.delete(key)
        }
      }))
    })
  )

  self.clients.claim()
})

self.addEventListener('fetch', (evt) => {
  // Add fetch event handler here.

  if (evt.request.mode !== 'navigate') {
    // Not a page navigation, bail.
    return
  }
  evt.respondWith(
    fetch(evt.request)
      .catch(() => {
        return caches.open(CACHE_NAME)
          .then((cache) => {
            return cache.match('offline.html')
          })
      })
  )
})
