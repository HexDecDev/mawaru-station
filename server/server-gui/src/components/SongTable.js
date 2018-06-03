import React, { Component } from 'react';

class SongTable extends Component {
    render(){
        return(
            <tr>
                <th scope="row">{this.props.index}</th>
                <td>{this.props.data}</td>
            </tr>
        )
    }
}

export default SongTable;