//Designed to run only in the raddest browsers, also corner cutting and unreadable :)
(function(doc, win){
  'use strict';

  var o2m, proto,
      sm = soundManager;

  o2m = function(){
    if (!(this instanceof o2m)) {
      return new o2m;
    }

    //SoundManager setup
    sm.useHTML5Audio = 1;
    sm.preferFlash = 0;
    sm.debugMode = 0;
    sm.url ='i/'

    //tons of initial setup
    var self = this;
    self.body = doc.getElementsByTagName('BODY')[0];
    self.loc = win.location.href;
    self.isMobile = window.isMobile || 0;
    self.historyReplace = typeof(history.replaceState) === "function" ? true : false;
    self.debugMode = win.location.host.match(/localhost/) ? 1 : 0;
    self.searchBox = $('search');
    self.results = $('results');
    self.searchResults = $('resultList');
    self.plScroll = $('playlistScroll');
    self.auto = 0;
    self.playing = self.musicAjaxCall = null;

    //start it all up
    self.start();
  };

  proto = o2m.prototype;

  proto.start = function(){
    var self = this;

    var paramMatch,
        regex = /[\?&]([^=]+)=/g,
        paramList = [],
        paramDelegator = {
      auto: function() {
        if (paramList.indexOf('p') != "1")
          auto = !0; //if "play" param doesn't exist, then set auto to true.
      },
      s: function() {
        self.searchBox.value = unescape(getQueryString('s'));
        self.searchQuery();
      },
      p: function() {
        auto = 0;
        var track = unescape(getQueryString('p'));
        self.revealPlaylist();
        self.plScroll.innerHTML = '<a href="' + track + '">' + track.replace(/(^o\/)|(.mp3)/g,'') + '</a>';
      },
      o: function() {
        self.musicAjaxCall = 'search.php?q=&o=' + getQueryString('o') + '&l=' + getQueryString('l');
        self.fetchMusic();
      },
      shuffle: function() {
        doc.querySelector('#playlist .shuffle').id = "on";
      }
    };

    while ((paramMatch = regex.exec(self.loc)) != null)
      paramList.push(paramMatch[1]);

    for (var i = 0, len = paramList.length; i < len; i++) {
      var paramKey = paramList[i];
      if (paramDelegator[paramKey]) {
        paramDelegator[paramKey]();
      }
    }

    if (self.loc.match(/\?/)) return;

    self.omni = $('omni');
    self.omni.style.display = 'block';

    $('omniSearchForm').addEventListener('submit', function(e){
      e.preventDefault();
      self.searchBox.value = $('omniSearch').value;

      //FIXME: Duplicate code from the searchField submit event
      self.searchQuery(function(){
        self.replaceUrl(self.searchBox.value,'?s='+self.searchBox.value);
      });
    });


    var self = this;
    var resizeTime,
        animTime,
        eventDelegator = {
          playPause: self.togglePlayPause,
          results: self.resultsDelegator,
          playlist: self.playlistDelegator,
          omni: self.omniDelegator
        };

    self.body.addEventListener('click',function(e){
      var target = delegate = e.target || null,
          targetTag = target.tagName,
          jumps = 0;
      if (!(targetTag === 'A' || targetTag === 'SPAN')) return;

      while (!eventDelegator[delegate.getAttribute('data-el')] && jumps <= 4) { //bubble up the dom, but only three levels high.
          if (delegate.tagName === 'BODY') return;
          delegate = delegate.parentNode;
          jumps++;
      }
      if (jumps === 4) return;
      e.preventDefault();
      eventDelegator[delegate.getAttribute('data-el')](e, target);
    });

    $('durationBar').addEventListener('click',function(e){
      self.song.setPosition((e.offsetX/this.clientWidth*self.song.duration));
      self.scrubTime(self.song);
    });


    if (!self.isMobile) {
      window.onresize = function() {
        clearTimeout(resizeTime);
        clearTimeout(animTime);
        resizeTime = setTimeout(function(){
          self.body.className = self.body.className.match(/anim/,'');
          animTime = setTimeout(function(){
            self.body.removeAttribute('class');
          },500);
        },10);

        self.body.className = 'resize anim';

        if (!self.isPlaylistShowing()) return;
        if (window.innerWidth < 700 || window.innerHeight < 300) {
          if (self.body.id === 'minimize') return;
          self.body.id = 'minimize';
        } else {
          if (body.id === '') return;
          self.body.removeAttribute('id');
        }
      };
    }

    $('searchField').addEventListener('submit', function(e){
      e.preventDefault();
      self.searchQuery(function(){
        self.replaceUrl(self.searchBox.value,'?s='+self.searchBox.value);
      });
    }, 0);

    self.plScroll.addEventListener('mouseover', function(e){
      var target = e.target;
      if (target.tagName !== 'A' || target.getElementsByTagName('SPAN').length) return;
      setTimeout(function(){
        target.innerHTML += '<span style="display:none;">Remove</span>';
      },250);
    });

    function resultsDelegator(e, target) {
      if (target.tagName !== 'A') return;
      if (target.className === 'addAll') {
        self.revealPlaylist();
        self.plScroll.innerHTML += self.addResulted;
      } else if (target.className === 'partial') {
        self.musicAjaxCall = 'search.php?o=path&q=' + self.searchBox.value;
        self.fetchMusic();
      } else if (target.parentNode.id === 'resultList') {
        self.revealPlaylist();
        self.plScroll.innerHTML += '<a href="' + target.href + '">' + target.innerHTML + '</a>';
      }
    }

    function playlistDelegator(e, target) {
      if (target.id === this.id) return;
      var targetClass = target.className
      if (targetClass === 'clear') {
        self.plScroll.innerHTML = '';
        return;
      } else if (targetClass === 'shuffle') {
        if (self.isShuffled()) {
          target.removeAttribute('id');
        } else {
          target.id = 'on';
        }
        return;
      } else if (target.tagName === 'A' && target.parentNode.id === 'playlistScroll') {
        var trackPlaying;
        if (trackPlaying = $('playing')) {
          trackPlaying.removeAttribute('id');
          trackPlaying.removeAttribute('name');
        }
        playing = target;
        self.queue();
        return;
      } else if (target.tagName === 'SPAN') {
        self.plScroll.removeChild(target.parentNode);
        return;
      }
    }

    function omniDelegator(e, target) {
      self.musicAjaxCall = null;
      var targetDelegate = {
        A: target,
        SPAN: target.parentNode
      };

      var omniDelegate = {
        'latest': 'search.php?q=&o=left(creationDate,10)%20desc,path&l=100',
        'random': 'search.php?q=&o=rand()&l=100'
      };

      if (targetDelegate[target.tagName])
        self.musicAjaxCall = omniDelegate[targetDelegate[target.tagName].getAttribute('data-el')];

      if (self.musicAjaxCall) {
        self.fetchMusic();
        var ajax = self.musicAjaxCall.replace(/^search.php/,'');
        self.replaceUrl(ajax, ajax);
      }
    }
  };

  proto.togglePlayPause = function(e, target) {
    target.className = target.className === 'play' ? 'pause' : 'play';
    sm.togglePause('smObj');
  };

  proto.isShuffled = function() {
    return $('on');
  };

  proto.isPlaylistShowing = function() {
    return !!$('playlist').style.opacity;
  };

  proto.replaceUrl = function(name, param) {
    if (!self.historyReplace) return;
    history.replaceState('searchResults',name,param);
  };

  proto.scrubTime = function(song) {
    var self = song,
        t = self.position,
        d = self.duration;

    self.progress.style.width = (t/d*100).toFixed(1) + '%';

    var t = t/1000,
        hr =  t / 3600>>0,
        t = t % 3600,
        min = t / 60>>0,
        t = t % 60,
        sec = t>>0;

    self.progressTime.innerHTML = ((hr > 0 ? hr + ":" : "") + (min > 0 ? (hr > 0 && min < 10 ? "0" : "") + min + ":" : "0:") + (sec < 10 ? "0" : "") + sec);
  };

  proto.searchQuery = function(callback) {
    if (self.searchBox.value === '') return;
    if (!self.debugMode)
      self.musicAjaxCall = 'search.php?o=path&q=' + self.searchBox.value + '&ft';
    else
      self.musicAjaxCall = 'songs.php?word=' + self.searchBox.value;
    fetchMusic();
    if (callback) callback();
  };

  proto.revealPlaylist = function() {
    var self = this;
    if (self.plScroll.innerHTML !== '') return;
    if (!self.isPlaylistShowing()) $('playlist').style.opacity = '1';
    setTimeout(function(){
      self.playing = self.plScroll.getElementsByTagName('A')[0];
      self.queue();
    },0);
  };

  proto.queue = function() {
    var self = this;
    if (!self.progress) {
      self.progress = $('progressBar');
      self.progressTime = $('time');
    }
    self.progress.style.width = '0%';
    self.progressTime.innerHTML = '';
    self.playing.id = 'playing';

    var trackUrl = 'o/' + unescape(self.playing.href).replace(/^(.+?(\/o\/))/,'');

    if (self.song) sm.destroySound('smObj');
    self.song = sm.createSound({
      id: 'smObj',
      url: trackUrl,
      autoPlay: 1,
      volume:100,
      whileplaying: function(){
        self.scrubTime(this);
      },
      onfinish: function(){
        var currentTrack = $('playing') || self.plScroll.getElementsByTagName('A')[0] || null;
        if (!currentTrack) return; //no songs in the playlist
        currentTrack.removeAttribute('id');
        currentTrack.removeAttribute('name');

        if (self.isShuffled()) {
          var trackList = self.plScroll.getElementsByTagName('A');
          self.playing = trackList[Math.floor(Math.random() * trackList.length)];
        } else {
          self.playing = currentTrack.nextSibling === null ? self.plScroll.getElementsByTagName('A')[0] : currentTrack.nextSibling;
        }

        playing.setAttribute('name','play');
        win.location = '#play';
        self.queue();
      }
    });

    getJSON("id3.php?song="+trackUrl, function(r){
      doc.title = r[0] + " - " + r[1];
      if (!self.songInfo) self.songInfo = $('songInfo');
      self.songInfo.innerHTML = '<div class="album" style="background:url(\'' + trackUrl.replace(/(\/)[^\/]*$/g,'/cover.gif') + '\')"></div><h2>' + r[0] + '</h2><h3>' + r[1] + '</h3><h4>' + r[2] + '</h4>';
    });

    // if (searchBox.value === '') return;
    var queryStub = '';
    if (queryStub = window.location.href.split('?')[1].split('&p')[0]) {}

    self.replaceUrl(trackUrl, '?' + queryStub + '&p='+trackUrl);
  };

  proto.fetchMusic = function() {
    var self = this;
    if (self.omni) {
      self.omni.style.opacity = 0;
      setTimeout(function(){
        self.omni.parentNode.removeChild(omni);
        omni = null;
      },500);
    }

    if (!self.results.style.opacity) self.results.style.opacity = '1';
    self.searchResults.innerHTML = '<h5>Loading...</h5>';

    getJSON(self.musicAjaxCall, function(r){
      var len = r.length;
      self.results.getElementsByTagName('p')[0].innerHTML = len + ' results for <span> ' + self.searchBox.value + '</span>';

      if (!len || r[0] === '') {
        var noResults = '';
        if (self.musicAjaxCall.match(/\&ft$/)) noResults = '<a href="#" class="partial">No results found. Try a partial search?</a>';
        else noResults = '<span href="#">No results found.</span>';
        self.searchResults.innerHTML = noResults;
        return;
      }

      var resultsItems = '';
      self.addResulted = '';

      if (len >= 2) {
        resultsItems += '<a href="#" class="addAll">Add all these results to your playlist</a>';
      }

      for (var i=0; i<len; i++) {
        var song = r[i];
        self.addResulted += '<a href="' + song + '">' + song.replace(/^o\/|.mp3/g,'') + '</a>';
      }

      resultsItems += self.addResulted;

      if (self.musicAjaxCall.match(/\&ft$/)) {
        resultsItems += '<a href="#" class="partial">Not what you\'re looking for? Try a partial match.</a>';
      }

      self.searchResults.innerHTML = resultsItems;
      if (!auto) return; //if autoplay param is available, then reveal playlist, add all songs and start playing
      auto = 0;
      self.revealPlaylist();
      self.plScroll.innerHTML = self.addResulted;
    });
  };

  function getQueryString(a, b) {
    if (b == null) b = "";
    a = a.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var c = (new RegExp("[\\?&]" + a + "=([^&#]*)")).exec(self.loc);
    return c == null ? b : c[1]
  }

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


  o2m();

})(document, window);

