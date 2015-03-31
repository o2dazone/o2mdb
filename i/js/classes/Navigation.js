var $ = require('../o2mdb.js').$,
    sectionDom;

function showSection(showSec, hideSec) {
  if ((sectionDom = document.querySelector(showSec+'[hide]')))
    sectionDom.removeAttribute('hide')

  $(hideSec).setAttribute('hide','');

  selectNav(showSec);
}

function selectNav(el) {
  document.querySelector('sidebar [selected]').removeAttribute('selected');
  $('[' + el + ']').setAttribute('selected','');
}

function showResults() {
  showSection('results','queue');
}

function showQueue() {
  showSection('queue','results');
}

function showPlaylist(el) {
  console.log('ayyyy not done yet...');
}

module.exports = {
  showResults: showResults,
  showQueue: showQueue,
  showPlaylist: showPlaylist

};