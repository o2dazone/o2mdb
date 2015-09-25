var $ = require('../o2mdb.js').$,
    sectionDom;

function showSection(showSec, hideSec) {
  if ((sectionDom = document.querySelector(showSec+'.hide')))
    sectionDom.classList.remove('hide')

  $(hideSec).classList.add('hide');
  selectNav($('.' + showSec));
}

function selectNav(el) {
  document.querySelector('sidebar .selected').classList.remove('selected');
  el.classList.add('selected');
}

function showResults() {
  showSection('results','queue');
}

function showQueue() {
  showSection('queue','results');
}

function showPlaylist() {
  console.log('ayyyy not done yet...');
}

module.exports = {
  showResults: showResults,
  showQueue: showQueue,
  showPlaylist: showPlaylist

};