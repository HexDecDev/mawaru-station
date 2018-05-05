import React, { Component } from 'react';
import { Image } from 'semantic-ui-react'
import FFT from './FFT'

/*

*/
class BottomPanel extends Component
{

    


    render(){


        var clearString = this.props.displayPreviousSong;
        clearString = clearString.replace(/%20/g, '  ');

        return(

            <div id = 'Player'>
            <FFT player = {this.props.player} firstClickFired = {this.props.firstClickFired} playerPath = {this.props.playerPath}/>
            <div id = 'PlayerHeader'>
                <div id = "AlbumCover"><Image key={new Date()} src={this.props.coverLink} size='medium' /></div>
                <div id = 'SongInfo'>
                  <div id = 'SongTitle'>{this.props.displayTitle}</div>
                  <div id = 'SongArtist'>{this.props.displayArtist}</div>
                  <div id = 'PrevTrack'>Ранее: {clearString}</div>
                </div>
            </div>
            </div>
        );
    }
}


export default BottomPanel;