// Mozilla Service Worker Cookbook 'cache and update' recipe: https://serviceworke.rs/strategy-cache-and-update_service-worker_doc.html
var CACHE = 'cache-and-update';

self.addEventListener('install', function(evt) {
    console.log('The service worker is being installed.');
    evt.waitUntil(precache());
});

self.addEventListener('fetch', function(evt) {
    console.log('The service worker is serving the asset.');
    evt.respondWith(fromCache(evt.request));

    evt.waitUntil(update(evt.request));
});

function precache() {
    return caches.open(CACHE).then(function (cache) {
        return cache.addAll([
          './index3.html',
          './child.html',
          './favicon.ico',
          './src/main.js',
          './main.css',
          './normalize.css',
          './src/reg-service-worker.js',
          './node_modules/lit-html/lit-html.js',
          './node_modules/lit-html/lib/default-template-processor.js',
          './node_modules/lit-html/lib/template-result.js',
          './node_modules/lit-html/lib/directive.js',
          './node_modules/lit-html/lib/dom.js',
          './node_modules/lit-html/lib/part.js',
          './node_modules/lit-html/lib/parts.js',
          './node_modules/lit-html/lib/render.js',
          './node_modules/lit-html/lib/template-factory.js',
          './node_modules/lit-html/lib/template-instance.js',
          './node_modules/lit-html/lib/template.js',

        ]);
    });
  }

  function fromCache(request) {
    return caches.open(CACHE).then(function (cache) {
      return cache.match(request).then(function (matching) {
        return matching || Promise.reject('no-match');
      });
    });
  }

  function update(request) {
    return caches.open(CACHE).then(function (cache) {
      return fetch(request).then(function (response) {
        return cache.put(request, response);
      });
    });
  }