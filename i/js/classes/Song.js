(function(o2, d, w){
  'use strict';

  var jsonc = o2.Jsonc.getInstance(),
      historyC = o2.History.getInstance();

  var SongFactory = function() {
    var $ = o2.$;

    //written by Phrogz from stackoverflow.com [ http://stackoverflow.com/a/4673990 ]
    Date.prototype.customFormat=function(k){var d,e,a,f,g,b,h,m,n,c,i,j,l,o;e=((d=this.getFullYear())+"").slice(-2);g=(b=this.getMonth()+1)<10?"0"+b:b;f=(a=["January","February","March","April","May","June","July","August","September","October","November","December"][b-1]).substring(0,3);n=(c=this.getDate())<10?"0"+c:c;m=(h=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][this.getDay()]).substring(0,3);o=c>=10&&c<=20?"th":(l=c%10)==1?"st":l==2?"nd":l==3?"rd":"th";k=k.replace("#YYYY#",d).replace("#YY#",e).replace("#MMMM#",a).replace("#MMM#",f).replace("#MM#",g).replace("#M#",b).replace("#DDDD#",h).replace("#DDD#",m).replace("#DD#",n).replace("#D#",c).replace("#th#",o);a=d=this.getHours();if(a===0)a=24;if(a>12)a-=12;e=a<10?"0"+a:a;h=(b=d<12?"am":"pm").toUpperCase();f=(i=this.getMinutes())<10?"0"+i:i;g=(j=this.getSeconds())<10?"0"+j:j;return k.replace("#hhh#",d).replace("#hh#",e).replace("#h#",a).replace("#mm#",f).replace("#m#",i).replace("#ss#",g).replace("#s#",j).replace("#ampm#",b).replace("#AMPM#",h);};

    var date, formattedDate;

    function convertnsToDate(ms) {
      date = new Date(Math.round(ms/1000)),
      formattedDate = date.customFormat('#MMM# #D#, #YYYY#') + ' at ' + date.customFormat('#h#:#mm##ampm#');

      return formattedDate;
    }


    var title, artist, album, albumArt, track;

    function publishTrack() {
      track = jsonc.outObj(o2.trackPlaying.dataset.songdata),
      title = track.title,
      artist = track.artist,
      album = track.album,
      albumArt = track.albumArtUrl || 'i/cover.png';

      console.log('publish "last played" somewhere around here');
      document.title = track.artist + " - " + track.title;
      historyC.writeHistory(track.id, '?' + w.location.href.split('?')[1].split('&p')[0] + '&p=' + track.id);

      $('songInfo').innerHTML = '<div class="album" style="background-image:url(\'' + albumArt + '\')"></div><h2>' + track.title + '</h2><h3>' + track.artist + '</h3><h4>' + track.album + '</h4>';
    }

    function isShuffled() {
      return document.getElementById('on');
    }

    var t, d, hr, min, sec;

    function scrubTime(song) {
      t = song.position,
      d = song.duration;

      $('progressBar').style.width = (t/d*100).toFixed(1) + '%';

      t = t/1000;
      hr =  t / 3600>>0;
      t = t % 3600;
      min = t / 60>>0;
      t = t % 60;
      sec = t>>0;

      $('time').innerHTML = ((hr > 0 ? hr + ":" : "") + (min > 0 ? (hr > 0 && min < 10 ? "0" : "") + min + ":" : "0:") + (sec < 10 ? "0" : "") + sec);
    }


    var trackUrl, currentTrack, trackList;

    function playSong() {
      $('progressBar').style.width = '0%';
      $('time').innerHTML = '';

      trackUrl = 'o/' + unescape(o2.trackPlaying.href).replace(/^(.+?(\/o\/))/,'');

      if (o2.smSong) soundManager.destroySound('smObj');
      o2.smSong = soundManager.createSound({
        id: 'smObj',
        url: trackUrl,
        autoPlay: 1,
        volume:100,
        whileplaying: function(){
          scrubTime(this);
        },
        onfinish: function(){
          currentTrack = document.getElementById('playing') || $('playlistScroll').getElementsByTagName('A')[0] || null;
          if (!currentTrack) return; //no songs in the playlist
          currentTrack.removeAttribute('id');
          currentTrack.removeAttribute('name');

          if (isShuffled()) {
            trackList = $('playlistScroll').getElementsByTagName('A');
            o2.trackPlaying = trackList[Math.floor(Math.random() * trackList.length)];
          } else {
            o2.trackPlaying = currentTrack.nextSibling === null ? $('playlistScroll').getElementsByTagName('A')[0] : currentTrack.nextSibling;
          }

          trackPlaying.setAttribute('name','play');
          w.location = '#play';
          playSong();
        }
      });

      publishTrack();
      // historyC.writeHistory(id, )
      // historyC.writeHistory(trackUrl, '?' + w.location.href.split('?')[1].split('&p')[0] + '&p='+trackUrl);
    }

    return {
      playSong: playSong,
      scrubTime: scrubTime
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