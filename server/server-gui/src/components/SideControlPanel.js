import React, { Component } from 'react';
import ReactAudioPlayer from 'react-audio-player';
import { Button, Divider } from 'semantic-ui-react'

import './Slider.css';
import './SidePanel.css';

const MusicPath = 'http://192.168.1.208:8000/mawaru.ogg';

class SideControlPanel extends Component {

    constructor(props){
        super(props);
        this.state = 
        {
            activeRightPanel: 'none',
            volume: .5,
            soundPath: 'http://192.168.1.208:8000/mawaru.ogg',
            paused: true,
            rightpanelHidden: true,
            playUnblocked: false,
            firstShoted: false,
            firstPlaybackStarted: false
        }
    }

      
    setPlayButtonIcon = (player) =>
    {
         if(player !== undefined) 
        {
            if (!player.audioEl.paused) return 'stop';
            else{
                return 'play';
            }              
        }
        else return 'play';
        
    }

    refreshTitle = () =>
    {
        var icon;
        if (this.player.audioEl.paused) icon = '■';
        else icon = '▶'
        document.title = icon + " " + this.props.tabTitle;
    }

    waitForInit = () =>
    {
        this.setState({playUnblocked:true})
    }


    componentDidMount()
    {
        document.title = 'Mawaru Station Control Panel';
        setTimeout(() => {this.waitForInit()}, 3000);
        setTimeout(() => {this.refreshTitle()}, 3000);
        this.interval = setInterval(() => this.refreshTitle(), 5 * 1000);
        
    }



    setVolume = (vol) => {

        this.setState({ volume: vol});
        if (this.player !== undefined && Number(this.state.volume) < 1) this.player.audioEl.volume = Number(vol);

    }


    render(){

        var volume = 0;
        var volumeSlider = document.getElementById('volumeSlider');
        if (volumeSlider !== null) volume = Number(volumeSlider.value);

        var playButtonIcon = this.setPlayButtonIcon(this.player);


        return(
            <div id = 'SideControlPanel'>
                <div id = 'SidePanelHeader'>
                    <div id = 'Logo'>
                        <div id = 'LogoMain'>
                            MAWARU STATION
                        </div>
                        <div id = 'LogoSub'>
                            Admin Panel
                        </div>
                    </div>
                </div>

                <div id = 'Player'>

                <ReactAudioPlayer 
                    id = 'qqwsa' 
                    volume = {volume} 
                    autoPlay = {false} 
                    crossOrigin = 'anonymous' 
                    src={MusicPath} 
                    ref={(element) => { this.player = element; }} 
                />

                <div id = 'PlayerControls'>
                    <Button 
                                id = 'playButton'
                                loading = {!this.state.playUnblocked}
                                disabled = {!this.state.playUnblocked}
                                icon={playButtonIcon} 
                                size = 'huge' 
                                inverted 
                                color = 'violet' 
                                onClick = { () => {
                                    if(this.player !== undefined)
                                    {
                                        if (this.player.audioEl.paused) 
                                        {
                                            //Я уверен, вы охуели от этого
                                            if (this.state.firstShoted)
                                            {
                                                this.player.audioEl.src = MusicPath;
                                                this.player.audioEl.play();
                                                this.refreshTitle();
                                            }
                                            else{
                                                this.setState({firstShoted:true});
                                                this.setState({playUnblocked:false});
                                                setTimeout(() => {this.waitForInit()}, 2000);
                                                this.refreshTitle();
                                                this.player.audioEl.play();
                                            }
                                        }
                                        else
                                        {
                                            this.player.audioEl.pause();
                                            this.refreshTitle();
                                        }
                                            this.forceUpdate();
                                            this.setState({paused: this.player.audioEl.paused});
                                    }
                                    
                                    }}
                            />

                            <div id = 'Volume'> 
                                <div id = 'VolumeSlider'>
                                    <input  id = 'volumeSlider' type="range" 
                                            value = {this.state.volume} 
                                            min="0" 
                                            max="0.95" 
                                            step="0.01" 
                                            onChange = { (e)=>this.setVolume(e.target.value) } />
                                </div>
                            </div>
                </div>


                

                </div>

                <Divider className = 'SidePanelDivider' horizontal inverted> Управление эфиром </Divider>
                
                <div id = 'BroadcastControl' className = 'ButtonContainer' >
                <Button.Group fluid>
                    <Button inverted className = 'SidePanelButton' >One</Button>
                    <Button inverted className = 'SidePanelButton' >Two</Button>
                </Button.Group>
                </div>

                <Divider className = 'SidePanelDivider' horizontal inverted> Обновить плейлисты </Divider>

                <div id = 'RefreshPlaylists' className = 'ButtonContainer'>
                <Button.Group fluid>
                    <Button inverted className = 'SidePanelButton' >One</Button>
                    <Button inverted className = 'SidePanelButton' >Two</Button>
                    <Button inverted className = 'SidePanelButton' >Three</Button>
                </Button.Group>
                </div>


            </div>
        )
}

}

export default SideControlPanel;