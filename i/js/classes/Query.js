(function(w,d, o2, wh){
  'use strict';

  var fn = o2.fn;

  fn.query = (function(){
    //written by DextOr from stackoverflow.com [ http://stackoverflow.com/a/901144 ]
    function getQueryString(a){a=a.replace(/[\[]/,"\\[").replace(/[\]]/,"\\]");a=(new RegExp("[\\?&]"+a+"=([^&#]*)")).exec(location.search);return a===null?"":decodeURIComponent(a[1].replace(/\+/g," "));}

    function pushHistoryState(name, param) {
      wh.replaceState('searchResults', name, param);
    }

    function getSearchQuery() {
      return unescape(getQueryString('s')) || '';
    }

    function getSongIdQuery() {
      return unescape(getQueryString('p')) || '';
    }

    function getSortQuery() {
      return unescape(getQueryString('sort')) || 'creationDate';
    }

    var q;
    function write(historyName, searchQuery, sortQuery, songQuery) {
      q = '?';
      if ((searchQuery = searchQuery || getSearchQuery()))
        q += 's=' + searchQuery + '&';
      if ((sortQuery = sortQuery || getSortQuery()))
        q += 'sort=' + sortQuery + '&';
      if ((songQuery = songQuery || getSongIdQuery()))
        q += 'p=' + songQuery;

      pushHistoryState(historyName, q);
    }

    return {
      write: write,
      getSongIdQuery: getSongIdQuery,
      getSearchQuery: getSearchQuery,
      getSortQuery: getSortQuery
    };

  }());

}(window, document, window.o2, window.history));
