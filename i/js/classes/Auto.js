var o2 = require('../o2mdb.js'),
    query = require('./Query.js'),
    song = require('./Song.js'),
    search = require('./Search.js'),
    _ = o2._,
    $ = o2.$;

module.exports = {

  init: function() {
    var paramMatch, i, paramKey, len,
        regex = /[\?&]([^=]+)=/g,
        paramList = [],
        loc = window.location.href;

    var paramDelegator = {
        s: this.search,
        p: this.play
    };

    while ((paramMatch = regex.exec(loc)) !== null)
      paramList.push(paramMatch[1]);

    for (i = paramList.length, len = 0; i > len; i--) {
      paramKey = paramList[i-1];
      if (paramDelegator[paramKey]) {
        paramDelegator[paramKey]();
      }
    }
  },

  search: function() {
    $('input').value = query.getSearchQuery();
    search.displayResults($('input').value, {}, true);
  },

  play: function() {
    song.getById(query.getSongIdQuery());
  }

};

