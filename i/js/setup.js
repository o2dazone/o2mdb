var search = require('./classes/Search.js'),
    song = require('./classes/Song.js'),
    navigation = require('./classes/Navigation.js'),
    paging = require('./classes/Pagination.js'),
    cookie = require('./classes/Cookie.js'),
    queue = require('./classes/Queue.js'),
    controls = require('./classes/Controls.js'),
    $ = require('./o2mdb.js').$,
    sm = window.soundManager;

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
      song.onLoading();
    },
    onfinish: function(){
      controls.finish();
    }
  });
});

delegant.bind('body', ['click','scroll']);

/* navigation */
delegant.register('nav.showResults', navigation.showResults);
delegant.register('nav.showQueue', navigation.showQueue);

/* song controls */
delegant.register('controls.previous', controls.previous);
delegant.register('controls.playpause', controls.playpause);
delegant.register('controls.next', controls.next);
delegant.register('controls.shuffle', controls.shuffle);
delegant.register('controls.skip', controls.skip);

/* song results */
delegant.register('search.addSongToQueue', search.addSongToQueue);
delegant.register('paging.scrollEvt', paging.scrollEvt);
delegant.register('search.addAll', search.addAll);
delegant.register('search.latest', search.latest);
delegant.register('search.sort', search.sort);

/* song play */
delegant.register('song.prepare', song.prepare);

/* searching, can't use delegant for this yet...make delegant better */
$('input').addEventListener('keydown', function(e){
  search.search(e);
});

/* bind hotkeys */
$('body').addEventListener('keydown',function(e){
  controls.hotkeys(e);
});


/* fires off autoplay from request parameters */
require('./classes/Auto.js').init();