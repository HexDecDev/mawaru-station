import React, { Component } from 'react';

class SongTable extends Component {
    render(){
        return(
            <tr>
                <th scope="row">{this.props.index + 1}</th>
                <td>{this.props.playCount}</td>
                <td>{this.props.rating}</td>
                <td>{this.props.data}</td>
            </tr>
        )
    }
}

export default SongTable;