var o2 = require('../o2mdb.js'),
    query = require('./Query.js'),
    song = require('./Song.js'),
    search = require('./Search.js'),
    _ = o2._,
    $ = o2.$;

function autoSearch() {
  $('input').value = query.getSearchQuery();
  search.displayResults($('input').value, {}, true);
}

function autoPlay() {
  song.getById(query.getSongIdQuery());
}

function init() {
  var paramMatch, i, paramKey, len,
      regex = /[\?&]([^=]+)=/g,
      paramList = [],
      loc = window.location.href;

  var paramDelegator = {
      's': autoSearch,
      'p': autoPlay
  };

  while ((paramMatch = regex.exec(loc)) !== null)
    paramList.push(paramMatch[1]);

  for (i = paramList.length, len = 0; i > len; i--) {
    paramKey = paramList[i-1];
    if (paramDelegator[paramKey]) {
      paramDelegator[paramKey]();
    }
  }
}

module.exports = {
  init: init
};

