'use strict'

var Songs = require('./songs');

module.exports = React.createClass({
    displayName: 'container',
    render: function(){
        return (
                <container>

                  <sidebar>
                    <a href="#" data-dele-click="nav.showResults" className="results selected">Search Results</a>
                    <a href="#" className="queue" data-dele-click="nav.showQueue">Music Queue</a>
                    <a href="#" className="playlist" data-dele-click="nav.showPlaylist">Playlists</a>
                    <pl data-dele-click="search.latest">Latest Additions</pl>
                    <pl data-dele-click="search.random">Start Listening</pl>
                  </sidebar>

                  <results className="songlist">
                    <sectionhead></sectionhead>

                    <songlegends>
                      <span className="albumart"></span>
                      <span className="name" data-dele-click="search.sort">Name</span>
                      <span className="artist" data-dele-click="search.sort">Artist</span>
                      <span className="album" data-dele-click="search.sort">Album</span>
                    </songlegends>

                    <Songs />
                  </results>


                  <queue className="songlist hide">
                    <sectionhead>You have 0 songs in your queue</sectionhead>

                    <songlegends>
                      <albumart></albumart>
                      <name>Name</name>
                      <artist>Artist</artist>
                      <album>Album</album>
                    </songlegends>

                    <songs data-dele-click="song.prepare" data-dele-change="queue.counter"></songs>

                  </queue>

                </container>
        )
    }
})
