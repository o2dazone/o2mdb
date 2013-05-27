/*
* Designed to run only in the raddest browsers
* Also borrowed snippets from various places (noted in comments)
*/
(function(d, w){
  'use strict';

  function $(el) {
    if (!O2m[el])
      O2m[el] = d.getElementById(el);

    return O2m[el];
  }

  function getJSON(url, callback){
    var ajax = new XMLHttpRequest();

    ajax.onreadystatechange = function(){
      if(ajax.readyState === 4 && ajax.status === 200){
        var r = ajax.response;

        if (!r.match(/^(\[|\{)/)) return;
        callback(JSON.parse(r));
      }
    };

    ajax.open('GET', url, !0);
    ajax.send();
  }

  //written by Phrogz from stackoverflow.com [ http://stackoverflow.com/a/4673990 ]
  Date.prototype.customFormat=function(k){var d,e,a,f,g,b,h,m,n,c,i,j,l,o;e=((d=this.getFullYear())+"").slice(-2);g=(b=this.getMonth()+1)<10?"0"+b:b;f=(a=["January","February","March","April","May","June","July","August","September","October","November","December"][b-1]).substring(0,3);n=(c=this.getDate())<10?"0"+c:c;m=(h=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][this.getDay()]).substring(0,3);o=c>=10&&c<=20?"th":(l=c%10)==1?"st":l==2?"nd":l==3?"rd":"th";k=k.replace("#YYYY#",d).replace("#YY#",e).replace("#MMMM#",a).replace("#MMM#",f).replace("#MM#",g).replace("#M#",b).replace("#DDDD#",h).replace("#DDD#",m).replace("#DD#",n).replace("#D#",c).replace("#th#",o);a=d=this.getHours();if(a===0)a=24;if(a>12)a-=12;e=a<10?"0"+a:a;h=(b=d<12?"am":"pm").toUpperCase();f=(i=this.getMinutes())<10?"0"+i:i;g=(j=this.getSeconds())<10?"0"+j:j;return k.replace("#hhh#",d).replace("#hh#",e).replace("#h#",a).replace("#mm#",f).replace("#m#",i).replace("#ss#",g).replace("#s#",j).replace("#ampm#",b).replace("#AMPM#",h);};

  var O2m,
      sm = soundManager,
      body = d.body,
      loc = w.location.href,
      maxResults = 100,
      resultsItems = '',
      songResults = '',
      trackPlaying = null;

  O2m = function(){
    //SoundManager setup
    sm.useHTML5Audio = 1;
    sm.preferFlash = 0;
    sm.debugMode = 0;
    sm.url ='i/';

    //tons of initial setup
    var self = this;
    self.isMobile = w.isMobile || 0;
    self.auto = 0;
    self.musicAjaxCall = null;

    //start it all up
    self.start();
  };


  O2m.prototype = {
    start: function(){
      var self = this;

      //written by DextOr from stackoverflow.com [ http://stackoverflow.com/a/901144 ]
      function getQueryString(a){a=a.replace(/[\[]/,"\\[").replace(/[\]]/,"\\]");a=(new RegExp("[\\?&]"+a+"=([^&#]*)")).exec(location.search);return a==null?"":decodeURIComponent(a[1].replace(/\+/g," "))};

      function paginationFunc() {
        self.page = 0;

        function pageAround() {
          self.publishResults(self.musicAjaxCall + '/page/' + self.page);
        }
        function previousPage() {
          if (self.page > 0) {
            self.page--;
            pageAround();
          }
        }

        function nextPage() {
          self.page++;
          pageAround();
        }

        return {
          previousPage: previousPage,
          nextPage: nextPage
        };
      }

      function jsonPipe() {
        function outStr(arg) {
          return encodeURI(JSON.stringify(arg));
        }

        function outObj(arg) {
          return JSON.parse(decodeURI(arg));
        }

        return {
          outStr: outStr,
          outObj: outObj
        };
      }

      var pagination = paginationFunc(); //invoke pagination functions
      self.jsonc = jsonPipe(); //invoke json conversion functions

      function resultsDelegator(e, target) {
        var dataEl = target.getAttribute('data-el'),
            delegateFunc,
            delegateObj = {
              'addAllResults': function() {
                self.revealPlaylist();
                $('playlistScroll').innerHTML += songResults;
              },
              'prevPage': function() {
                pagination.previousPage();
              },
              'nextPage': function() {
                pagination.nextPage();
              }
            };

        if ((delegateFunc = delegateObj[dataEl])) {
          delegateFunc(); //fire the delegated functions
          return; //dont attempt to add any result clicks to playlist
        }

        if (target.href) {
          self.revealPlaylist();
          $('playlistScroll').innerHTML += e.target.outerHTML;
        }
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

        if ((delegateFunc = delegateObj[dataEl])) {
          delegateFunc();
          return;
        }

        if ((trackPlaying = document.getElementById('playing'))) {
          trackPlaying.removeAttribute('id');
          trackPlaying.removeAttribute('name');
        }
        trackPlaying = target;
        self.queue();
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
            shuffle: function() {
              d.querySelector('#playlist .shuffle').id = "on";
            }
      };

      while ((paramMatch = regex.exec(loc)) !== null)
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
          self.searchQuery();
        });
      }

      var resizeTime, animTime,
          eventDelegator = {
            playPause: self.togglePlayPause,
            results: resultsDelegator,
            playlist: playlistDelegator
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

        if (jumps === 4) return;
        e.preventDefault();
        eventDelegator[delegate.getAttribute('data-el')](e, target);
      });

      $('durationBar').addEventListener('click',function(e){
        self.song.setPosition((e.offsetX/this.clientWidth*self.song.duration));
        self.scrubTime(self.song);
      });


      if (!self.isMobile) {
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

          if (!self.isPlaylistShowing()) return;
          if (w.innerWidth < 700 || w.innerHeight < 300) {
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
        self.searchQuery();
      }, 0);

      $('playlistScroll').addEventListener('mouseover', function(e){
        var target = e.target;
        if (target.tagName !== 'A' || target.getElementsByTagName('SPAN').length) return;
        setTimeout(function(){
          target.innerHTML += '<span style="display:none;" data-el="deleteTrack">Remove</span>';
        },250);
      });
    },

    convertnsToDate: function(ms) {
      ms = ms+'';
      ms = +ms.substring(0,ms.length-3);

      var date = new Date(ms),
          formattedDate = date.customFormat('#MMM# #D#, #YYYY#') + ' at ' + date.customFormat('#h#:#mm##ampm#');

      return formattedDate;
    },

    togglePlayPause: function(e, target) {
      target.className = target.className === 'play' ? 'pause' : 'play';
      sm.togglePause('smObj');
    },

    isShuffled: function() {
      return document.getElementById('on');
    },

    isPlaylistShowing: function() {
      return !!$('playlist').style.opacity;
    },

    replaceUrl: function(name, param) {
      return;
      if (!this.historyReplace) return;
      history.replaceState('searchResults',name,param);
    },

    scrubTime: function(song) {
      var t = song.position,
          d = song.duration,
          hr, min, sec;

      $('progressBar').style.width = (t/d*100).toFixed(1) + '%';

      t = t/1000;
      hr =  t / 3600>>0;
      t = t % 3600;
      min = t / 60>>0;
      t = t % 60;
      sec = t>>0;

      $('time').innerHTML = ((hr > 0 ? hr + ":" : "") + (min > 0 ? (hr > 0 && min < 10 ? "0" : "") + min + ":" : "0:") + (sec < 10 ? "0" : "") + sec);
    },

    searchQuery: function(callback) {
      var self = this,
          query = $('search').value;

      d.querySelectorAll('#results > p')[0].innerHTML = ''; //clear the resultCount box when a new query is done
      if (query === '') return;
      self.musicAjaxCall = 'http://o2dazone.com/music/search/' + query;
      self.page = 0; //reset whatever page you're on
      self.publishResults();
      self.replaceUrl(query, '?s=' + encodeURIComponent(query));
    },

    revealPlaylist: function() {
      var self = this;
      if ($('playlistScroll').innerHTML !== '') return;
      if (!self.isPlaylistShowing()) $('playlist').style.opacity = '1';
      setTimeout(function(){
        trackPlaying = $('playlistScroll').getElementsByTagName('A')[0];
        self.queue();
      },0);
    },

    queue: function() {
      var self = this;

      $('progressBar').style.width = '0%';
      $('time').innerHTML = '';
      trackPlaying.id = 'playing';

      var trackUrl = 'o/' + unescape(trackPlaying.href).replace(/^(.+?(\/o\/))/,'');

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
            trackPlaying = trackList[Math.floor(Math.random() * trackList.length)];
          } else {
            trackPlaying = currentTrack.nextSibling === null ? $('playlistScroll').getElementsByTagName('A')[0] : currentTrack.nextSibling;
          }

          trackPlaying.setAttribute('name','play');
          w.location = '#play';
          self.queue();
        }
      });

      self.publishTrackInfo(trackPlaying);

      self.replaceUrl(trackUrl, '?' + w.location.href.split('?')[1].split('&p')[0] + '&p='+trackUrl);
    },

    hideOmnibox: function() {
      if (document.getElementById('omni')) {
        $('omni').style.opacity = 0;
        setTimeout(function(){
          $('omni').parentNode.removeChild($('omni'));
        },500);
      }
    },

    showResultsWin: function() {
      if (!$('results').style.opacity)
          $('results').style.opacity = '1';
    },

    publishTrackInfo: function(track) {
      var self = this;
      track = self.jsonc.outObj(track.dataset.songdata);
      var title = track.title,
          artist = track.artist,
          album = track.album,
          albumArt = track.albumArtUrl || 'i/cover.png';

      d.title = track.artist + " - " + track.title;

      $('songInfo').innerHTML = '<div class="album" style="background-image:url(\'' + albumArt + '\')"></div><h2>' + track.title + '</h2><h3>' + track.artist + '</h3><h4>' + track.album + '</h4>';
    },

    getMusicQuery: function(url, callback) {
      var self = this;
      getJSON(url, function(r){
        self.queryResults = r;
        callback(r);
      });
    },

    paging: function(len) {
      var self = this,
          addAll = [],
          showPrev = '',
          showNext = '';

      if (self.page > 0) showPrev = '<a class="prev" data-el="prevPage" href="#">Prev Page</a>';
      if (len >= maxResults) showNext = '<a class="next" data-el="nextPage" href="#">Next Page</a>';

      if (len > 0) {
        addAll.push('<span><a class="addAll" href="#" data-el="addAllResults">Add all these results to your playlist</a>');

        addAll.push(showPrev);
        addAll.push(showNext);

        addAll.push('</span>');
      }

      return addAll.join('');
    },

    buildResults: function() {
      var self = this,
          songs = self.queryResults,
          i, len, song, data;

      for (i = 0, len = songs.length; i<len; i++) {
        song = songs[i];
        data = {
          album:        song.album,
          title:        song.title,
          artist:       song.artist,
          // year:         song.year,
          albumArtUrl:  song.albumArtUrl,
          id:           song.id
          // lastPlayed:   song.lastPlayed,
          // playCount:    song.playCount
        };
        songResults += '<a data-songdata="' + self.jsonc.outStr(data) +'" href="#">' + song.album + '/' + song.artist + ' - ' + song.title + '</a>';
      }
    },

    resultCount: function(num) {
      if (num >= maxResults) num = num + '+';
      $('results').getElementsByTagName('p')[0].innerHTML = num + ' results for <span> ' + $('search').value + '</span>';
    },

    publishResults: function(url) {
      var self = this;
      self.hideOmnibox();
      self.showResultsWin();

      $('resultList').innerHTML = '<h5>Loading...</h5>';

      self.getMusicQuery(url || self.musicAjaxCall, function(r){
        var len = r.length;
        self.resultCount(len);
        if (!len || r[0] === '') {
          $('resultList').innerHTML = '<span>No results found.</span>';
          return;
        }

        songResults = '';
        resultsItems = '';

        self.buildResults();
        resultsItems += self.paging(len);
        resultsItems += songResults;

        //appends all results to result window
        $('resultList').innerHTML = resultsItems;

        if (!self.auto) return; //if autoplay param is available, then reveal playlist, add all songs and start playing
        self.auto = 0;
        self.revealPlaylist();
        $('playlistScroll').innerHTML = songResults;
      });
    }
  };

  w.o2 = new O2m();

})(document, window);

