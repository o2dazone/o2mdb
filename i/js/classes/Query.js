(function(w,d, o2, wh){
  'use strict';

  var fn = o2.fn;

  fn.query = (function(){
    //written by DextOr from stackoverflow.com [ http://stackoverflow.com/a/901144 ]
    function getQueryString(a){a=a.replace(/[\[]/,"\\[").replace(/[\]]/,"\\]");a=(new RegExp("[\\?&]"+a+"=([^&#]*)")).exec(location.search);return a===null?"":decodeURIComponent(a[1].replace(/\+/g," "));}

    function getSearchQuery() {
      return unescape(getQueryString('s')) || '';
    }

    function getSongIdQuery() {
      return unescape(getQueryString('p')) || '';
    }

    function getSortQuery() {
      return unescape(getQueryString('sort')) || 'creationDate';
    }

    var q, search, sort, songId;
    function write(obj) {
      q = '?';
      if ((search = obj.search || getSearchQuery()))
        q += 's=' + search + '&';
      if ((sort = obj.sort || getSortQuery()))
        q += 'sort=' + sort;
      if ((songId = obj.songId || getSongIdQuery()))
        q += '&p=' + songId;

      wh.replaceState('o2', 'o2', q);
    }

    return {
      write: write,
      getSongIdQuery: getSongIdQuery,
      getSearchQuery: getSearchQuery,
      getSortQuery: getSortQuery
    };

  }());

}(window, document, window.o2, window.history));
