(function(o2, d){
  'use strict';

  var jsonc = o2.Jsonc.getInstance(),
      pagination = o2.Pagination.getInstance();

  var ResultsFactory = function() {
    var $ = o2.$;

    function hideOmnibox() {
      if (document.getElementById('omni')) {
        $('omni').style.opacity = 0;
        setTimeout(function(){
          $('omni').parentNode.removeChild($('omni'));
        },500);
      }
    }

    function showResultsWin() {
      if (!$('results').style.opacity)
          $('results').style.opacity = '1';
    }

    var ajax, r;
    function getJSON (url, callback){
      ajax = new XMLHttpRequest();

      ajax.onreadystatechange = function(){
        if(ajax.readyState === 4 && ajax.status === 200){
          r = ajax.response;

          if (!r.match(/^(\[|\{)/)) return;
          callback(JSON.parse(r));
        }
      };

      ajax.open('GET', url, !0);
      ajax.send();
    }


    var songs, i, len, song, data, link;

    function buildResults() {
      songs = o2.queryResults;


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
          // lastPlayed:   song.lastPlayed,
          // playCount:    song.playCount
        };

        console.log();
        if (!(song.album === '' || song.album === '-'))
          link.push(song.album, '/');

        if (song.artist !== '')
          link.push(song.artist, ' - ');

        if (song.title !== '')
          link.push(song.title);

        o2.songResults += '<a data-el="s" data-songdata="' + jsonc.outStr(data) +'" href="#">' + link.join('') + '</a>';
      }
    }



    function getMusicQuery(url, callback) {
      getJSON(url, function(r){
        o2.queryResults = r;
        callback(r);
      });
    }

    var rLen, resultsItems = '', plural = [],
        resultEl = $('results').getElementsByTagName('p')[0];

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

    function publish(url) {
      hideOmnibox();
      showResultsWin();

      $('resultList').innerHTML = '<h5>Loading...</h5>';

      getMusicQuery(url || o2.musicAjaxCall, function(r){
        rLen = r.length;
        resultCount();
        if (!rLen || r[0] === '') {
          $('resultList').innerHTML = '<span>No results found.</span>';
          return;
        }

        o2.songResults = '';
        resultsItems = '';

        buildResults();
        resultsItems += pagination.paging(rLen);
        resultsItems += o2.songResults;

        //appends all results to result window
        $('resultList').innerHTML = resultsItems;
      });
    }


    return {
      publish: publish
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