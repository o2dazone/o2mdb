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
          },500);
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
      prevPage: prevPage,
      nextPage: nextPage,
      clearPlaylist: clearPlaylist,
      shufflePlaylist: shufflePlaylist,
      deleteTrack: deleteTrack,
      duration: duration,
      latest: loadQuery,
      random: loadQuery,
      popular: loadQuery,
      s: song
    };

    var target, ref, dataEl;

    d.body.addEventListener('click',function(e){
      target = e.target;

      drop.hide(); //if dropdown is open, close it.

      dataEl = target.getAttribute('data-el') || null;

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


    function duration() {
      o2.smSong.setPosition((e.offsetX/this.clientWidth*o2.smSong.duration));
      songC.scrubTime(o2.smSong);
    }


    function addAllResults() {
      playlist.show();
      $('playlistScroll').innerHTML += o2.songResults;
    }

    function prevPage() {
      pagination.previousPage();
    }

    function nextPage() {
      pagination.nextPage();
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


    var date = new Date();

    function loadQuery() {
      console.log(dataEl());

      results.publishToResults();
      historyC.writeHistory(o2.musicAjaxCall, w.location.pathname + '?s=' + omniDelegate[targetDelegate[target.tagName].getAttribute('data-el')]);
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


    function resultClick() {
      $('playlistScroll').innerHTML += target.outerHTML;
      playlist.show();
    }

    var current;
    function playlistClick() {
      o2.isPlaying(target);
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