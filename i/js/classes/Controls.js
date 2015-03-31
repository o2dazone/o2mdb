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

function skip(el, e) {
  songModule.durationTracking(el, e);
}

function shuffle(el) {
  if (_('shuffle[on]')) el.removeAttribute('on');
  else el.setAttribute('on','');
}

function pickShuffled() {
 trackList = currentPane().querySelectorAll('song');
 return trackList[Math.floor(Math.random() * trackList.length)];
}

function finish() {
  next();
}

function next() {
  song = (!_('[playing]') || _('[playing]').nextSibling === null) ? currentPane().querySelector('song') : _('[playing]').nextSibling;
  prevNext(song);
}

function previous() {
  song = currentPane().querySelector('song[playing]').previousSibling === null ? currentPane().querySelector('song') : currentPane().querySelector('song[playing]').previousSibling;
  prevNext(song);
}

function pause() {
  $('playpause').setAttribute('pause','');
  soundManager.pause('smObj');
}

function play() {
  $('playpause').removeAttribute('pause');
  soundManager.play('smObj');
}

function playpause(el,e) {
  if (e.target.tagName === 'INPUT') return; // dont do anything if input is focused

  if(e.type === 'keydown') e.preventDefault(); // if its a keydown (and not a click), keep page from scrolling by hitting spacebar

  _('playpause[pause]') ? play() : pause();
}

function hotkeys(e) {
  switch (e.keyCode) {
  case 32:
    playpause($('playpause'),e);
    break;
  default:
    break;
  }
}

module.exports = {
  hotkeys: hotkeys,
  playpause: playpause,
  previous: previous,
  next: next,
  finish: finish,
  shuffle: shuffle,
  skip: skip
}