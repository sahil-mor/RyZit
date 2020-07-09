var STATIC_CACHE = 'static-v2'
var DYNAMIC_CACHE = 'dynmaic-v1'

var staticFiles = [
    '/',
    '/signup',
    '/offline',
    '../views/index/home.ejs',
    '../views/index/signup.ejs',
    './assets/img/brand/favicon.png',
    'https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700',
    './assets/vendor/nucleo/css/nucleo.css',
    './assets/vendor/@fortawesome/fontawesome-free/css/all.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css',
    './assets/css/argon.css?v=1.2.0',
    'https://i.ibb.co/dfr3Rzz/43886039.jpg',
    'https://i.ibb.co/BLgM91C/IMG-20200708-164831.jpg',
    './assets/vendor/jquery/dist/jquery.min.js',
    './assets/vendor/bootstrap/dist/js/bootstrap.bundle.min.js',
    './assets/vendor/js-cookie/js.cookie.js',
    './assets/vendor/jquery.scrollbar/jquery.scrollbar.min.js',
    './assets/vendor/jquery-scroll-lock/dist/jquery-scrollLock.min.js',
    './assets/vendor/chart.js/dist/Chart.min.js',
    './assets/vendor/chart.js/dist/Chart.extension.js',
    './assets/js/argon.js?v=1.2.0',
    './assets/img/brand/blue.png',
    './assets/img/brand/white.png',
    './assets/img/brand/Ryzit Dark.png',
    './manifest.json',
    './icons/48x48.png',
    './icons/96x96.png',
    './icons/144x144.png',
    './icons/384x384.png',
    './icons/512x512.png',
    './assets/vendor/nucleo/fonts/nucleo-icons.woff',
    './assets/vendor/nucleo/fonts/nucleo-icons.eot',
    './assets/vendor/nucleo/fonts/nucleo-icons.svg',
    './assets/vendor/nucleo/fonts/nucleo-icons.ttf',
    './assets/vendor/nucleo/fonts/nucleo-icons.woff2',
    '../views/offline/offline.ejs',
]

function trimCache(cacheName,maxItems){
  caches.open(cacheName)
  .then( cache => {
    return cache.keys()
    .then( keys => {
      if(keys.length > maxItems ){
        cache.delete(keys[0])
        .then( trimCache(cacheName,maxItems) )
      }
    } )
  } )
}

self.addEventListener('install', (event) => {
    console.log('[Service worker] installing Service worker ... ')
    event.waitUntil(
        caches.open(STATIC_CACHE)
        .then( cache => {
            cache.addAll(staticFiles)
        } )
    )
} )

self.addEventListener('activate', (event) => {
    console.log('[Service worker] activating Service worker ... ')
    event.waitUntil(
        caches.keys()
          .then(function(keyList) {
            return Promise.all(keyList.map(function(key) {
              if (key !== STATIC_CACHE && key !== DYNAMIC_CACHE) {
                console.log('[Service Worker] Removing old cache.', key);
                return caches.delete(key);
              }
            }));
          })
      );
      return self.clients.claim();
} )

function isInArray(string, array ){
    for(var i = 0 ; i < array.length ; i++){
      if( array[i] === string )
        return true;
    }
    return false;
  }
  

self.addEventListener('fetch', (event) => {
    console.log('[Service worker fetching ....')
    if( isInArray(event.request.url,staticFiles) ){
        console.log("was in arr")
        event.respondWith(
            caches.match(event.request)
        )
    }else{
        event.respondWith(
            fetch(event.request)
            .then( res => {
                return caches.open(DYNAMIC_CACHE)
                .then( cache => {
                    trimCache(DYNAMIC_CACHE,50)
                    cache.put(event.request.url,res.clone())
                    return res
                } )
            } )
            .catch( err => {
                console.log(err)
                return caches.match(event.request)
                .then( response => {
                    if(response){
                        console.log("response found")
                        return response
                    }else{
                        console.log("offline wala show karna h")
                        return caches.open(STATIC_CACHE)
                        .then(cache => {
                            return cache.match('offline')
                        })
                    }
                } )
            } )
        )
    }
} )

 