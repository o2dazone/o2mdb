(function(doc, win){
  'use strict';

  function $(el) {
    return doc.getElementById(el);
  }

  function getJSON(url, callback){
    var ajax = new XMLHttpRequest();

    ajax.onreadystatechange = function(){
        if(ajax.readyState === 4 && ajax.status === 200){
          var r = ajax.response;

          if (r.charAt(0) !== '[') return;
          callback(JSON.parse(r));
      }
    }

    ajax.open('GET', url, !0);
    ajax.send();
  }

  var o2m, proto,
      sm = soundManager;

  o2m = function(){
    var self = this;
    if (!(self instanceof o2m)) {
      return new o2m;
    }

    self.initialize();
  };

  o2m.prototype = {
    initialize: function() {
      var self = this;
      sm.useHTML5Audio = 1;
      sm.preferFlash = 0;
      sm.debugMode = 0;

      var eventDelegator = {
            playPause: self.togglePlayPause,
            controlToggle: self.toggleControls,
            playlist: self.playSong,
            progressBar: self.jumpTime
          };

      self.searchBox = $('search');
      self.musicAjaxCall = win.location.host.match(/(localhost)|(192.168)/g) ? 'songs.php?word=' : 'search.php?o=path&q=';

      doc.getElementsByTagName('body')[0].addEventListener('click',function(e){
        e.preventDefault();
        var target = e.target,
            dataEl = target.getAttribute('data-el');

        if (!dataEl) dataEl = target.parentNode.getAttribute('data-el');

        if (eventDelegator[dataEl]) {
          eventDelegator[dataEl](e,self, target);
        }
      });

      $('searchForm').addEventListener('submit',function(e){
        e.preventDefault();
        self.toggleControls();
        self.searchBox.blur();
        getJSON(self.musicAjaxCall + self.searchBox.value, function(r){
          var len = r.length,
              results = '';

          if (!len || r[0] === '') {
            results = '<span>No results found.</span>';
          } else {
            for (var i=0; i<len; i++) {
              var song = r[i];
              var trimSong = song.substr(2,song.length-6).split('/');
              results += '<a href="' + song + '">' + trimSong[trimSong.length-1] + '</a>';
            }
          }
          self.playlistContainer.innerHTML = results;
        });
      });
    },

    togglePlayPause: function() {
      sm.togglePause('smObj');
    },

    toggleControls: function() {
      var self = this;
      if (!self.controls) self.controls = $('controls');
      if (!self.playlistContainer) self.playlistContainer = $('playlist');

      if (self.controls.style.display === 'block') {
        self.controls.style.display = 'none';
        self.playlistContainer.style.height = '175px';
      }
      else {
        self.controls.style.display = 'block';
        self.playlistContainer.style.height = '70px';
      }
    },

    scrubTimeline: function(song) {
      var self = this,
          t = song.position,
          d = song.duration;

      self.duration.style.width = (t/d*100).toFixed(1) + '%';
    },

    jumpTime: function(e, self, target) {
      var target = target.id === 'duration' ? target.parentNode : target;
      self.track.setPosition(e.offsetX/target.clientWidth*self.track.duration);
      self.scrubTimeline(self.track);
    },

    playSong: function(e, self) {
      var songPlaying,
          target = e.target;
      if (songPlaying = $('play')) {
        songPlaying.removeAttribute('id');
        songPlaying.removeAttribute('name');
      }

      if (!self.progress) {
        self.progress = $('progress');
        self.duration = $('duration');
      }

      self.duration.style.width = '0%';

      if (self.play) self.play.id = 'play';

      var trackUrl = 'o/' + unescape(target.href).replace(/^(.+?(\/o\/))/,'');

      if (self.track) sm.destroySound('smObj');
      self.track = sm.createSound({
        id: 'smObj',
        url: trackUrl,
        autoPlay: 1,
        volume:100,
        whileplaying: function(){
          self.scrubTimeline(this);
        },
        onfinish: function(){
          var currentTrack = $('play') || self.playlistContainer.getElementsByTagName('A')[0] || null;
          if (!currentTrack) return; //no songs in the playlist
          currentTrack.removeAttribute('id');
          currentTrack.removeAttribute('name');

          self.play = currentTrack.nextSibling === null ? self.plScroll.getElementsByTagName('A')[0] : currentTrack.nextSibling;

          self.play.setAttribute('name','play');
          win.location = '#play';
          self.playSong(e, self);
        }
      });

      getJSON("id3.php?song="+trackUrl, function(r){
        if (!self.songInfo) self.songInfo = $('song');
        self.songInfo.innerHTML = '<p class="art" style="background:url(\'' + trackUrl.replace(/(\/)[^\/]*$/g,'/cover.gif') + '\')"></p><p class="artist">' + r[0] + '</p><p class="title">' + r[1] + '</p><p class="album">' + r[2] + '</p>';
      });
    }
  };

  o2m();

})(document, window);

