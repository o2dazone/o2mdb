(function(w,d, o2){
  'use strict';


  var $ = o2.$,
      _ = o2._,
      fn = o2.fn;

  fn.song = (function(){

    var smSong, songDuration
    function onLoading() {
      scrubTime();
      if (!songDuration)
        songDuration = smSong.duration;
    }

    function injectSongObj(stream) {
      smSong = soundManager.load('smObj', {
        url: stream
      });

      soundManager.play('smObj');
    }


    var title, id, artist, album, albumArt, pub=[], searchQuery, songIdQuery;
    function publishTrack(track) {

      pub      = [],
      title    = track.title,
      artist   = track.artist,
      album    = track.album,
      albumArt = track.albumArtUrl || null;

      document.title = track.artist + " - " + track.title;

      if ((searchQuery = fn.query.getSearchQuery()))
        searchQuery = '?s=' + searchQuery;
      songIdQuery = '&p=' + track.id;

      fn.query.write(track.id, searchQuery + songIdQuery);

      pub.push(
        fn.search.albumArt(track.albumArtUrl),
        '<name>', track.title, '</name>',
        '<artistalbum>', track.artist
      );

      if (track.album)
        pub.push(' - ', track.album);
      pub.push('</artistalbum>');


      $('info').innerHTML = pub.join('');
    }

    function play(track) {
      songDuration = null;
      microJump = 0;
      $('elapsed').style.width = '0%';
      $('time').innerHTML = '';
      $('playpause').removeAttribute('pause');

      publishTrack(track);

      getStreamUrl(o2.streamUrl + track.id, function(r){
        injectSongObj(r);
      });
    }

    function onFinish() {
      fn.controls.next();
    }

    //written by Phrogz from stackoverflow.com [ http://stackoverflow.com/a/4673990 ]
    Date.prototype.customFormat=function(k){var d,e,a,f,g,b,h,m,n,c,i,j,l,o;e=((d=this.getFullYear())+"").slice(-2);g=(b=this.getMonth()+1)<10?"0"+b:b;f=(a=["January","February","March","April","May","June","July","August","September","October","November","December"][b-1]).substring(0,3);n=(c=this.getDate())<10?"0"+c:c;m=(h=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][this.getDay()]).substring(0,3);o=c>=10&&c<=20?"th":(l=c%10)==1?"st":l==2?"nd":l==3?"rd":"th";k=k.replace("#YYYY#",d).replace("#YY#",e).replace("#MMMM#",a).replace("#MMM#",f).replace("#MM#",g).replace("#M#",b).replace("#DDDD#",h).replace("#DDD#",m).replace("#DD#",n).replace("#D#",c).replace("#th#",o);a=d=this.getHours();if(a===0)a=24;if(a>12)a-=12;e=a<10?"0"+a:a;h=(b=d<12?"am":"pm").toUpperCase();f=(i=this.getMinutes())<10?"0"+i:i;g=(j=this.getSeconds())<10?"0"+j:j;return k.replace("#hhh#",d).replace("#hh#",e).replace("#h#",a).replace("#mm#",f).replace("#m#",i).replace("#ss#",g).replace("#s#",j).replace("#ampm#",b).replace("#AMPM#",h);};

    function readjustWidth() {
      durBarWidth = $('duration').clientWidth;
    }

    var durBarWidth, microJump;
    function durationTracking(el, e) {
      readjustWidth();
      microJump = (((e.offsetX/durBarWidth) * songDuration) | 0);

      if (streamUrl) {
        injectSongObj(streamUrl + '&begin=' + microJump);
      } else {
        getStreamUrl(o2.streamUrl + track.id, function(r) {
          injectSongObj(r + '&begin=' + microJump);
        });
      }
    }

    var streamUrl;
    function getStreamUrl(query, callback) {
      fn.json.get(query, function(url) {
        streamUrl = url;

        setTimeout(function(){
          streamUrl = null; //expire the stream url so we can fetch a new one.
        },(30000)); //1000 * 30

        callback(url);
      });
    }

    function getById(id) {
      fn.json.get(o2.searchUrl + 'id:'+id, function(r){
        fn.song.play(r[0]);
      });
    }

    var t, hr, min, sec, timeInterval;
    function scrubTime() {
      if (timeInterval) {
        clearInterval(timeInterval);
        timeInterval = null;
      }

      timeInterval = setInterval(function(){
        time();
      },250);

      function time() {
        t = smSong.position + microJump;
        $('elapsed').style.width = (t/songDuration*100).toFixed(2) + '%';

        t = t/1000;
        hr =  t / 3600>>0;
        t = t % 3600;
        min = t / 60>>0;
        t = t % 60;
        sec = t>>0;

        $('time').innerHTML = ((hr > 0 ? hr + ':' : '') + (min > 0 ? (hr > 0 && min < 10 ? '0' : '') + min + ':' : '0:') + (sec < 10 ? '0' : '') + sec);
      }
    }

    return {
      onLoading: onLoading,
      onFinish: onFinish,
      play: play,
      durationTracking: durationTracking,
      getById: getById
    };

  }());

}(window, document, window.o2));
