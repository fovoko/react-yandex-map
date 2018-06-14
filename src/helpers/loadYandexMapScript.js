
let yandexLoadPromise = null;

export default function loadYandexMapScript(src) {
  src = src || 'https://api-maps.yandex.ru/2.1/?lang=en_RU';
  yandexLoadPromise = yandexLoadPromise || new Promise((resolve, reject) => {
    var elem = document.createElement('script');
    elem.type = 'text/javascript';
    elem.src = src;
    elem.onload = resolve;
    elem.onerror = function (e) {
      return reject(e);
    };
    document.body.appendChild(elem);
  }).then(() => {
    var ns = getNsParamValue(src);
    if (ns && ns !== 'ymaps') {
      (1, eval)('var ymaps = ' + ns + ';');
    }
    return new Promise((resolve) => {
      if (!global.ymaps) {
        throw new Error('Failed to find ymaps in the global scope');
      }
      if (!global.ymaps.ready) {
        throw new Error('ymaps.ready is missing');
      }
      return window.ymaps.ready(resolve);
    });
  });
  return yandexLoadPromise;
}

function getNsParamValue(url) {
  var results = RegExp('[\\?&]ns=([^&#]*)').exec(url);
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}
