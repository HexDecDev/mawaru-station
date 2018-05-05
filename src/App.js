import React, { Component } from 'react';
import './App.css';
import './WhiteButton.css';
import './Slider.css';
import {XMLPath, PlayerPath, RefreshTimeout, DataserverPath, JingleTitle, JingleCustomMessage} from './config.json'
import axios from 'axios'
import ReactAudioPlayer from 'react-audio-player';

//Components

import BottomPanel from './components/BottomPanel'
import Player from './components/Player'



class App extends Component {

  //В этом приложении все стейты хранятся в родительском скрипте и раскидываются ниже. Для минимизации запросов к серверу (это критично)
  constructor(props) {
    super(props);
    this.state = {  
        streamData:[],
        streamArtist: '',
        streamSongName: '',
        steamListeners: '',
        streamPeakListeners: '',
        dayPlaylist: ['Loading...','Loading...'],
        nightPlaylist: ['Loading...','Loading...'],
        prevTracksPlaylist: [['Loading...','Loading...'],['Loading...','Loading...'],['Loading...','Loading...'],['Loading...','Loading...']], //Я заебался, но без этого ничего работать не будет
        requestLink: '',
        getNameFromFile: false,
        coverLink: DataserverPath + '/covers/album.png',
        oldArtist: '', //пук пук
        oldTitle: '', //я слишком туп чтоб придумтаь что-то умнее
        oldFilename: '',
        displayPreviousSong: '',
        firstClickFired: false,
        tabTitle: 'Mawaru Station is loading!'
    }
}


handleChange = (e) => {
  this.setState({ [e.target.name]: e.target.value});
}


/*
  Важная информация для тех, кто по какой-то невероятной причине решит развернуть это у себя.
  Пункт <creator> генерируется только если вы используете Vorbis/OGG в качестве источника для айскаста.
  Если вы используете MP3/LAME, то  жидкое мыло сгенерирует только <title> и парсить вам его придется вручную.
  Ну, если вы конечно сильно хотите сделать визуальное разделение на иcполнителя и трек
*/
getXMLinfo = () =>
{
  axios.get(XMLPath).then(resp => 
    {

      var artist;
      var title;

      if (resp.data.indexOf('<creator>') !== -1)artist=resp.data.substring(resp.data.lastIndexOf("<creator>")+9,resp.data.lastIndexOf("</creator>"));
        else artist = "No Artist";

      if (resp.data.indexOf('<title>') !== -1) title=resp.data.substring(resp.data.lastIndexOf("<title>")+7,resp.data.lastIndexOf("</title>"));
        else title = "No Title";

      if (artist === "No Artist" && title === "No Title") this.setState({getNameFromFile: true})
        else this.setState({getNameFromFile: false})
      if (title === JingleTitle) artist = JingleCustomMessage;


      

      var listeners=resp.data.substring(resp.data.lastIndexOf("Current Listeners: ")+19,resp.data.lastIndexOf("Peak"));
      var peakListeners=resp.data.substring(resp.data.lastIndexOf("Peak Listeners: ")+16,resp.data.lastIndexOf("Stream"));

      var tabTitle;

      var clearString = this.state.prevTracksPlaylist[0][1];
      clearString = clearString.replace(/%20/g, '  ');

      if (title === "No Title") tabTitle = clearString;
      else  tabTitle = artist + " - " + title;



      this.setState({
        streamArtist:artist,
        streamSongName:title,
        steamListeners:listeners,
        steamPeakListeners:peakListeners,
        streamData:resp.data,
        tabTitle: tabTitle

      } );


      //Дамы и господа - перед вами НЕЕБИЧЕСКИЙ КОСТЫЛИЩА. Да, его уровень неебичести огромен. Но он вроде работает.

      var coverLink = this.state.coverLink;
      if (this.state.oldArtist !== artist || this.state.oldTitle !== title || this.state.oldFilename !== this.state.prevTracksPlaylist[0][1])
      {
        setTimeout(() => {this.setState({coverLink: coverLink + '?' + new Date()})}, 10000);
        setTimeout(() => {this.setState({oldArtist:artist, oldTitle:title, oldFilename: this.state.prevTracksPlaylist[0][1]})}, 10000);
      }

    })
}

skipTrack = () =>
{
  axios.get(DataserverPath + '/skip').then(resp => 
    {
      console.log('skipped')
    }
  );
}

setRequest = () =>
{
  axios.post(DataserverPath + '/setreq', { link: this.state.requestLink })
      .then(res => {
        console.log(res);
        console.log(res.data);
      })

  this.setState({requestLink: ''})    
}

shuffleDay = () =>
{
  axios.get(DataserverPath + '/shuffle/day').then(resp => 
    {
      console.log('Day shuffled')
    }
  );
}

shuffleNight = () =>
{
  axios.get(DataserverPath + '/shuffle/night').then(resp => 
    {
      console.log('Night shuffled')
    }
  );
}

getPlaylists = () =>
{
  axios.get(DataserverPath + '/status').then(resp => 
    {
      this.setState({dayPlaylist: resp.data.dayPlaylist, 
                      nightPlaylist: resp.data.nightPlaylist, 
                      prevTracksPlaylist: resp.data.previousSongs})
      if (this.state.prevTracksPlaylist[1] !== undefined) 
      {
        if (this.state.prevTracksPlaylist[1][1].indexOf('file_') !== -1) this.setState ({displayPreviousSong: 'Telegram Request'})
        else this.setState ({displayPreviousSong: this.state.prevTracksPlaylist[1][1]})
      }
    }
  )
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


refreshAllData = () => 
{
  this.getXMLinfo();
  this.getPlaylists();
}

componentDidMount = () =>
{
    this.refreshAllData();
    this.interval = setInterval(() => this.refreshAllData(), RefreshTimeout * 1000);
    this.clickListener();
    
    
}

render() {


    var clearString = this.state.prevTracksPlaylist[0][1];
    clearString = clearString.replace(/%20/g, '  ');

    var displayTitle = (this.state.getNameFromFile) ? clearString : this.state.streamSongName;
    var displayArtist = (this.state.getNameFromFile || this.state.streamArtist === "No Artist") ? "Mawaru Station" : this.state.streamArtist;

    if (displayTitle.indexOf('file_') !== -1) displayTitle = 'Telegram Request'


    return (
      <div id="App">
        <div id = 'Header'>

          <div id = 'Logo'>
            MAWARU STATION
          </div>

        <ReactAudioPlayer id = 'qqwsa' autoPlay = {false} crossOrigin = 'anonymous' src={PlayerPath} ref={(element) => { this.player = element; }} />

        <Player 
          prevTracksPlaylist = {this.state.prevTracksPlaylist}
          dayPlaylist = {this.state.dayPlaylist}
          nightPlaylist = {this.state.nightPlaylist}
          player = {this.player}
          playerPath = {PlayerPath}
          tabTitle = {this.state.tabTitle}
          refreshTimeout = {RefreshTimeout}
        />

 
        </div>
        

        <BottomPanel 
          coverLink = {this.state.coverLink}
          displayPreviousSong = {this.state.displayPreviousSong}
          displayTitle = {displayTitle}
          displayArtist = {displayArtist}
          player = {this.player}
          firstClickFired = {this.state.firstClickFired}
          playerPath = {PlayerPath}
        />
        

      </div>


    );
  }
}

export default App;
