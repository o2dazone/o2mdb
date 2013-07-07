(function(o2, d, w){
  'use strict';

  var jsonc = o2.Jsonc.getInstance(),
      historyC = o2.History.getInstance();

  var SongFactory = function() {
    var $ = o2.$;

    var smSong,
        streamPath = 'http://o2dazone.com/music/song/stream-url/';

    //written by Phrogz from stackoverflow.com [ http://stackoverflow.com/a/4673990 ]
    Date.prototype.customFormat=function(k){var d,e,a,f,g,b,h,m,n,c,i,j,l,o;e=((d=this.getFullYear())+"").slice(-2);g=(b=this.getMonth()+1)<10?"0"+b:b;f=(a=["January","February","March","April","May","June","July","August","September","October","November","December"][b-1]).substring(0,3);n=(c=this.getDate())<10?"0"+c:c;m=(h=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][this.getDay()]).substring(0,3);o=c>=10&&c<=20?"th":(l=c%10)==1?"st":l==2?"nd":l==3?"rd":"th";k=k.replace("#YYYY#",d).replace("#YY#",e).replace("#MMMM#",a).replace("#MMM#",f).replace("#MM#",g).replace("#M#",b).replace("#DDDD#",h).replace("#DDD#",m).replace("#DD#",n).replace("#D#",c).replace("#th#",o);a=d=this.getHours();if(a===0)a=24;if(a>12)a-=12;e=a<10?"0"+a:a;h=(b=d<12?"am":"pm").toUpperCase();f=(i=this.getMinutes())<10?"0"+i:i;g=(j=this.getSeconds())<10?"0"+j:j;return k.replace("#hhh#",d).replace("#hh#",e).replace("#h#",a).replace("#mm#",f).replace("#m#",i).replace("#ss#",g).replace("#s#",j).replace("#ampm#",b).replace("#AMPM#",h);};

    var date, formattedDate;
    function convertnsToDate(ms) {
      date = new Date(ms/1000>>0),
      formattedDate = date.customFormat('#MMM# #D#, #YYYY#') + ' at ' + date.customFormat('#h#:#mm##ampm#');

      return formattedDate;
    }

    var current;
    function isPlaying(el) {
      if (el) {
        if ((current = document.getElementById('playing'))) {
          current.removeAttribute('id');
          current.removeAttribute('name');
        }

        el.id = 'playing';
        el.name = 'play';
      }
      return document.getElementById('playing') || el;
    }

    var title, id, artist, album, albumArt, track, pub=[];
    function publishTrack() {
      pub      = [],
      track    = jsonc.outObj(isPlaying().dataset.songdata),
      id       = track.id,
      title    = track.title,
      artist   = track.artist,
      album    = track.album,
      albumArt = track.albumArtUrl || null;

      document.title = track.artist + " - " + track.title;
      historyC.writeHistory(track.id, '?' + w.location.href.split('?')[1].split('&p')[0] + '&p="' + track.id + '"');

      pub.push(
        '<div class="album" style="background-image:url(\'',
        albumArt || 'i/cover.png', '\')"></div><h2>',
        track.title,  '</h2><h3>',
        track.artist, '</h3><h4>',
        track.album,  '</h4>'
      );

      $('songInfo').innerHTML = pub.join('');

      albumArt = (albumArt) ? albumArt.replace('s130','s1300') : 'i/coverBig.png'; // set albumArt to something bigger
      $('player').style.backgroundImage = "url('" + albumArt + "')";
    }

    function isShuffled() {
      return document.getElementById('on');
    }

    function readjustWidth() {
      durBarWidth = $('durationBar').clientWidth;
    }

    var durBarWidth, microJump;
    function durationTracking(e) {
      microJump = (((e.offsetX/durBarWidth) * songDuration) | 0);

      if (streamUrl) {
        injectSongObj(streamUrl + '&begin=' + microJump);
      } else {
        getStreamUrl(streamPath + track.id, function(r) {
          injectSongObj(r + '&begin=' + microJump);
        });
      }

    }

    var t, hr, min, sec, timeInterval;
    function scrubTime() {
      if (timeInterval) {
        clearInterval(timeInterval);
        timeInterval = null;
      }

      timeInterval = setInterval(function(){
        time();
      },100);

      function time() {
        t = smSong.position + microJump;
        $('progressBar').style.width = (t/songDuration*100).toFixed(2) + '%'; //messy: cache "songDuration*100"

        t = t/1000;
        hr =  t / 3600>>0;
        t = t % 3600;
        min = t / 60>>0;
        t = t % 60;
        sec = t>>0;

        $('time').innerHTML = ((hr > 0 ? hr + ':' : '') + (min > 0 ? (hr > 0 && min < 10 ? '0' : '') + min + ':' : '0:') + (sec < 10 ? '0' : '') + sec);
      }
    }

    var trackList, playNext, songDuration;
    function injectSongObj(stream) {
      soundManager.unload('smObj');

      smSong = soundManager.load('smObj', {
        url: stream
      });

      soundManager.togglePause('smObj');
    }

    function onLoading() {
      scrubTime();
      if (!songDuration)
        songDuration = smSong.duration;
    }

    function onFinish() {
      isPlaying(isPlaying() || d.querySelector('#playlistScroll a'));
      if (isShuffled()) {
        trackList = d.querySelectorAll('#playlistScroll a');
        isPlaying(trackList[Math.floor(Math.random() * trackList.length)]);
      } else {
        playNext = isPlaying().nextSibling === null ? d.querySelector('#playlistScroll a') : isPlaying().nextSibling;
        isPlaying(playNext);
      }

      playSong();
      w.location = '#play';
    }

    var streamUrl;
    function playSong() {
      /* reset all song stuff */
      songDuration = null;
      microJump = 0;
      $('progressBar').style.width = '0%';
      $('time').innerHTML = '';
      $('controls').className = 'pause';

      publishTrack();

      getStreamUrl(streamPath + track.id, function(r){
        injectSongObj(r);
      });
    }

    function getStreamUrl(query, callback) {
      o2.getJSON(query, function(url) {
        streamUrl = url;

        setTimeout(function(){
          streamUrl = null; //expire the stream url so we can fetch a new one.
        },(30000)); //1000 * 30

        callback(url);
      });
    }

    return {
      playSong: playSong,
      readjustWidth: readjustWidth,
      onLoading: onLoading,
      onFinish: onFinish,
      isPlaying: isPlaying,
      durationTracking: durationTracking
    };
  };

  var instances = {};

  function getInstance(name) {
    if (!instances[name]) {
      instances[name] = new SongFactory(name);
    }

    return instances[name];
  }

  o2.Song = {
    getInstance: getInstance
  };
}(window.o2, document, window));