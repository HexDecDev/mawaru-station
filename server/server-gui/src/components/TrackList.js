import React, { Component } from 'react';
import {Table, Tab, Icon, Popup} from 'semantic-ui-react';
import axios from 'axios';

import SongTable from './SongTable';


class TrackList extends Component {

    constructor(props) {
        super(props);
    
        this.state = {
          daySongs : [],
          nightSongs : [],
          jingles : []
        }
      }

    
      listFiles = () => {
        axios.post('http://192.168.1.208:3001/trackslist',{ folder: 'music'}).then(
          data => this.setState({daySongs : data.data}) 
          //console.log(data.data)
        )
    
        axios.post('http://192.168.1.208:3001/trackslist',{ folder: 'night'}).then(
          data => this.setState({nightSongs : data.data}) 
          //console.log(data.data)
        )
    
        axios.post('http://192.168.1.208:3001/trackslist',{ folder: 'jin'}).then(
          data => this.setState({jingles : data.data}) 
          //console.log(data.data)
        )
      }
    
    
      componentDidMount(){
        this.listFiles();
      }
    
      sortList = (playlist, column) => {
    
        var arrayToSort = this.state.daySongs;
    
        switch (playlist){
          case 'music':
            arrayToSort = this.state.daySongs;
          break;
    
          case 'night':
            arrayToSort = this.state.nightSongs;
          break;
    
          case 'jin':
            arrayToSort = this.state.jingles;
          break;
    
          default:
            arrayToSort = this.state.jingles;
          break;
        }
    
        switch (column){
          case 'playCount':
            arrayToSort.sort(function (a, b) {
              return b.playCount - a.playCount;
            });
          break;
    
          case 'rating':
            arrayToSort.sort(function (a, b) {
              return b.rating - a.rating;
            });
          break;
    
          case 'path':
            arrayToSort.sort(function (a, b) {
    
              var valA = a.path.toUpperCase();
              var valB = b.path.toUpperCase();
    
              if (valA < valB) {
                return -1;
              }
              if (valA > valB) {
                return 1;
              }
    
              return 0;
            });
          break;
    
          default:
            console.log('Why are you here?')
          break;
        }
    
        switch (playlist){
          case 'music':
            this.setState({daySongs:arrayToSort})
          break;
    
          case 'night':
            this.setState({nightSongs:arrayToSort})
          break;
    
          case 'jin':
            this.setState({jingles:arrayToSort})
          break;
    
          default:
            console.log('Why are you here?')
          break;
    
        }
    
    
        
    
    }

    render(){
        return(
           <div id = 'TrackList'>
                <Tab className = 'TrackList-content-container' panes={[
                { menuItem: 'Day Playlist', render: () => 
                <Tab.Pane className = 'TrackList-content'>
                            <Table celled striped>
                            <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>#</Table.HeaderCell>
                                <Table.HeaderCell><a href = '# ' role="button" onClick = { () => this.sortList('music', 'playCount')} >    
                                    <Popup
                                            trigger={<Icon name='play' />}
                                            content='Play Count'
                                            size='mini'
                                            inverted
                                            /></a></Table.HeaderCell>
                                <Table.HeaderCell><a href = '# ' role="button" onClick = { () => this.sortList('music', 'rating')} >    
                                    <Popup
                                            trigger={<Icon name='star' />}
                                            content='Track Rating'
                                            size='mini'
                                            inverted
                                            /></a></Table.HeaderCell>
                                <Table.HeaderCell><a href = '# ' role="button" onClick = { () => this.sortList('music', 'path')} >    
                                    <Popup
                                            trigger={<Icon name='server' />}
                                            content='File path'
                                            size='mini'
                                            inverted
                                            /></a></Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                            <tbody>
                                {this.state.daySongs.map((data, index) =>
                                    <SongTable 
                                        key = {Math.random() + index} 
                                        playCount = {data.playCount} 
                                        data = {data.path} 
                                        rating = {data.rating}
                                        index = {index} ></SongTable>
                                )}
                            </tbody>
                            </Table>
                </Tab.Pane> 
                },
                { menuItem: 'Night Playlist', render: () => 
                <Tab.Pane>
                            <Table celled striped>
                            <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>#</Table.HeaderCell>
                                <Table.HeaderCell><a href = '# ' role="button" onClick = { () => this.sortList('night', 'playCount')} >    
                                    <Popup
                                            trigger={<Icon name='play' />}
                                            content='Play Count'
                                            size='mini'
                                            inverted
                                            /></a></Table.HeaderCell>
                                <Table.HeaderCell><a href = '# ' role="button" onClick = { () => this.sortList('night', 'rating')} >    
                                    <Popup
                                            trigger={<Icon name='star' />}
                                            content='Track Rating'
                                            size='mini'
                                            inverted
                                            /></a></Table.HeaderCell>
                                <Table.HeaderCell><a href = '# ' role="button" onClick = { () => this.sortList('night', 'path')} >    
                                    <Popup
                                            trigger={<Icon name='server' />}
                                            content='File path'
                                            size='mini'
                                            inverted
                                            /></a></Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>

                            <tbody>
                                {this.state.nightSongs.map((data, index) =>
                                    <SongTable 
                                        key = {Math.random() + index} 
                                        playCount = {data.playCount} 
                                        data = {data.path} 
                                        rating = {data.rating}
                                        index = {index} ></SongTable>
                                )}
                            </tbody>
                            </Table>
                </Tab.Pane> 
                },
                { menuItem: 'Jingles', render: () => 
                <Tab.Pane>
                            <Table celled striped>
                            <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>#</Table.HeaderCell>
                                <Table.HeaderCell><a href = '# ' role="button" onClick = { () => this.sortList('jin', 'playCount')} >    
                                    <Popup
                                            trigger={<Icon name='play' />}
                                            content='Play Count'
                                            size='mini'
                                            inverted
                                            /></a></Table.HeaderCell>
                                <Table.HeaderCell><a href = '# ' role="button" onClick = { () => this.sortList('jin', 'rating')} >    
                                    <Popup
                                            trigger={<Icon name='star' />}
                                            content='Track Rating'
                                            size='mini'
                                            inverted
                                            /></a></Table.HeaderCell>
                                <Table.HeaderCell><a href = '# ' role="button" onClick = { () => this.sortList('jin', 'path')} >    
                                    <Popup
                                            trigger={<Icon name='server' />}
                                            content='File path'
                                            size='mini'
                                            inverted
                                            /></a></Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                            <tbody>
                                {this.state.jingles.map((data, index) =>
                                    <SongTable 
                                        key = {Math.random() + index} 
                                        playCount = {data.playCount} 
                                        data = {data.path} 
                                        rating = {data.rating}
                                        index = {index} ></SongTable>
                                )}
                            </tbody>
                            </Table>
                </Tab.Pane> 
                },
                ]} />
           </div>
        )
    }
}

export default TrackList;