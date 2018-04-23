import React, { Component } from 'react';
import { List, Header } from 'semantic-ui-react'

import NextSong from './single/NextSong'

class NextSongs extends Component
{

    render(){

        


        var playlistCut = this.props.playlist.slice(1, 6);
        return(
            <div id = 'NextSongsPlaylist'>
                <Header size='medium'>Что дальше:</Header>
                <List>{playlistCut.map((playlist, index) => <NextSong playlist = {playlist} key={index}  />)}</List>
            </div>
        );

    }
}

export default NextSongs;