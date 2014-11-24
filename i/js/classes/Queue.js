(function(w,d, o2){
  'use strict';

  var $ = o2.$,
      _ = o2._,
      fn = o2.fn;

  fn.queue = (function(){

    var count = null;

    function counter(num) {
      if (!count)
        count = d.querySelectorAll('queue songs song').length;
      else {
        if (!num)
          count++;
        else
          count += num;
      }

      $('queue sectionhead').innerHTML = 'You have '+ count + ' songs in your queue.';
    }

    var playing, songTar;
    function prepareSong(el, e) {
      if ((playing = _('[playing]')))
        playing.removeAttribute('playing');

      if (e) { //clicking a song in queue
        songTar = e.target;
        if (songTar.tagName !== 'SONG')
          songTar = songTar.parentNode; // jump up one if its not the element youre looking for
      } else songTar = el; //clicking "prev/next"

      songTar.setAttribute('playing','');
      fn.song.play(fn.json.toObj(songTar.dataset.songdata));
    }

    return {
      counter: counter,
      prepareSong: prepareSong
    };

  }());

}(window, document, window.o2));
