(function(w,d, o2){
  'use strict';

  var fn = o2.fn,
      $ = o2.$;

  fn.paging = (function(){

    var page = 1,
        pagingNum = 100;

    function getMoreSongs(query, callback) {
      query = o2.searchUrl + query + '/page/' + (page + 1) + '/sort/' + fn.query.getSortQuery() + '/desc';

      fn.json.get(query, function(r){
        callback(r);
        page++;
      });
    }

    function loadMoreResults() {
      getMoreSongs(o2.currentQuery, function(r){
        if (!r.length || r[0] === '') return; // dont load if no results come back (for results divisable by exactly 100)

        //appends all results to result window
        $('results songs').innerHTML += fn.search.buildResults(r);
      });
    }

    var scrollTimer,
        results = $('results songs');
    function scrollEvt(el, e) {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(function(){
        if ((d.querySelectorAll('results songs song').length === pagingNum * page) && (results.scrollHeight - results.scrollTop - 500) < results.clientHeight) {
          loadMoreResults();
        }
      },500);
    }

    function reset() {
      page = 1;
    }

    return {
      scrollEvt: scrollEvt,
      reset: reset
    };

  }());

}(window, document, window.o2));







