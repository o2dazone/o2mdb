var o2 = require('../o2mdb.js'),
    queue = require('./Queue.js'),
    songModule = require('./Song.js'),
    $ = o2.$,
    _ = o2._,
    song, trackList;

function currentPane() {
  if(_('[playing]')) return _('[playing]').parentNode
  else return $('results songs');
}

function isShuffled() {
  return !!_('shuffle[on]');
}

function prevNext(song) {
  song = isShuffled() ? pickShuffled() : song;
  songModule.prepare(song);
  song.scrollIntoView(true);
}

module.exports = {

  hotkeys: function(e) {
    switch (e.keyCode) {
    case 32:
      playpause($('playpause'),e);
      break;
    default:
      break;
    }
  },

  // clean this up...
  playpause: function(el,e) {
    if (e.target.tagName === 'INPUT') return; // dont do anything if input is focused

    if(e.type === 'keydown') e.preventDefault(); // if its a keydown (and not a click), keep page from scrolling by hitting spacebar

    _('playpause[pause]') ? play() : pause();
  },

  prevNext: prevNext,


  play: function() {
    $('playpause').removeAttribute('pause');
    soundManager.play('smObj');
  },

  pause: function() {
    $('playpause').setAttribute('pause','');
    soundManager.pause('smObj');
  },

  previous: function() {
    song = currentPane().querySelector('song[playing]').previousSibling === null ? currentPane().querySelector('song') : currentPane().querySelector('song[playing]').previousSibling;
    prevNext(song);
  },

  next: function() {
    song = (!_('[playing]') || _('[playing]').nextSibling === null) ? currentPane().querySelector('song') : _('[playing]').nextSibling;
    prevNext(song);
  },

  finish: function() {
    this.next();
  },

  pickShuffled: function() {
    trackList = currentPane().querySelectorAll('song');
    return trackList[Math.floor(Math.random() * trackList.length)];
  },


  shuffle: function(el) {
    if (_('shuffle[on]')) el.removeAttribute('on');
    else el.setAttribute('on','');
  },

  skip: function(el, e) {
    songModule.durationTracking(el, e);
  }


}