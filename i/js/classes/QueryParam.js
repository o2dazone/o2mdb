(function(o2, d){
  'use strict';

  var search = o2.Search.getInstance(),
      playlist = o2.Playlist.getInstance();

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

    for (i = 0, len = paramList.length; i < len; i++) {
      paramKey = paramList[i];
      if (paramDelegator[paramKey]) {
        paramDelegator[paramKey]();
      }
    }

    function searchQuery() {
      $('search').value = unescape(getQueryString('s'));
      search.query();
    }

    var track;

    function play() {
      track = unescape(getQueryString('p'));
      playlist.show();
      $('playlistScroll').innerHTML = '<a href="' + track + '">' + track.replace(/(^o\/)|(.mp3)/g,'') + '</a>';
    }

    function shuffle() {
      d.querySelector('#playlist .shuffle').id = "on";
    }

  }());
}(window.o2, document));