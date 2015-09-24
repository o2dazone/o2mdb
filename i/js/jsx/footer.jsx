'use strict'

module.exports = React.createClass({
    displayName: 'footer',
    render: function(){
        return (
                <footer>

                  <info>
                    <albumart></albumart>
                    <name></name>
                    <artistalbum></artistalbum>
                  </info>

                  <player>
                    <previous data-dele-click="controls.previous">Previous Track</previous>
                    <playpause pause data-dele-click="controls.playpause">Play/Pause</playpause>
                    <next data-dele-click="controls.next">Next Track</next>
                    <shuffle data-dele-click="controls.shuffle">Shuffle</shuffle>
                  </player>

                  <duration data-dele-click="controls.skip">
                    <elapsed data-dele-click="controls.skip">
                      <time></time>
                    </elapsed>
                  </duration>

                </footer>
        )
    }
})



