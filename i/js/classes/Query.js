//written by DextOr from stackoverflow.com [ http://stackoverflow.com/a/901144 ]
function getQueryString(a){a=a.replace(/[\[]/,"\\[").replace(/[\]]/,"\\]");a=(new RegExp("[\\?&]"+a+"=([^&#]*)")).exec(location.search);return a===null?"":decodeURIComponent(a[1].replace(/\+/g," "));}

var wh = window.history,
    q, search, sort, songId;

module.exports = {

  getSearchQuery: function() {
    return unescape(getQueryString('s')) || '';
  },

  getSongIdQuery: function() {
    return unescape(getQueryString('p')) || '';
  },

  getSortQuery: function() {
    return unescape(getQueryString('sort')) || 'creationDate';
  },

  write: function(obj) {
    q = '?';
    if ((search = obj.search || this.getSearchQuery()))
      q += 's=' + search + '&';
    if ((sort = obj.sort || this.getSortQuery()))
      q += 'sort=' + sort;
    if ((songId = obj.songId || this.getSongIdQuery()))
      q += '&p=' + songId;

    wh.replaceState('o2', 'o2', q);
  }

};

