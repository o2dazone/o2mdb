/*
  * Designed to run only in the raddest browsers
  * Also borrowed snippets from various places (noted in comments)
*/

(function(d, w){
  'use strict';

  var soundManager = w.soundManager;


  O2m.$ = function(el) {
    if (!O2m.dom[el])
      O2m.dom[el] = d.getElementById(el);

    return O2m.dom[el];
  };


  O2m.getJSON = function (url, callback){
    var ajax = new XMLHttpRequest();

    ajax.onreadystatechange = function(){
      if(ajax.readyState === 4 && ajax.status === 200){
        var r = ajax.response;

        if (!r.match(/^(\[|\{)/)) return;
        callback(JSON.parse(r));
      }
    };

    ajax.open('GET', url, !0);
    ajax.send();
  };

  soundManager.useHTML5Audio = 1;
  soundManager.preferFlash = 0;
  soundManager.debugMode = 0;
  soundManager.url ='i/';

  O2m.Events = O2m.Events();
  O2m.Jsonc = O2m.Jsonc();
  O2m.Dropdown = O2m.Dropdown('dropdown');
  O2m.Pagination = O2m.Pagination();
  O2m.Song = O2m.Song();
  O2m.History = O2m.History();
  O2m.Results = O2m.Results();
  O2m.Playlist = O2m.Playlist();
  O2m.Search = O2m.Search();
  O2m.Query = O2m.QueryParam();
  O2m.Omni = O2m.Omni();

})(document, window);

