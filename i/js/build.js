/*
  * Designed to run only in the raddest browsers
  * Also borrowed snippets from various places (noted in comments)
*/

(function(d, w){
  'use strict';

  var soundManager = w.soundManager;

  soundManager.useHTML5Audio = 1;
  soundManager.preferFlash = 0;
  soundManager.debugMode = 0;
  soundManager.url ='i/';

  var dom = o2.dom;
  o2.$ = function(el) {
    if (!dom[el])
      dom[el] = d.getElementById(el);

    return dom[el];
  };

  o2.Events();
  o2.Omni();
  o2.Jsonc = o2.Jsonc();
  o2.Pagination = o2.Pagination();
  o2.Song = o2.Song();
  o2.History = o2.History();
  o2.Results = o2.Results();
  o2.Playlist = o2.Playlist();
  o2.Search = o2.Search();
  o2.Query = o2.QueryParam();

})(document, window);

