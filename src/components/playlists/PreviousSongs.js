import React, { Component } from 'react';
import { Header } from 'semantic-ui-react'

import PreviousSong from './single/PreviousSong'

class PreviousSongs extends Component
{
    
    render(){

        var playlistCut = this.props.playlist.slice(0, 5);

        return(
            <div id = 'PreviousSongsPlaylist'>
                <Header size='medium'>Звучало в эфире:</Header>
                {playlistCut.map((playlist, index) => <PreviousSong playlist = {playlist} key={index}  />)}
            </div>
        );

    }
}

export default PreviousSongs;