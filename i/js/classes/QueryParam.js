(function(o2, d){
  'use strict';

  var QueryParam = function() {
    var self = this,
        $ = o2.$;

    //written by DextOr from stackoverflow.com [ http://stackoverflow.com/a/901144 ]
    function getQueryString(a){a=a.replace(/[\[]/,"\\[").replace(/[\]]/,"\\]");a=(new RegExp("[\\?&]"+a+"=([^&#]*)")).exec(location.search);return a===null?"":decodeURIComponent(a[1].replace(/\+/g," "));}

    var paramMatch, i, paramKey, len,
        regex = /[\?&]([^=]+)=/g,
        paramList = [],
        loc = window.location.href;

    var paramDelegator = {
        s: search,
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

    function search() {
      $('search').value = unescape(getQueryString('s'));
      self.Search.query();
    }

    function play() {
      var track = unescape(getQueryString('p'));
      self.Playlist.show();
      $('playlistScroll').innerHTML = '<a href="' + track + '">' + track.replace(/(^o\/)|(.mp3)/g,'') + '</a>';
    }

    function shuffle() {
      d.querySelector('#playlist .shuffle').id = "on";
    }

  };

  o2.QueryParam = QueryParam;
}(window.o2, document));