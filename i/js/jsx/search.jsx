'use strict'

module.exports = React.createClass({
    displayName: 'search',
    render: function(){
        return (
                <form action="index.html" method="get">
                  <fieldset>
                    <label>Search</label>
                    <input type="text" placeholder="Search for songs" name="s" autoComplete="off" />
                  </fieldset>
                </form>
        )
    }
})