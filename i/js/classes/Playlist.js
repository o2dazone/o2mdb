(function(o2, d){
  'use strict';

  var songC = o2.Song.getInstance();

  var PlaylistFactory = function() {
    var $ = o2.$,
        target;

    //playlist hover delegator
    $('playlistScroll').addEventListener('mouseover', function(e){
      target = e.target;
      if (target.tagName !== 'A' || target.getElementsByTagName('SPAN').length)
          return;
      target.innerHTML += '<span style="display:none;" data-el="deleteTrack">Remove</span>';
    });

    function isShowing() {
      return !!$('playlist').style.opacity;
    }

    function show() {
      if (!isShowing()) $('playlist').style.opacity = '1';
      setTimeout(function(){
        o2.trackPlaying = $('playlistScroll').getElementsByTagName('A')[0];
        o2.trackPlaying.id = 'playing';
        songC.playSong();
      },0);
    }

    return {
      show: show,
      isShowing: isShowing
    };
  };

  var instances = {};

  function getInstance(name) {
    if (!instances[name]) {
      instances[name] = new PlaylistFactory(name);
    }

    return instances[name];
  }

  o2.Playlist = {
    getInstance: getInstance
  };
}(window.o2, document));