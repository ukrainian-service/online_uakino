
// ==UserScript==
// @name         UAKino + eneyida + kinoukr for Lampa
// @version      1.0
// @description  Додає підтримку UAKino, eneyida та kinoukr у Lampa
// ==/UserScript==

(function () {
  if (!window.lampa_plugin_online) return;

  window.lampa_plugin_online.push({
    name: 'UAKino',
    show: true,
    url: 'https://uakino.me/',
    search: async function(title, original_title, year) {
      const query = encodeURIComponent(title);
      const searchUrl = `https://uakino.me/index.php?do=search&subaction=search&story=${query}`;
      const html = await Lampa.Utils.request(searchUrl, 'text');
      const dom = $('<div>' + html + '</div>');
      const items = [];

      dom.find('.shortstory').each((i, el) => {
        const item = $(el);
        const href = item.find('a.shortstory__img-link').attr('href');
        const name = item.find('.shortstory__title').text().trim();
        if (href) {
          items.push({
            title: name,
            url: href,
            method: 'call'
          });
        }
      });

      return items;
    },
    get: async function(url) {
      const html = await Lampa.Utils.request(url, 'text');
      const match = html.match(/<iframe[^>]+data-src="([^"]+)"/i);
      if (match) {
        return [{
          title: 'UAKino плеєр',
          url: match[1],
          method: 'play'
        }];
      }
      return [];
    }
  });

  // обовʼязково eneyida
  window.lampa_plugin_online.push({
    name: 'eneyida',
    show: true,
    url: 'https://www.eneyida.tv/',
    search: function(title, original_title, year) {
      return Lampa.Utils.request(`https://lampa-api.cinemate.cc/eneyida/search?title=${encodeURIComponent(title)}&year=${year}`, 'json');
    },
    get: function(url) {
      return Lampa.Utils.request(url, 'json');
    }
  });

  // обовʼязково kinoukr
  window.lampa_plugin_online.push({
    name: 'kinoukr',
    show: true,
    url: 'https://kinoukr.com/',
    search: function(title, original_title, year) {
      return Lampa.Utils.request(`https://lampa-api.cinemate.cc/kinoukr/search?title=${encodeURIComponent(title)}&year=${year}`, 'json');
    },
    get: function(url) {
      return Lampa.Utils.request(url, 'json');
    }
  });
})();
