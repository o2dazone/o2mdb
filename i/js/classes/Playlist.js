(function(o2, d){
  'use strict';

  var Playlist = function() {
    var self = this,
        $ = o2.$;

    if (!(self instanceof Playlist))
      return new Playlist();

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
      if ($('playlistScroll').innerHTML !== '')
        return;

      if (!isShowing()) $('playlist').style.opacity = '1';
      setTimeout(function(){
        self.trackPlaying = $('playlistScroll').getElementsByTagName('A')[0];
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