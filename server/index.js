/*
    Перед вами маленькая обертка для общения с телнет сервером Liquidsoap.
    Я делал ее для себя, потому тут многое захардкожено исходя из моих нужд (например название потока).
    Однако даже этот говнокод будет гораздо понятней для обывателя чем стандартная документация жидкого мыла.
    Правьте для себя как хотите.
    Ну и тут есть мини-костыль шоб обложки с ласт фм грабить. Не советую его использовать.
*/

import * as CoverDelivery from './app/CoverDelivery'; 
import * as AdminControls from './app/AdminControls';
import * as PlayerStatus from './app/PlayerStatus';
import * as TracksDatabase from './app/TracksDatabase';
import express from 'express';
import cors from 'cors';
import axios from 'axios';
import download from 'image-downloader';
import bodyParser from 'body-parser';
import Telnet from 'telnet-client'
const { spawn, exec } = require('child_process');

var connection = new Telnet();
var app = express();
const songsToDisplay = 6;
const enableCoverDelivery = false; //false - отключить сервис доставки обложек.
var params = { host: 'localhost', port: 5657, timeout: 1500 }





app.use( bodyParser.json() ); 
app.use(bodyParser.urlencoded({ extended: true})); 
app.use(cors({ origin: '*' }));
app.use('/covers', express.static(__dirname + '/covers/')); //static to deliver cover


connection.on('timeout', function() {
  connection.end()
})
 
//Административные тулзы
//Можете не пытаться пробовать это по применению к моему радио. Этого нет в реальном проекте.
//app.get('/skip', function (req, res) { AdminControls.skipTrack(connection, params, res);}); //Пропуск трека
//app.post('/setreq', function (req, res) { AdminControls.setRequest(connection, params, req, res);}); //Реквест в эфир
//app.get('/shuffle/day', function (req, res) { AdminControls.shuffleDay(connection, params, res);}); //Перемешать дневной плейлист
//app.get('/shuffle/night', function (req, res) { AdminControls.shuffleNight(connection, params, res);}); //Перемешать ночной плейлист

//Основной путь, все-в-одном епт
app.get('/status',function (req, res) {PlayerStatus.getData(connection, params, res)} );



app.get('/', function (req, res) {
  connection.connect(params);
    connection.send('MAWARU!_Radio.1.metadata', {ors: '\r\n', waitfor: 'END'}, function(err, telres) {
    if (err) return err
    res.send(telres);

  })

});


function listTracks(res){
  const find = exec('find /var/radio/music -type f -name *.mp3', (e, stdout, stderr)=>{
    //res.send(stdout.split('\n'));
    TracksDatabase.GenerateDB(stdout.split('\n'));
    res.send('work')
    
  })
  
}



app.get('/listtracks', function (req, res) {
  listTracks(res);
});



PlayerStatus.ConnectToDB();
app.listen(3001, function () { console.log('Liquidsoap telnet-rest server started on port 3001!');});
process.on('uncaughtException', function (err) { console.log('Caught exception: ', err); });



  
if (enableCoverDelivery) setInterval(CoverDelivery.updateCover, 5000, connection, params, axios, download);
setInterval(PlayerStatus.playerData, 6000, connection, params);

