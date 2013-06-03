(function(O2m, d){
  'use strict';

  var Playlist = function() {
    var self = this,
        $ = O2m.$;

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

  O2m.Playlist = Playlist;
}(window.O2m, document));