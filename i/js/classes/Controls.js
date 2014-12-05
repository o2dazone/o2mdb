(function(w,d, o2){
  'use strict';

  var $ = o2.$,
      _ = o2._,
      fn = o2.fn;

  fn.controls = (function(){

    function hotkeys(e) {
      switch (e.keyCode) {
      case 32:
        playpause($('playpause'),e);
        break;
      default:
        break;
      }
    }

    function currentPane() {
      if(_('[playing]')) return _('[playing]').parentNode
      else return $('results songs');
    }

    function isShuffled() {
      return !!_('shuffle[on]');
    }

    // clean this up...
    function playpause(el,e) {
      if (e.target.tagName === 'INPUT') return; // dont do anything if input is focused

      if(e.type === 'keydown') e.preventDefault(); // if its a keydown (and not a click), keep page from scrolling by hitting spacebar

      _('playpause[pause]') ? play() : pause();
    }

    function play() {
      $('playpause').removeAttribute('pause');
      soundManager.play('smObj');
    }

    function pause() {
      $('playpause').setAttribute('pause','');
      soundManager.pause('smObj');
    }

    var trackList;
    function pickShuffled() {
      trackList = currentPane().querySelectorAll('song');
      return trackList[Math.floor(Math.random() * trackList.length)];
    }

    var song;
    function previous() {
      song = currentPane().querySelector('song[playing]').previousSibling === null ? currentPane().querySelector('song') : currentPane().querySelector('song[playing]').previousSibling;
      prevNext(song);
    }

    function next() {
      song = (!_('[playing]') || _('[playing]').nextSibling === null) ? currentPane().querySelector('song') : _('[playing]').nextSibling;
      prevNext(song);
    }

    function prevNext(song) {
      song = isShuffled() ? pickShuffled() : song;
      fn.queue.prepareSong(song);
      song.scrollIntoView(true);
    }

    function shuffle(el) {
      if (_('shuffle[on]')) el.removeAttribute('on');
      else el.setAttribute('on','');
    }

    function skip(el, e) {
      fn.song.durationTracking(el, e);
    }

    return {
      previous: previous,
      playpause: playpause,
      next: next,
      hotkeys: hotkeys,
      shuffle: shuffle,
      skip: skip
    };

  }());

}(window, document, window.o2));
