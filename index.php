<!doctype html>
<html>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <title>o2 Music Player</title>
  <link type="text/css" rel="stylesheet" href="i/style.css?<?=filemtime('i/style.css')?>"/>
  <script type="text/javascript" src="i/sm.js?<?=filemtime('i/sm.js')?>"></script>
</head>
<body>
<script type="text/javascript">if (navigator.userAgent.match(/iPhone/i)) {document.getElementsByTagName('BODY')[0].className = "resize anim"; window.isMobile = true;}</script>
<div id="topNav">
  <h1><a href="index.php">o2mdb</a></h1>
  <form action="index.php" method="get" id="searchField">
    <fieldset>
      <label>Search</label>
      <input id="search" type="text" value="" name="s" autocomplete="off" />
    </fieldset>
  </form>
</div>

<div id="omni" data-el="omni">
  <form action="index.php" method="get" id="omniSearchForm">
    <fieldset>
      <input id="omniSearch" type="text" value="" name="s" autocomplete="off" placeholder="Artist, Title, Album" />
    </fieldset>
  </form>
  <div>
    <p>Have no idea what to look for?</p>
    <a href="#" data-el="latest">Check out the <span>latest uploads</span></a>
    <a href="#" data-el="random">Listen to something <span>random</span></a>
    <a data-el="popular">Come see <span>what is popular</span></a>
  </div>
</div>

<div id="results">
  <p></p>
  <div>
    <div id="resultList" data-el="results"></div>
  </div>
</div>

<div id="playlist" data-el="playlist">
  <div id="player">
    <div id="songInfo"></div>

    <div id="musicPlayer">
      <a href="#" class="pause" data-el="playPause">Play/Pause</a>
      <div id="durationBar">
        <div id="progressBar"></div>
      </div>
      <p id="time"></p>
    </div>
  </div>

  <a href="#" class="clear">Clear Playlist</a><a href="#" class="shuffle">Shuffle</a>
  <div id="playlistScroll"></div>
</div>

<script type="text/javascript" src="i/build.js?<?=filemtime('i/build.js')?>"></script>
</body>
</html>
