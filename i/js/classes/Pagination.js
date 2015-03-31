var o2 = require('../o2mdb.js'),
    $ = o2.$,
    page = o2.page,
    json = require('./Json.js'),
    query = require('./Query.js'),
    search = require('./Search.js'),
    scrollTimer,
    results = $('results songs'),
    pagingNum = 100;

function getMoreSongs(queryString, callback) {
  queryString = o2.searchUrl + queryString + '/page/' + (page + 1) + '/sort/' + query.getSortQuery() + '/desc';

  json.get(queryString, function(r){
    callback(r);
    page++;
  });
}

function loadMoreResults() {
  getMoreSongs(o2.currentQuery, function(r){
    if (!r.length || r[0] === '') return; // dont load if no results come back (for results divisable by exactly 100)

    //appends all results to result window
    $('results songs').innerHTML += search.buildResults(r);
  });
}

function scrollEvt(el, e) {
  clearTimeout(scrollTimer);
  scrollTimer = setTimeout(function(){
    if ((document.querySelectorAll('results songs song').length === pagingNum * page) && (results.scrollHeight - results.scrollTop - 500) < results.clientHeight) {
      loadMoreResults();
    }
  },500);
}

module.exports = {
  scrollEvt: scrollEvt
};