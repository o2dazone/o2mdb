(function(w,d, o2, wh){
  'use strict';


  var fn = o2.fn,
      $ = o2.$;

  fn.query = (function(){

    //written by DextOr from stackoverflow.com [ http://stackoverflow.com/a/901144 ]
    function getQueryString(a){a=a.replace(/[\[]/,"\\[").replace(/[\]]/,"\\]");a=(new RegExp("[\\?&]"+a+"=([^&#]*)")).exec(location.search);return a===null?"":decodeURIComponent(a[1].replace(/\+/g," "));}

    var paramMatch, i, paramKey, len,
        regex = /[\?&]([^=]+)=/g,
        paramList = [],
        loc = window.location.href;

    var paramDelegator = {
        s: search,
        p: play
    };

    while ((paramMatch = regex.exec(loc)) !== null)
      paramList.push(paramMatch[1]);

    for (i = paramList.length, len = 0; i > len; i--) {
      paramKey = paramList[i-1];
      if (paramDelegator[paramKey]) {
        paramDelegator[paramKey]();
      }
    }

    function write(name, param) {
      wh.replaceState('searchResults', name, param);
    }

    function getSearchQuery() {
      return unescape(getQueryString('s')) || '';
    }

    function getSongIdQuery() {
      return unescape(getQueryString('p')) || '';
    }

    function search() {
      $('input').value = getSearchQuery();
      fn.search.displayResults($('input').value);
    }

    function play() {
      fn.song.getById(getSongIdQuery());
    }

    return {
      write: write,
      getSearchQuery: getSearchQuery,
      getSongIdQuery: getSongIdQuery
    };

  }());

}(window, document, window.o2, window.history));
