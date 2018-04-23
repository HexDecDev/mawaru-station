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
            if (this.props.player !== undefined && !this.state.canvasReady) this.createVisualization();
            setTimeout(() => {this.checkIsReady()}, 1000); 
        }
    }

    createVisualization = () => {

       
        var context = new AudioContext();
        var analyser = context.createAnalyser();
        var canvas = this.refs.analyzerCanvas;
        var ctx = canvas.getContext('2d');
        var audio = this.props.player;
        audio.audioEl.crossOrigin = "anonymous";
        var audioSrc = context.createMediaElementSource(audio.audioEl);
        audioSrc.connect(analyser);
        audioSrc.connect(context.destination);
        analyser.connect(context.destination);

        this.setState({canvasReady:true});

        
        function renderFrame(screenWidth){
            var freqData = new Float32Array(analyser.frequencyBinCount)
            requestAnimationFrame(renderFrame)
            analyser.fftSize = 2048;
            analyser.getFloatFrequencyData(freqData)
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';

            
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