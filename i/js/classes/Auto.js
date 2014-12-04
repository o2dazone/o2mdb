(function(w,d, o2){
  'use strict';

  var fn = o2.fn,
      _ = o2._,
      $ = o2.$;

  fn.auto = (function(){

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

    function search() {
      $('input').value = fn.query.getSearchQuery();
      fn.search.displayResults($('input').value, true);
    }

    function play() {
      fn.song.getById(fn.query.getSongIdQuery());
    }

  }());

}(window, document, window.o2));
