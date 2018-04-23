import React, { Component } from 'react';

class PreviousSong extends Component
{
    render(){

        if (this.props.playlist !== null)var cuttedOutDate = this.props.playlist[0].split(' ');

        var clearString = this.props.playlist[1];
        clearString = clearString.replace(/%20/g, '  ');

        if (clearString.indexOf('file_') !== -1) clearString = 'Telegram Request'


        return(
            <div id = 'PreviousSong'>{cuttedOutDate[1]}<br/><b>{clearString} </b></div>
        );

    }
}

export default PreviousSong;