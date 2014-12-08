(function(sm, o2){
  'use strict';

  var $ = o2.$,
      fn = o2.fn;

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
        fn.song.onLoading();
      },
      onfinish: function(){
        fn.song.onFinish();
      }
    });
  });

  delegant.bind('body', ['click','scroll']);

  /* navigation */
  delegant.register('nav.showResults', fn.navigation.showResults);
  delegant.register('nav.showQueue', fn.navigation.showQueue);
  delegant.register('nav.showPlaylist', fn.navigation.showPlaylist);

  /* song controls */
  delegant.register('controls.previous', fn.controls.previous);
  delegant.register('controls.playpause', fn.controls.playpause);
  delegant.register('controls.next', fn.controls.next);
  delegant.register('controls.shuffle', fn.controls.shuffle);
  delegant.register('controls.skip', fn.controls.skip);

  /* song results */
  delegant.register('search.addSongToQueue', fn.search.addSongToQueue);
  delegant.register('paging.scrollEvt', fn.paging.scrollEvt);
  delegant.register('search.addAll', fn.search.addAll);
  delegant.register('search.latest', fn.search.latest);
  delegant.register('search.random', fn.search.random);
  delegant.register('search.sort', fn.search.sort);

  /* song queue */
  delegant.register('queue.prepareSong', fn.queue.prepareSong);

  /* searching, can't use delegant for this yet...make delegant better */
  $('input').addEventListener('keydown', function(e){
    o2.fn.search.search(e);
  });

  /* bind hotkeys */
  $('body').addEventListener('keydown',function(e){
    fn.controls.hotkeys(e);
  });

})(window.soundManager, window.o2);
