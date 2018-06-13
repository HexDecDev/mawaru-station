/*

  Утилита сервисная, тут никаких изысков не будет. Куча компонентов, роутинг, редакс, все это уходит куда подальше. Не сегодня.

*/

import React, { Component } from 'react';
import './App.css';

import TrackList from './components/TrackList';
import SideControlPanel from './components/SideControlPanel';


class App extends Component {

  constructor(props) {
    super(props);
    this.state = {  
        firstClickFired: false,
        tabTitle: 'Mawaru Station is loading!',
        onSafari: false
    }
  }

  firstClickDetector = () => {
    //Ебал в рот я ваш гугель хром и матерей тех, кто говнокодил автоплей полиси.
      this.setState({firstClickFired:true});
      var playButton = document.getElementById('playButton');
      playButton.removeEventListener("click", this.firstClickDetector);
  }
    
  clickListener = () => {
      var playButton = document.getElementById('playButton');
      playButton.addEventListener("click", this.firstClickDetector);
  }

  componentDidMount = () =>
  {
      this.clickListener();
      //this.safariDetect();
  }

  render() {
    return (
      <div className="App">
        <div className="App-content">
          <SideControlPanel firstClickFired = {this.state.firstClickFired} />
          <TrackList />
        </div>
      </div>
    );
  }
}

export default App;
