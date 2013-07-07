(function(o2, d){
  'use strict';

  var jsonc = o2.Jsonc.getInstance(),
      pagination = o2.Pagination.getInstance();

  var ResultsFactory = function() {
    var $ = o2.$;

    var songs, allResults = '',
        searchUrl = 'http://o2dazone.com/music/search/';

    function showResultsWin() {
      if (!$('results').style.opacity)
          $('results').style.opacity = '1';
    }

    var i, len, song, data, link;

    function buildResults() {
      for (i = 0, len = songs.length; i<len; i++) {
        song = songs[i],
        link = [],
        data = {
          album:        song.album,
          title:        song.title,
          artist:       song.artist,
          id:           song.id,
          // year:         song.year,
          albumArtUrl:  song.albumArtUrl
          // lastPlayed:   song.lastPlayed
          // playCount:    song.playCount
        };

        if (!(song.album === ''))
          link.push(song.album, '/');

        link.push(song.artist, ' - ');
        link.push(song.title);

        allResults += '<a data-el="s" data-songdata="' + jsonc.outStr(data) +'" href="#">' + link.join('') + '</a>';
      }
    }

    function getMusicQuery(query, callback) {
      query = searchUrl + query;
      o2.getJSON(query, function(r){
        songs = r;
        callback(r);
      });
    }

    var rLen, resultsItems = '', plural = [],
        resultEl = d.querySelector('#results p');
    function resultCount() {
      plural = [];

      plural.push(
        '<b>', rLen,
        (rLen >= 100) ? '+' : '', '</b>',
        ' result',
        (rLen === 1) ? '' : 's',
        ' for <span> ', $('search').value, '</span>'
      );

      resultEl.innerHTML = plural.join('');
    }

    function publishToResults(query) {
      showResultsWin();

      $('resultList').innerHTML = '<h5>Loading...</h5>';

      getMusicQuery(query, function(r){
        rLen = r.length;
        resultCount();
        if (!rLen || r[0] === '') {
          $('resultList').innerHTML = '<span>No results found.</span>';
          return;
        }

        allResults = '';
        resultsItems = '';

        buildResults();
        resultsItems += pagination.paging(rLen);
        resultsItems += allResults;

        //appends all results to result window
        $('resultList').innerHTML = resultsItems;
      });
    }

    function getAllResults() {
      return allResults;
    }

    function publishToPlaylist(query, callback) {
      getMusicQuery(query, function(r){
        allResults = '';
        buildResults();

        //appends query to playlist window, for autoplay
        $('playlistScroll').innerHTML = allResults;
        if (callback)
          callback();
      });
    }


    return {
      publishToResults: publishToResults,
      publishToPlaylist: publishToPlaylist,
      getAllResults: getAllResults
    };
  };

  var instances = {};

  function getInstance(name) {
    if (!instances[name]) {
      instances[name] = new ResultsFactory(name);
    }

    return instances[name];
  }

  o2.Results = {
    getInstance: getInstance
  };
}(window.o2, document));