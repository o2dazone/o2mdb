(function(O2m, d){
  'use strict';

  var Results = function() {
    var self = this,
        $ = O2m.$;

    if (!(self instanceof Results))
      return new Results();

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
        self.songResults += '<a data-songdata="' + self.jsonc.outStr(data) +'" href="#">' + song.album + '/' + song.artist + ' - ' + song.title + '</a>';
      }
    }



    function getMusicQuery(url, callback) {
      self.getJSON(url, function(r){
        self.queryResults = r;
        callback(r);
      });
    }

    var rLen, resultsItems = '';

    function resultCount(rLen) {
      if (rLen >= 100) rLen = rLen + '+';
      $('results').getElementsByTagName('p')[0].innerHTML = rLen + ' results for <span> ' + $('search').value + '</span>';
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

  O2m.Results = Results;
}(window.O2m, document));