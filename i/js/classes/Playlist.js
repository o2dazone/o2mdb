(function(o2, d){
  'use strict';

  var Playlist = function() {
    var self = this,
        $ = o2.$;

    //playlist hover delegator
    var target;


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
        self.trackPlaying = $('playlistScroll').getElementsByTagName('A')[0];
        self.trackPlaying.id = 'playing';
        self.Song.playSong();
      },0);
    }

    return {
      show: show,
      isShowing: isShowing
    };
  };

  o2.Playlist = Playlist;
}(window.o2, document));