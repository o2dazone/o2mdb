(function(o2, d){
  'use strict';

  var Events = function() {
    var self = this;

    var eventDelegator = {
      controls: self.togglePlayPause,
      facets: facets,
      facetDrop: facetDrop,
      addAllResults: addAllResults,
      prevPage: prevPage,
      nextPage: nextPage,
      clearPlaylist: clearPlaylist,
      shufflePlaylist: shufflePlaylist,
      deleteTrack: deleteTrack,
      latest: playSong,
      random: playSong,
      popular: playSong
    };

    var target, ref, dataEl;

    d.body.addEventListener('click',function(e){
      target = e.target;

      self.drop.hide(); //if dropdown is open, close it.

      dataEl = target.getAttribute('data-el') || null;

      if ((ref = eventDelegator[dataEl])) {
        e.preventDefault();
        ref(e, target, dataEl);
      }
    });



    function facetDrop() {
      if (!dropdown.dataset.shown) {
        self.drop.show();
      } else {
        self.drop.hide();
      }
    }

    var selectFilter;

    function facets() {
      dropSelect.innerHTML = target.innerHTML;
      dropSelect.dataset.select = target.dataset.select;
      self.drop.hide();

      if ((selectFilter = target.dataset.select)) {
        dropSelect.dataset.select = selectFilter;
      } else {
        dropSelect.removeAttribute('data-select');
      }
    }



    function addAllResults() {
      self.revealPlaylist();
      $('playlistScroll').innerHTML += songResults;
    }

    function prevPage() {
      self.pagination.previousPage();
    }

    function nextPage() {
      self.pagination.nextPage();
    }



    function clearPlaylist() {
      $('playlistScroll').innerHTML = '';
    }

    function shufflePlaylist() {
      if (self.isShuffled()) {
        target.removeAttribute('id');
      } else {
        target.id = 'on';
      }
    }

    function deleteTrack() {
      $('playlistScroll').removeChild(target.parentNode);
    }


    var date = new Date();

    function playSong(type) {

    }

    function latest() {
      return 'creationDate:[' + (date-2592000000)*1000 + '%20TO%20' + date*1000 + ']';
    }

    function random() {
      return 'playCount:>3%20AND%20lastPlayed:[' + (date-2592000000*4)*1000 + '%20TO%20' + date*1000 + ']';
    }

    function popular() {
      return 'playCount:>2%20AND%20lastPlayed:[' + (date-2592000000*12)*1000 + '%20TO%20' + date*1000 + ']';
    }
  };

  o2.Events = Events;
}(window.o2, document));