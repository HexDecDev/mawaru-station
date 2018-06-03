/*

  Утилита сервисная, тут никаких изысков не будет. Куча компонентов, роутинг, редакс, все это уходит куда подальше. Не сегодня.

*/

import React, { Component } from 'react';
import './App.css';
import { Alert, Table } from 'reactstrap';
import axios from 'axios';

import SongTable from './components/SongTable';


class App extends Component {


  constructor(props) {
    super(props);
    this.state = {
      daySongs : []
    }
  }

  listFiles = () => {
    axios.get('http://192.168.1.30:3001/listtracks').then(
      data => this.setState({daySongs : data.data})
    )
  }


  componentDidMount(){
    //this.listFiles();
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Mawaru Server GUI!</h1>
        </header>
        <div className="App-intro">

        <Table hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Path</th>
            </tr>
          </thead>

          <tbody>
              {this.state.daySongs.map((data, index) =>
                <SongTable key = {Math.random() + index} data = {data} index = {index} ></SongTable>
              )}
          </tbody>
        </Table>

        </div>
      </div>
    );
  }
}

export default App;
