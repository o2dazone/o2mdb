(function(o2, d, w){
  'use strict';

  var Events = function() {
    var self = this,
        $ = o2.$;

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

        if (!self.Playlist.isShowing()) return;
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

      self.Dropdown.hide(); //if dropdown is open, close it.

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
        self.Dropdown.show();
      } else {
        self.Dropdown.hide();
      }
    }

    var selectFilter;

    function facets() {
      dropSelect.innerHTML = target.innerHTML;
      dropSelect.dataset.select = target.dataset.select;
      self.Dropdown.hide();

      if ((selectFilter = target.dataset.select)) {
        dropSelect.dataset.select = selectFilter;
      } else {
        dropSelect.removeAttribute('data-select');
      }
    }


    function duration() {
      self.smSong.setPosition((e.offsetX/this.clientWidth*self.smSong.duration));
      self.Song.scrubTime(self.smSong);
    }


    function addAllResults() {
      self.Playlist.show();
      $('playlistScroll').innerHTML += self.songResults;
    }

    function prevPage() {
      self.Pagination.previousPage();
    }

    function nextPage() {
      self.Pagination.nextPage();
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

      self.Results.publish();
      self.History.writeHistory(self.musicAjaxCall, w.location.pathname + '?s=' + omniDelegate[targetDelegate[target.tagName].getAttribute('data-el')]);
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


    function song() {
      if (target.parentNode.id === 'resultList') {
        $('playlistScroll').innerHTML += target.outerHTML;
        self.Playlist.show();
      } else {
        //do stuff for playing song
        if (self.trackPlaying) {
          self.trackPlaying.removeAttribute('id');
          self.trackPlaying.removeAttribute('name');
        }

        self.trackPlaying = target;
        target.id = 'playing';
        self.Song.playSong();
      }
    }
  };

  o2.Events = Events;
}(window.o2, document, window));