'use strict'

var json = require('../classes/Json.js');

// function albumArt(url) {

//   var album = <span class="albumArt" style="background-image:url(\'' + url + '=w120-c-h120-e100\');"></span>;
//   var noAlbum = <span class="albumArt"></span>;

//   return (
//     { url ? album : noAlbum}
//   )

// }


module.exports = React.createClass({
    displayName: 'songs',

    getInitialState: function () {
      return {
        songs: [{
          title: "whatever"
        }]
      };
    },

    componentWillMount: function () {
      var that = this;

      json.get("testobj.json", function (data) {
        that.setState({
          songs: data
        });
      });
    },

    render: function(){
      var link = [], data = {};
      var allSongs = this.state.songs.map(function (song) {



        // return (
        //   {song.title}
        // );

        // data = {
        //   album:        {song.album},
        //   title:        {song.title},
        //   artist:       {song.artist},
        //   id:           {song.id},
        //   albumArtUrl:  {song.albumArtUrl}
        // };

        // <span class="albumArt" style={{backgroundImage: 'url(' + {song.albumArtUrl} + '=w120-c-h120-e100')}}></span>

        // var albumStyles = {
        //   backgroundImage: 'url(' + {song.albumArtUrl} + '=w120-c-h120-e100)'
        // };

        var albumStyles = {};

        return (
          <song id={song.id} data-songdata={json.toStr(data)}>
            <span className="albumart" style={albumStyles}></span>
            <span className="name">{song.title}</span>
            <span className="artist">{song.artist}</span>
            <span className="album">{song.album}</span>
          </song>
        );
      });

      var noResults = <noresults>No results found.</noresults>;

      return (
        <songs data-dele-scroll="paging.scrollEvt" data-dele-click="search.addSongToQueue">{this.state.songs ? allSongs : noResults}</songs>
      )
    }
})


