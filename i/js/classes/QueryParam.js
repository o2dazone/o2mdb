(function(o2, d){
  'use strict';

  (function() {
    var $ = o2.$;

    //written by DextOr from stackoverflow.com [ http://stackoverflow.com/a/901144 ]
    function getQueryString(a){a=a.replace(/[\[]/,"\\[").replace(/[\]]/,"\\]");a=(new RegExp("[\\?&]"+a+"=([^&#]*)")).exec(location.search);return a===null?"":decodeURIComponent(a[1].replace(/\+/g," "));}

    var paramMatch, i, paramKey, len,
        regex = /[\?&]([^=]+)=/g,
        paramList = [],
        loc = window.location.href;
    var paramDelegator = {
        s: searchQuery,
        p: play,
        shuffle: shuffle
    };

    while ((paramMatch = regex.exec(loc)) !== null)
      paramList.push(paramMatch[1]);

    for (i = paramList.length, len = 0; i > len; i--) {
      paramKey = paramList[i-1];
      if (paramDelegator[paramKey]) {
        paramDelegator[paramKey]();
      }
    }

    function searchQuery() {
      $('search').value = unescape(getQueryString('s'));
      if (unescape(getQueryString('p'))) return;
      o2.Search.getInstance().query();
    }

    var track;
    function play() {
      track = unescape(getQueryString('p'));
`      o2.Results.getInstance().publishToPlaylist('id:' + track, function() { //this is the same as searchQuery, clean this part up
        o2.Search.getInstance().query();
        o2.Playlist.getInstance().show();
      });
    }

    function shuffle() {
      d.querySelector('#playlist .shuffle').id = "on";
    }

  }());
}(window.o2, document));