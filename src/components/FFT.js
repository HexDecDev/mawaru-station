import React, { Component } from 'react';
import windowSize from 'react-window-size';

//Thanks to elliehoward for tutorial, I was really lazy to port my raw js analyzer to react
//Link: https://github.com/elliehoward/react-audio-visualization
class FFT extends Component
{
    constructor(props){
        super(props)
        this.state = 
        {
            canvasReady: false
        }
    }

    //Вау, сач рекурсия, мач паттерн проектирования.
    //Шучу, костыль конечно.
    checkIsReady = () =>
    {
        if (!this.state.canvasReady)
        {
            if (this.props.player !== undefined && !this.state.canvasReady && this.props.firstClickFired && this.props.player.audioEl.paused) this.createVisualization();
            setTimeout(() => {this.checkIsReady()}, 1000); 
        }
    }

    createVisualization = () => {

        var context
        

        
        if (typeof AudioContext !== 'undefined')
        {
            context = new AudioContext();
            var analyser = context.createAnalyser();
            var canvas = this.refs.analyzerCanvas;
            var ctx = canvas.getContext('2d');
            var audio = this.props.player.audioEl;
    
            audio.src = 'http://mawaru.party:8000/mawaru.ogg';
            
            audio.crossOrigin = 'Anonymous';
            audio.play();
    
            var audioSrc = context.createMediaElementSource(audio);
           
            audioSrc.connect(analyser);
            audioSrc.connect(context.destination);
            analyser.connect(context.destination);
    
    
            
    
            function renderFrame(screenWidth){
                var freqData = new Float32Array(analyser.frequencyBinCount)
                requestAnimationFrame(renderFrame)
                analyser.fftSize = 2048;
                analyser.getFloatFrequencyData(freqData)
                ctx.clearRect(0, 0, canvas.width, canvas.height)
                ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    
                var bar_width = 3;
                var bar_spacing = 1;
                var bars = Math.trunc((canvas.width / (bar_width + bar_spacing))+2);
    
                for (var i = 0; i < bars; i++) {
                    var bar_x = i * (bar_width + bar_spacing);
                    
                    var bar_height = -( (freqData[i+1] + 80) * 4);
                    ctx.fillRect(bar_x, canvas.height, bar_width, bar_height)
                }
            };
            renderFrame(this.props.windowWidth)
        }
        if (typeof webkitAudioContext !== 'undefined')
        {
            alert('Сафари не поддерживается и поддерживаться не будет. Скачайте прямой плейлист (в мп3) и слушайте через айтюнс')
        }

        

        this.setState({canvasReady:true});


    }

    componentWillMount ()
    {
        this.checkIsReady();
    }

    render(){
        
        
        return(

                <canvas
                    ref="analyzerCanvas"
                    id="analyzer"
                    width = {this.props.windowWidth}
                    height = '500px'
                    >
                </canvas>

        )
    }
}


export default windowSize(FFT);