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

module.exports = {

  showResults: function() {
    showSection('results','queue');
  },

  showQueue: function() {
    showSection('queue','results');
  },

  showPlaylist: function(el) {
    console.log('ayyyy not done yet...');
  }

};