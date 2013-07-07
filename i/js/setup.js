(function(sm){
  'use strict';

  sm.useHTML5Audio = 1;
  sm.preferFlash = 0;
  sm.debugMode = 0;
  sm.url ='i/';

  sm.onready(function(){
    sm.createSound({
      id: 'smObj',
      autoPlay: 0,
      volume:100,
      onload: function() {
        o2.Song.getInstance().onLoading();
      },
      onfinish: function(){
        o2.Song.getInstance().onFinish();
      }
    });
  });
})(window.soundManager);
