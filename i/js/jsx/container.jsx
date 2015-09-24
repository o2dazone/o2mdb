'use strict'

module.exports = React.createClass({
    displayName: 'container',
    render: function(){
        return (
                <container>

                  <sidebar>
                    <a href="#" results data-dele-click="nav.showResults" selected>Search Results</a>
                    <a href="#" queue data-dele-click="nav.showQueue">Music Queue</a>
                    <a href="#" playlist data-dele-click="nav.showPlaylist">Playlists</a>
                    <pl data-dele-click="search.latest">Latest Additions</pl>
                    <pl data-dele-click="search.random">Start Listening</pl>
                  </sidebar>

                  <results data-songlist>
                    <sectionhead></sectionhead>

                    <songlegends>
                      <albumart></albumart>
                      <name data-dele-click="search.sort">Name</name>
                      <artist data-dele-click="search.sort">Artist</artist>
                      <album data-dele-click="search.sort">Album</album>
                    </songlegends>

                    <songs data-dele-scroll="paging.scrollEvt" data-dele-click="search.addSongToQueue"></songs>
                  </results>


                  <queue data-hide data-songlist>
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
