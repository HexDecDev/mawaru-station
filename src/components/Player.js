import React, { Component } from 'react';
import { Button, Popup } from 'semantic-ui-react'


import PreviousSongs from './playlists/PreviousSongs'
import NextSongs from './playlists/NextSongs'
import StreamLinks from './StreamLinks'

class Player extends Component
{

    constructor(props){
        super(props);
        this.state = 
        {
            activeRightPanel: 'none',
            volume: .5,
            soundPath: 'http://mawaru.party:8000/mawaru.ogg',
            paused: true,
            rightpanelHidden: true,
            playUnblocked: false,
            firstShoted: false,
            firstPlaybackStarted: false
        }
    }

    handleClick = (btnName) => {
        //Чет спонтанно вышло, но охренеть - работает.
        if (btnName === this.state.activeRightPanel && !this.state.rightpanelHidden) this.setState({rightpanelHidden: true})
        else if (!this.state.rightpanelHidden)
        {
            this.setState({rightpanelHidden: true})
            setTimeout(() => {this.setState({activeRightPanel: btnName , rightpanelHidden: false})}, 500);
        }
        else 
        {
            this.setState({activeRightPanel: btnName , rightpanelHidden: false})
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
        if (this.props.player.audioEl.paused) icon = '■';
        else icon = '▶'
        document.title = icon + " " + this.props.tabTitle;
    }

    waitForInit = () =>
    {
        this.setState({playUnblocked:true})
    }


    componentDidMount()
    {
        document.title = this.props.tabTitle;
        setTimeout(() => {this.waitForInit()}, 3000);
        setTimeout(() => {this.refreshTitle()}, 3000);
        this.interval = setInterval(() => this.refreshTitle(), this.props.refreshTimeout * 1000);
        
    }


    setVolume = (vol) => {

        
        this.setState({ volume: vol});
        if (this.props.player !== undefined && Number(this.state.volume) < 1) this.props.player.audioEl.volume = Number(vol);

    }

    render(){
        

        var prevSongsPlaylistName = 'prevSongs';
        var nextSongsPlaylistName = 'nextSongs';
        var streamLinksName = 'streamLinks';

        var rightMenuContent;
        var prevSongsPlaylist =  <PreviousSongs playlist = {this.props.prevTracksPlaylist} />
        var nextSongsPlaylist =  <NextSongs playlist = {this.props.dayPlaylist} />
        var streamLinks = <StreamLinks />
        
        switch (this.state.activeRightPanel) {

            case prevSongsPlaylistName:
                rightMenuContent = prevSongsPlaylist;
                break;
            
            case nextSongsPlaylistName:
                rightMenuContent = nextSongsPlaylist;
                break; 
                
            case streamLinksName:
                rightMenuContent = streamLinks;
                break;  

            default:
                break;
        }

        var playButtonIcon = this.setPlayButtonIcon(this.props.player);

        const hiddenMenu = {opacity: 0, maxHeight:0};
        const visibleMenu = {};

        var playerControlsNormal =  <div id = 'PlayerControls'>
          <Button 
                    id = 'playButton'
                    loading = {!this.state.playUnblocked}
                    disabled = {!this.state.playUnblocked}
                    icon={playButtonIcon} 
                    size = 'huge' 
                    circular 
                    basic 
                    color = 'black' 
                    onClick = { () => {
                        if(this.props.player !== undefined)
                        {
                            if (this.props.player.audioEl.paused) 
                            {
                                //Я уверен, вы охуели от этого
                                if (this.state.firstShoted)
                                {
                                    this.props.player.audioEl.src = this.props.playerPath;
                                    this.props.player.audioEl.play();
                                    this.refreshTitle();
                                }
                                else{
                                    this.setState({firstShoted:true});
                                    this.setState({playUnblocked:false});
                                    setTimeout(() => {this.waitForInit()}, 2000);
                                    this.refreshTitle();
                                }
                            }
                            else
                            {
                                this.props.player.audioEl.pause();
                                this.refreshTitle();
                            }
                                this.forceUpdate();
                                this.setState({paused: this.props.player.audioEl.paused});
                        }
                        
                        }}
                />

                <div id = 'Volume'> 

                    <Button 
                        icon='volume off' 
                        size = 'small' 
                        circular 
                        basic 
                        color = 'black' 
                        onClick = { ()=>this.setVolume(0)}
                        
                    />
                    <div id = 'VolumeSlider'>
                        <input  id = 'volumeSlider' type="range" 
                                value = {this.state.volume} 
                                min="0" 
                                max="0.95" 
                                step="0.01" 
                                onChange = { (e)=>this.setVolume(e.target.value) } />
                    </div>
                    <Button 
                        icon='volume up' 
                        size = 'small' 
                        circular 
                        basic 
                        color = 'black'
                        onClick = { ()=>this.setVolume(.95)} 
                    /> 
                </div>
        </div>
        
        var playerControlsSafari = <div id = 'PlayerControls'> <audio
            src='http://mawaru.party:8000/mawaru128.mp3'  controls="controls" >
        Ваш браузер не поддерживает <code>audio</code> элемент. 
        </audio> </div>
        

        var playerControlsToRender = (this.props.onSafari) ? playerControlsSafari : playerControlsNormal;

        return(
            //Изначально я хотел разнести это все еще по отдельным файлам, но потом так впадлу стало подрубать редакс...
            <div id = 'PlayerWrap'> 

                {playerControlsToRender}

            <div id ='ButtonContainer'>

                <Popup
                    trigger={<Button 
                                    icon='sound' 
                                    size = 'small' 
                                    onClick = { () => this.handleClick('streamLinks')} 
                                    circular 
                                    basic 
                                    color = 'black' />}
                    content='Слушать в плеере'
                    size='small'
                    position='bottom center'
                    inverted
                    />

                <Popup
                  trigger={<Button 
                                icon='fast backward' 
                                size = 'small' 
                                name = 'prevSongs' 
                                onClick = { () => this.handleClick('prevSongs')} 
                                circular 
                                basic 
                                color = 'black' 
                            />}
                  content='Предыдущие треки'
                  size='small'
                  position='bottom center'
                  inverted
                />

                <Popup
                  trigger={<Button 
                                icon='fast forward' 
                                size = 'small' 
                                onClick = { () => this.handleClick('nextSongs')} 
                                circular 
                                basic 
                                color = 'black' />}
                  content='Что дальше'
                  size='small'
                  position='bottom center'
                  inverted
                />

                <Popup
                  trigger={<Button  as = 'a' 
                                    href={'https://vk.com/search?c[section]=audio&c[q]=' + this.props.prevTracksPlaylist[0][1]} 
                                    target="_blank" 
                                    icon='vk'  
                                    size = 'small' 
                                    circular 
                                    basic 
                                    color = 'blue'  />}
                  content='Найти трек в VK'
                  size='small'
                  position='bottom center'
                  inverted
                />
            </div>  

                    
                <div id ='PlaylistContainer' style={ (this.state.rightpanelHidden) ? hiddenMenu : visibleMenu } >
                    {rightMenuContent}
                </div>  
            
        </div>
        );
    }
}

export default Player;