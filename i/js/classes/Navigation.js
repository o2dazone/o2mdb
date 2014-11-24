(function(w,d, o2){
  'use strict';

  o2.fn.navigation = (function(){

    var $ = o2.$;

    var sectionDom;
    function showSection(showSec, hideSec) {
      if ((sectionDom = d.querySelector(showSec+'[hide]')))
        sectionDom.removeAttribute('hide')

      $(hideSec).setAttribute('hide','');

      selectNav(showSec);
    }

    function selectNav(el) {
      d.querySelector('sidebar [selected]').removeAttribute('selected');
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

    return {
      showResults: showResults,
      showQueue: showQueue,
      showPlaylist: showPlaylist
    };

  }());

}(window, document, window.o2));