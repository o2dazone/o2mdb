var o2 = require('../o2mdb.js'),
    page = o2.page,
    json = require('./Json.js'),
    songModule = require('./Song.js'),
    queue = require('./Queue.js'),
    query = require('./Query.js'),
    navigation = require('./Navigation.js'),
    $ = o2.$,
    _ = o2._,
    date = ('creationDate:[1 ' + (new Date()*2) + ']'),
    songs, sort, resultsItems, i, len, song, data, link, indSong, rLen, allCount, allSongs, resultQuery, songTar, searchHead, lastPlaying, tmpDecode;

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

function addResults(results) {
  page = 1;
  $('results songs').scrollTop = 0; //scroll to top of div
  $('results songs').innerHTML = results;
}

function displayResults(queryString, history, scroll) {
  var self = this;
  if (!queryString) return;
  navigation.showResults();

  loader.play();
  $('results sectionhead').innerHTML = '';
  $('results sectionhead').appendChild(loader.canvas);

  getSongs(queryString, function(r){
    rLen = r.length;
    resultCount(queryString);
    if (!rLen || r[0] === '') {
      $('results songs').innerHTML = '<noresults>No results found.</noresults>';
      return;
    }

    //appends all results to result window
    addResults(buildResults(songs));

    // write query param history
    query.write(history);

    // selects currently playing song
    if (!!query.getSongIdQuery()) {
      if((lastPlaying = _('song[id="' + query.getSongIdQuery() + '"]'))) {
        lastPlaying.setAttribute('playing','');
        if (scroll)
          lastPlaying.scrollIntoView(1);
      }
    }
  });
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

function resultClick(e, el) {
  switch (el.tagName) {
  case 'ALBUMART':
    songModule.prepare(el, e);
    break;
  case 'NAME':
    songTar = songTar.parentNode;
    $('queue songs').innerHTML += songTar.outerHTML;
    queue.counter(1);
    glow(songTar);
    glow($('sidebar [queue]'));
    break;
  case 'ARTIST':
    if (el.firstChild) {
      resultQuery = 'artist:"' + el.firstChild.nodeValue + '"';
      $('input').value = resultQuery;
      displayResults(resultQuery, {'search':resultQuery, 'sort':'creationDate'});
    }
    break;
  case 'ALBUM':
    if (el.firstChild) {
      resultQuery = 'album:"' + el.firstChild.nodeValue + '"';
      $('input').value = resultQuery;
      displayResults(resultQuery, {'search':resultQuery, 'sort':'creationDate'});
    }
    break;
  default:
    break;
  }
}

function getSongs(queryString, callback) {
  o2.currentQuery = queryString; // sets the "current" query for pagination

  // query = (window.host) ? o2.searchUrl + query : 'testobj.json';
  queryString = o2.searchUrl + queryString;

  json.get(queryString + '/sort/' + query.getSortQuery() + '/desc', function(r){
    songs = r;
    callback(r);
  }, function(){
    loader.stop();
    $('results sectionhead').innerHTML = 'Oh noez!!!!11111oneoneoneone';
    $('results songs').innerHTML = '<noresults>There was an error with your query...try something else?</noresults>'
  });
}

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

function buildResults(songs) {
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

    link.push(songModule.albumArt(song.albumArtUrl));
    link.push('<name>', song.title, '</name>');
    link.push('<artist>', song.artist, '</artist>');
    link.push('<album>', song.album || '', '</album>');

    indSong = '<song id="' + song.id + '" data-songdata="' + json.toStr(data) + '">' + link.join('') + '</song>';

    resultsItems.push(indSong);
  }

  return resultsItems.join('');
}

function addSongToQueue(el, e) {
  songTar = e.target;
  resultClick(e, songTar);
}

function sort(el, e) {
  displayResults(o2.currentQuery, {'sort': el.tagName.toLowerCase()});
}


function addAll(el) {
  $('queue songs').innerHTML += resultsItems.join('');
  glow(el);
  glow($('sidebar [queue]'));
  allCount = document.querySelectorAll('results songs song').length;
  queue.counter(allCount);
}

function latest() {
  displayResults(date, {'search': date, 'sort': 'creationDate'});
}

function random() {
  console.log('this is random');
}

function search(e) {
  if (e.keyCode === 13) {
    e.preventDefault();
    e.target.blur();
    displayResults(e.target.value, {'search':e.target.value, 'sort':'creationDate'});
  }
}

module.exports = {
  search: search,
  buildResults: buildResults,
  resultCount: resultCount,
  displayResults: displayResults,
  addSongToQueue: addSongToQueue,
  sort: sort,
  addAll: addAll,
  latest: latest,
  random: random
};


