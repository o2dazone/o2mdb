<!doctype html>
<html>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
  <meta name="viewport" content="width=device-width, minimum-scale=1.0, maximum-scale=1.0" />
  <title>o2m</title>
  <link type="text/css" rel="stylesheet" href="i/stylem.css?<?=filemtime('i/stylem.css')?>"/>
  <script type="text/javascript" src="i/sm.js?<?=filemtime('i/sm.js')?>"></script>
</head>
<body>
<div id="controls" style="display:block;">
  <a href="#" data-el="playPause" id="playPauseToggle">PLAY / PAUSE</a>
  <form id="searchForm"><fieldset><input id="search" type="text" value="" placeholder="search" autocomplete="off" /></fieldset></form>
</div>

<a href="#" data-el="controlToggle" id="contToggle" style="display:none;">CONTROLS</a>

<div id="progress" data-el="progressBar" style="display:none;">
  <div id="duration"></div>
</div>


<div id="song"></div>

<div id="playlist" data-el="playlist"></div>

<script type="text/javascript" src="i/buildm.js?<?=filemtime('i/buildm.js')?>"></script>
</body>
</html>
