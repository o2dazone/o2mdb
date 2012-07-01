//Designed to run only in the raddest browsers, also corner cutting and unreadable :)
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
      sm = soundManager,
      body = doc.getElementsByTagName('BODY')[0],
      loc = win.location.href;

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
    self.isMobile = win.isMobile || 0;
    self.historyReplace = typeof(history.replaceState) === "function" ? !0 : 0;
    self.debugMode = win.location.host.match(/(localhost)|(192.168)/g) ? 1 : 0;
    self.auto = 0;
    self.trackPlaying = self.musicAjaxCall = null;

    //start it all up
    self.start();
  };

  proto = o2m.prototype;

  proto.start = function(){
    var self = this;

    function getQueryString(a, b) {
      if (b == null) b = "";
      a = a.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
      var c = (new RegExp("[\\?&]" + a + "=([^&#]*)")).exec(loc);
      return c == null ? b : c[1]
    }

    function resultsDelegator(e, target) {
      var dataEl = target.getAttribute('data-el'),
          delegateFunc,
          delegateObj = {
            'addAllResults': function() {
              self.revealPlaylist();
              $('playlistScroll').innerHTML += self.addResulted;
            },
            'partialSearch': function() {
              self.musicAjaxCall = 'search.php?o=path&q=' + $('search').value;
              self.fetchMusic();
            }
          }

      if (delegateFunc = delegateObj[dataEl]) {
        delegateFunc();
        return;
      }

      self.revealPlaylist();
      $('playlistScroll').innerHTML += '<a href="' + target.href + '">' + target.innerHTML + '</a>';
    }

    function playlistDelegator(e, target) {
      var dataEl = target.getAttribute('data-el'),
          delegateFunc,
          delegateObj = {
            'clearPlaylist': function() {
              $('playlistScroll').innerHTML = '';
            },
            'shufflePlaylist': function() {
              if (self.isShuffled()) {
                target.removeAttribute('id');
              } else {
                target.id = 'on';
              }
            },
            'deleteTrack': function() {
              $('playlistScroll').removeChild(target.parentNode);
            }
          };

      if (delegateFunc = delegateObj[dataEl]) {
        delegateFunc();
        return;
      }

      var trackPlaying;
      if (trackPlaying = document.getElementById('playing')) {
        trackPlaying.removeAttribute('id');
        trackPlaying.removeAttribute('name');
      }
      self.trackPlaying = target;
      self.queue();
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

    var paramMatch,
        regex = /[\?&]([^=]+)=/g,
        paramList = [],
        paramDelegator = {
          auto: function() {
            if (paramList.indexOf('p') != "1")
              self.auto = !0; //if "play" param doesn't exist, then set auto to true.
          },
          s: function() {
            $('search').value = unescape(getQueryString('s'));
            self.searchQuery();
          },
          p: function() {
            self.auto = 0;
            var track = unescape(getQueryString('p'));
            self.revealPlaylist();
            $('playlistScroll').innerHTML = '<a href="' + track + '">' + track.replace(/(^o\/)|(.mp3)/g,'') + '</a>';
          },
          o: function() {
            self.musicAjaxCall = 'search.php?q=&o=' + getQueryString('o') + '&l=' + getQueryString('l');
            self.fetchMusic();
          },
          shuffle: function() {
            doc.querySelector('#playlist .shuffle').id = "on";
          }
    };

    while ((paramMatch = regex.exec(loc)) != null)
      paramList.push(paramMatch[1]);


    for (var i = 0, len = paramList.length; i < len; i++) {
      var paramKey = paramList[i];
      if (paramDelegator[paramKey]) {
        paramDelegator[paramKey]();
      }
    }

    if (!loc.match(/\?/)) {
      $('omni').style.display = 'block';

      $('omniSearchForm').addEventListener('submit', function(e){
        e.preventDefault();
        $('search').value = $('omniSearch').value;

        //FIXME: Duplicate code from the searchField submit event
        self.searchQuery(function(){
          self.replaceUrl($('search').value,'?s='+$('search').value);
        });
      });
    }

    var resizeTime, animTime,
        eventDelegator = {
          playPause: self.togglePlayPause,
          results: resultsDelegator,
          playlist: playlistDelegator,
          omni: omniDelegator
        };

    body.addEventListener('click',function(e){
      var target = e.target || null,
          delegate = target,
          targetTag = target.tagName,
          jumps = 0;

      if (!(targetTag === 'A' || targetTag === 'SPAN')) return;

      while (!eventDelegator[delegate.getAttribute('data-el')] && jumps <= 4) { //bubble up the dom, but only three levels high.
          if (delegate.tagName === 'BODY') return;
          delegate = delegate.parentNode;
          jumps++;
      }

      eventDelegator[delegate.getAttribute('data-el')];

      if (jumps === 4) return;
      e.preventDefault();
      eventDelegator[delegate.getAttribute('data-el')](e, target);
    });

    $('durationBar').addEventListener('click',function(e){
      self.song.setPosition((e.offsetX/this.clientWidth*self.song.duration));
      self.scrubTime(self.song);
    });


    if (!self.isMobile) {
      win.onresize = function() {
        clearTimeout(resizeTime);
        clearTimeout(animTime);
        resizeTime = setTimeout(function(){
          body.className = body.className.match(/anim/,'');
          animTime = setTimeout(function(){
            body.removeAttribute('class');
          },500);
        },50);

        body.className = 'resize anim';

        if (!self.isPlaylistShowing()) return;
        if (win.innerWidth < 700 || win.innerHeight < 300) {
          if (body.id === 'minimize') return;
          body.id = 'minimize';
        } else {
          if (body.id === '') return;
          body.removeAttribute('id');
        }
      };
    }

    $('searchField').addEventListener('submit', function(e){
      e.preventDefault();
      self.searchQuery(function(){
        self.replaceUrl($('search').value,'?s='+$('search').value);
      });
    }, 0);

    $('playlistScroll').addEventListener('mouseover', function(e){
      var target = e.target;
      if (target.tagName !== 'A' || target.getElementsByTagName('SPAN').length) return;
      setTimeout(function(){
        target.innerHTML += '<span style="display:none;" data-el="deleteTrack">Remove</span>';
      },250);
    });
  };

  proto.togglePlayPause = function(e, target) {
    target.className = target.className === 'play' ? 'pause' : 'play';
    sm.togglePause('smObj');
  };

  proto.isShuffled = function() {
    return document.getElementById('on');
  };

  proto.isPlaylistShowing = function() {
    return !!$('playlist').style.opacity;
  };

  proto.replaceUrl = function(name, param) {
    if (!this.historyReplace) return;
    history.replaceState('searchResults',name,param);
  };

  proto.scrubTime = function(song) {
    var self = this,
        t = song.position,
        d = song.duration;

    $('progressBar').style.width = (t/d*100).toFixed(1) + '%';

    var t = t/1000,
        hr =  t / 3600>>0,
        t = t % 3600,
        min = t / 60>>0,
        t = t % 60,
        sec = t>>0;

    $('time').innerHTML = ((hr > 0 ? hr + ":" : "") + (min > 0 ? (hr > 0 && min < 10 ? "0" : "") + min + ":" : "0:") + (sec < 10 ? "0" : "") + sec);
  };

  proto.searchQuery = function(callback) {
    var self = this;
    if ($('search').value === '') return;
    if (!self.debugMode)
      self.musicAjaxCall = 'search.php?o=path&q=' + $('search').value + '&ft';
    else
      self.musicAjaxCall = 'songs.php?word=' + $('search').value;
    self.fetchMusic();
    if (callback) callback();
  };

  proto.revealPlaylist = function() {
    var self = this;
    if ($('playlistScroll').innerHTML !== '') return;
    if (!self.isPlaylistShowing()) $('playlist').style.opacity = '1';
    setTimeout(function(){
      self.trackPlaying = $('playlistScroll').getElementsByTagName('A')[0];
      self.queue();
    },0);
  };

  proto.queue = function() {
    var self = this;

    $('progressBar').style.width = '0%';
    $('time').innerHTML = '';
    self.trackPlaying.id = 'playing';

    var trackUrl = 'o/' + unescape(self.trackPlaying.href).replace(/^(.+?(\/o\/))/,'');

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
        var currentTrack = document.getElementById('playing') || $('playlistScroll').getElementsByTagName('A')[0] || null;
        if (!currentTrack) return; //no songs in the playlist
        currentTrack.removeAttribute('id');
        currentTrack.removeAttribute('name');

        if (self.isShuffled()) {
          var trackList = $('playlistScroll').getElementsByTagName('A');
          self.trackPlaying = trackList[Math.floor(Math.random() * trackList.length)];
        } else {
          self.trackPlaying = currentTrack.nextSibling === null ? $('playlistScroll').getElementsByTagName('A')[0] : currentTrack.nextSibling;
        }

        self.trackPlaying.setAttribute('name','play');
        win.location = '#play';
        self.queue();
      }
    });

    getJSON("id3.php?song="+trackUrl, function(r){
      doc.title = r[0] + " - " + r[1];
      $('songInfo').innerHTML = '<div class="album" style="background:url(\'' + trackUrl.replace(/(\/)[^\/]*$/g,'/cover.gif') + '\')"></div><h2>' + r[0] + '</h2><h3>' + r[1] + '</h3><h4>' + r[2] + '</h4>';
    });

    self.replaceUrl(trackUrl, '?' + win.location.href.split('?')[1].split('&p')[0] + '&p='+trackUrl);
  };

  proto.fetchMusic = function() {
    var self = this;
    if (document.getElementById('omni')) {
      $('omni').style.opacity = 0;
      setTimeout(function(){
        $('omni').parentNode.removeChild($('omni'));
      },500);
    }

    if (!$('results').style.opacity)
        $('results').style.opacity = '1';
    $('resultList').innerHTML = '<h5>Loading...</h5>';

    getJSON(self.musicAjaxCall, function(r){
      var len = r.length;
      $('results').getElementsByTagName('p')[0].innerHTML = len + ' results for <span> ' + $('search').value + '</span>';

      if (!len || r[0] === '') {
        var noResults = '';
        if (self.musicAjaxCall.match(/\&ft$/)) noResults = '<a href="#" class="partial" data-el="partialSearch">No results found. Try a partial search?</a>';
        else noResults = '<span>No results found.</span>';
        $('resultList').innerHTML = noResults;
        return;
      }

      var resultsItems = '';
      self.addResulted = '';

      if (len >= 2) {
        resultsItems += '<a href="#" class="addAll" data-el="addAllResults">Add all these results to your playlist</a>';
      }

      for (var i=0; i<len; i++) {
        var song = r[i];
        self.addResulted += '<a href="' + song + '">' + song.replace(/^o\/|.mp3/g,'') + '</a>';
      }

      resultsItems += self.addResulted;

      if (self.musicAjaxCall.match(/\&ft$/)) {
        resultsItems += '<a href="#" class="partial" data-el="partialSearch">Not what you\'re looking for? Try a partial match.</a>';
      }

      $('resultList').innerHTML = resultsItems;
      if (!self.auto) return; //if autoplay param is available, then reveal playlist, add all songs and start playing
      self.auto = 0;
      self.revealPlaylist();
      $('playlistScroll').innerHTML = self.addResulted;
    });
  };

  o2m();

})(document, window);

