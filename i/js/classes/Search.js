(function(w,d, o2){
  'use strict';

  var $ = o2.$,
      _ = o2._,
      fn = o2.fn;

  fn.search = (function(){

    var songs;

    /* sonic loader */
    var loader = new Sonic({
        width: 50,
        height: 20,
        padding: 10,

        stepsPerFrame: 1,
        trailLength: .8,
        pointDistance: .02,
        fps: 240,
        strokeColor: '#3179A1',

        step: 'fader',

        multiplier: 1,

        setup: function() {
          this._.lineWidth = 2;
        },

        path: [
          ['arc', 10, 10, 10, -270, -90],
          ['bezier', 10, 0, 40, 20, 20, 0, 30, 20],
          ['arc', 40, 10, 10, 90, -90],
          ['bezier', 40, 0, 10, 20, 30, 0, 20, 20]
        ]
    });

    function search(e) {
      if (e.keyCode === 13) {
        e.preventDefault();
        displayResults(e.target.value);
      }
    }

    function getSongs(query, callback) {
      o2.currentQuery = query; // sets the "current" query for pagination

      // query = (window.host) ? o2.searchUrl + query : 'testobj.json';

      query = o2.searchUrl + query;

      fn.json.get(query, function(r){
        songs = r;
        callback(r);
      });
    }

    function albumArt(url) {
      if (url) {
        url = url.replace('https:https','https'); //this is for something weird in the data...remove when getting proper album art
        return '<albumart style="background-image:url(\'' + url + '=w120-c-h120-e100\');"></albumart>'
      }
      return '<albumart></albumart>'
    }


    var resultsItems, i, len, song, data, link, indSong;
    function buildResults(songs, reverse) {
      resultsItems = [];

      for (i = 0, len = songs.length; i<len; i++) {
        song = songs[i],
        link = [],
        data = {
          album:        song.album,
          title:        song.title,
          artist:       song.artist,
          id:           song.id,
          albumArtUrl:  song.albumArtUrl
        };

        link.push(albumArt(song.albumArtUrl));
        link.push('<name>', song.title, '</name>');
        link.push('<artist>', song.artist, '</artist>');
        link.push('<album>', song.album || '', '</album>');

        indSong = '<song data-songdata="' + fn.json.toStr(data) + '">' + link.join('') + '</song>';

        reverse ? resultsItems.unshift(indSong) : resultsItems.push(indSong);
      }

      return resultsItems.join('');
    }


    var rLen, searchHead;

    function resultCount(query) {
      searchHead = [];

      searchHead.push(
        'Found ', rLen,
        (rLen >= 100) ? '+' : '',
        ' result',
        (rLen === 1) ? '' : 's',
        ' for <term> ', query || $('input').value, '</term>'
      );

      searchHead.push('<addall data-dele-click="search.addAll">Add all results to queue</addall>');

      loader.stop();
      $('results sectionhead').innerHTML = searchHead.join('');
    }

    var searchQuery, songIdQuery, tmpDecode;
    function displayResults(query, reverse) {
      fn.navigation.showResults();

      loader.play();
      $('results sectionhead').innerHTML = '';
      $('results sectionhead').appendChild(loader.canvas);

      getSongs(query, function(r){
        rLen = r.length;
        resultCount(query);
        if (!rLen || r[0] === '') {
          $('results songs').innerHTML = '<noresults>No results found.</noresults>';
          return;
        }

        //appends all results to result window
        addResults(buildResults(songs, reverse));

        searchQuery = '?s=' + query;
        if ((songIdQuery = fn.query.getSongIdQuery()))
          songIdQuery = '&p=' + songIdQuery;

        fn.query.write(query, searchQuery + songIdQuery);
      });
    }

    function addResults(results) {
      fn.paging.reset();
      $('results songs').innerHTML = results;
    }

    function glow(el) {
      el.setAttribute('glow','');
      el.setAttribute('fade','');
      setTimeout(function(){
        el.removeAttribute('glow');

        setTimeout(function(){
          el.removeAttribute('fade')
        },350); // set this variable to css transition
      },225); // how long it should stay blue
    }

    var songTar;
    function addSongToQueue(el, e) {
      songTar = e.target;
      resultClick(e, songTar);
    }

    var resultQuery;
    function resultClick(e, el) {
      switch (el.tagName) {
      case 'ALBUMART':
        fn.queue.prepareSong(el, e);
        break;
      case 'NAME':
        songTar = songTar.parentNode;
        $('queue songs').innerHTML += songTar.outerHTML;
        fn.queue.counter(1);
        glow(songTar);
        glow($('sidebar [queue]'));
        break;
      case 'ARTIST':
        resultQuery = 'artist:"' + el.firstChild.nodeValue + '"';
        $('input').value = resultQuery;
        displayResults(resultQuery);
        break;
      case 'ALBUM':
        resultQuery = 'album:"' + el.firstChild.nodeValue + '"';
        $('input').value = resultQuery;
        displayResults(resultQuery);
        break;
      default:
        break;
      }
    }

    var allCount, allSongs;
    function addAll(el) {
      $('queue songs').innerHTML += resultsItems.join('');
      glow(el);
      glow($('sidebar [queue]'));
      allCount = d.querySelectorAll('results songs song').length;
      fn.queue.counter(allCount);
    }

    var date = new Date(),
        lookBack = 31536000000; //year
    function latest() {
      displayResults('creationDate:[' + (date-lookBack) + ' ' + date*1 + ']', true);
    }

    function random() {
      console.log('this is random');
    }

    return {
      search: search,
      getSongs: getSongs,
      albumArt: albumArt,
      buildResults: buildResults,
      displayResults: displayResults,
      addSongToQueue: addSongToQueue,
      addAll: addAll,
      latest: latest,
      random: random
    };

  }());

}(window, document, window.o2));


