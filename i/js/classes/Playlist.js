(function(o2, d){
  'use strict';

  var songC = o2.Song.getInstance();

  var PlaylistFactory = function() {
    var $ = o2.$,
        target;

    //playlist hover delegator
    $('playlistScroll').addEventListener('mouseover', function(e){
      target = e.target;
      if (target.tagName !== 'A' || target.querySelector('span'))
          return;
      target.innerHTML += '<span style="display:none;" data-el="deleteTrack">Remove</span>';
    });

    function isShowing() {
      return !!$('playlist').style.opacity;
    }

    var checkForTrack, firstTrack;
    function show() {
      if (!isShowing()) {
        $('playlist').style.opacity = '1';
        checkForTrack = setInterval(function(){ //messy
          firstTrack = d.querySelector('#playlistScroll a') || null;
          if (firstTrack) {
            songC.isPlaying(firstTrack);
            songC.playSong();
            clearInterval(checkForTrack);
          }
        }, 25);
      }
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