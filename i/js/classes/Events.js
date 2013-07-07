(function(o2, d, w){
  'use strict';

  var drop = o2.Dropdown.getInstance('dropdown'),
      pagination = o2.Pagination.getInstance(),
      results = o2.Results.getInstance(),
      songC = o2.Song.getInstance(),
      historyC = o2.History.getInstance(),
      playlist = o2.Playlist.getInstance(),
      search = o2.Search.getInstance();

  (function() {
    var $ = o2.$;

    // search box submit delegators
    $('searchField').addEventListener('submit', function(e){
      e.preventDefault();
      search.query();
    }, 0);

    // window resize stuff
    var resizeTime, animTime,
        body = d.body;

    if (!w.isMobile) {
      w.onresize = function() {
        clearTimeout(resizeTime);
        clearTimeout(animTime);
        resizeTime = setTimeout(function(){
          body.className = body.className.match(/anim/,'');
          animTime = setTimeout(function(){
            body.removeAttribute('class');
            songC.readjustWidth();
          },600);
        },50);

        body.className = 'resize anim';

        if (!playlist.isShowing()) return;
        if (w.innerWidth < 700 || w.innerHeight < 300) {
          if (body.id === 'minimize') return;
          body.id = 'minimize';
        } else {
          if (body.id === '') return;
          body.removeAttribute('id');
        }
      };
    }


    //various click delegators
    var eventDelegator = {
      controls: togglePlayPause,
      facets: facets,
      facetDrop: facetDrop,
      addAllResults: addAllResults,
      prevPage: pagination.previousPage,
      nextPage: pagination.nextPage,
      clearPlaylist: clearPlaylist,
      shufflePlaylist: shufflePlaylist,
      deleteTrack: deleteTrack,
      duration: songC.durationTracking,
      latest: latest,
      random: random,
      popular: popular,
      s: song
    };

    var evt, target, ref, dataEl;
    d.body.addEventListener('click',function(e){
      evt    = e,                                      //set global event
      target = e.target,                               //set global target
      dataEl = target.getAttribute('data-el') || null; //set global dataEl

      drop.hide(); //if dropdown is open, close it.

      if ((ref = eventDelegator[dataEl])) {
        e.preventDefault();
        ref(e, target, dataEl);
      }
    });

    function togglePlayPause() {
      target.className = target.className === 'play' ? 'pause' : 'play';
      soundManager.togglePause('smObj');
    }

    function facetDrop() {
      if (!dropdown.dataset.shown) {
        drop.show();
      } else {
        drop.hide();
      }
    }

    var selectFilter;
    function facets() {
      dropSelect.innerHTML = target.innerHTML;
      dropSelect.dataset.select = target.dataset.select;
      drop.hide();

      if ((selectFilter = target.dataset.select)) {
        dropSelect.dataset.select = selectFilter;
      } else {
        dropSelect.removeAttribute('data-select');
      }
    }

    function addAllResults() {
      $('playlistScroll').innerHTML += results.getAllResults();
      playlist.show();
    }

    function clearPlaylist() {
      $('playlistScroll').innerHTML = '';
    }

    function shufflePlaylist() {
      if (target.id) {
        target.removeAttribute('id');
      } else {
        target.id = 'on';
      }
    }

    function deleteTrack() {
      $('playlistScroll').removeChild(target.parentNode);
    }

    var date = new Date(),
        thirtyDays = 2592000000;
    function latest() {
      $('search').value = 'creationDate:[' + (date-thirtyDays)*1000 + '%20TO%20' + date*1000 + ']';
      search.query();
    }

    function random() {
      $('search').value = 'playCount:>3%20AND%20lastPlayed:[' + (date-thirtyDays*4)*1000 + '%20TO%20' + date*1000 + ']';
      search.query();
    }

    function popular() {
      $('search').value = 'playCount:>2%20AND%20lastPlayed:[' + (date-thirtyDays*12)*1000 + '%20TO%20' + date*1000 + ']';
      search.query();
    }

    function resultClick() {
      $('playlistScroll').innerHTML += target.outerHTML;
      playlist.show();
    }

    function playlistClick() {
      songC.isPlaying(target);
      songC.playSong();
    }

    var songParent;
    function song() {
      songParent = target.parentNode;
      if (songParent.id === 'resultList') {
        resultClick.call(target);
      } else if (songParent.id === 'playlistScroll') {
        playlistClick.call(target);
      }
    }
  }());

}(window.o2, document, window));