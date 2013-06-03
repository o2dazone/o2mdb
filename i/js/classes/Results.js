(function(o2, d){
  'use strict';

  var Results = function() {
    var self = this,
        $ = o2.$;

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


    var songs, i, len, song, data;

    function buildResults() {
      songs = self.queryResults;

      for (i = 0, len = songs.length; i<len; i++) {
        song = songs[i];
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
        self.songResults += '<a data-songdata="' + self.Jsonc.outStr(data) +'" href="#">' + song.album + '/' + song.artist + ' - ' + song.title + '</a>';
      }
    }



    function getMusicQuery(url, callback) {
      self.getJSON(url, function(r){
        self.queryResults = r;
        callback(r);
      });
    }

    var rLen, resultsItems = '', plural,
        resultEl = $('results').getElementsByTagName('p')[0];

    function resultCount() {
      plural = (rLen >= 100) ? '+' : '';
      resultEl.innerHTML = rLen + plural + ' result(s) for <span> ' + $('search').value + '</span>';
    }

    function publish(url) {
      hideOmnibox();
      showResultsWin();

      $('resultList').innerHTML = '<h5>Loading...</h5>';

      getMusicQuery(url || self.musicAjaxCall, function(r){
        rLen = r.length;
        resultCount();
        if (!rLen || r[0] === '') {
          $('resultList').innerHTML = '<span>No results found.</span>';
          return;
        }

        self.songResults = '';
        resultsItems = '';

        buildResults();
        resultsItems += self.Pagination.paging(rLen);
        resultsItems += self.songResults;

        //appends all results to result window
        $('resultList').innerHTML = resultsItems;
      });
    }


    return {
      publish: publish
    };
  };

  o2.Results = Results;
}(window.o2, document));