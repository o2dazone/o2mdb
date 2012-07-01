(function(doc, win){
  'use strict';

  function $(el) {
    if (!o2m[el])
      o2m[el] = doc.getElementById(el);

    return o2m[el];
  }

  function getJSON(url, callback){
    var ajax = new XMLHttpRequest();

    ajax.onreadystatechange = function(){
      if(ajax.readyState === 4 && ajax.status === 200){
        var r = ajax.response;

        if (!r.match(/^(\[|\{)/)) return;
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

  proto = o2m.prototype;

  proto.initialize = function() {
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


    self.musicAjaxCall = win.location.host.match(/(localhost)|(192.168)/g) ? 'songs.php?word=' : 'search.php?o=path&q=';

    doc.getElementsByTagName('body')[0].addEventListener('click',function(e){
      e.preventDefault();
      var target = e.target,
          dataEl = target.getAttribute('data-el');

      if (!dataEl) dataEl = target.parentNode.getAttribute('data-el');

      if (eventDelegator[dataEl]) {
        eventDelegator[dataEl](e, target);
      }
    });

    $('searchForm').addEventListener('submit',function(e){
      e.preventDefault();
      self.toggleControls();
      $('search').blur();

      if ($('contToggle').style.display === 'none')
        $('contToggle').style.display = 'block';

      getJSON(self.musicAjaxCall + $('search').value, function(r){
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
        $('playlist').innerHTML = results;
      });
    });
  };

  proto.togglePlayPause = function() {
    sm.togglePause('smObj');
  };

  proto.toggleControls = function() {
    var self = this;

    if ($('controls').style.display === 'block') {
      $('controls').style.display = 'none';
      $('playlist').style.height = '175px';
    }
    else {
      $('controls').style.display = 'block';
      $('playlist').style.height = '70px';
    }
  };

  proto.scrubTime = function(song) {
    var t = song.position,
        d = song.duration;

    $('duration').style.width = (t/d*100).toFixed(1) + '%';
  };

  proto.jumpTime = function(e, target) {
    var self = this,
        newTarget = target.id === 'duration' ? target.parentNode : target;
    self.track.setPosition(e.offsetX/newTarget.clientWidth*self.track.duration);
    proto.scrubTime(self.track);
  };

  proto.playSong = function(e) {
    var self = this,
        songPlaying,
        target = e.target || e;

    if (target.tagName !== 'A') return;


    if ($('progress').style.display === 'none') {
      $('progress').style.display = 'block';
      $('playPauseToggle').style.display = 'block';
    }

    if (songPlaying = doc.getElementById('play')) {
      songPlaying.removeAttribute('id');
      songPlaying.removeAttribute('name');
    }


    self.play = target;
    $('duration').style.width = '0%';
    self.play.id = 'play';
    var trackUrl = 'o/' + unescape(target.href).replace(/^(.+?(\/o\/))/,'');
    if (self.track) sm.destroySound('smObj');
    self.track = sm.createSound({
      id: 'smObj',
      url: trackUrl,
      autoPlay: 1,
      volume:100,
      whileplaying: function(){
        proto.scrubTime(this);
      },
      onfinish: function(){
        var currentTrack = doc.getElementById('play') || $('playlist').getElementsByTagName('A')[0] || null;

        if (!currentTrack) return; //no songs in the playlist
        currentTrack.removeAttribute('id');
        currentTrack.removeAttribute('name');

        self.play = currentTrack.nextSibling === null ? $('playlist').getElementsByTagName('A')[0] : currentTrack.nextSibling;

        self.play.setAttribute('name','play');
        win.location = '#play';
        self.playSong(self.play);
      }
    });

    getJSON("id3.php?song="+trackUrl, function(r){
      $('song').innerHTML = '<p class="art" style="background:url(\'' + trackUrl.replace(/(\/)[^\/]*$/g,'/cover.gif') + '\')"></p><p class="artist">' + r[0] + '</p><p class="title">' + r[1] + '</p><p class="album">' + r[2] + '</p>';
    });
  };

  o2m();

})(document, window);

