/*
    Изначально все работало через телнет сервер напрямую. Ну то есть юзер стучится в апи, апи стучится в телнет и так далее. Однако...
    В общем это нихуя не эффективно.  Коннект рвется постоянно, ошибки. Принято решение прокинуть монгодб и хранить в нем все, что отдается пользователю.
    А общение с телнетом оставить на совести сервера. Так и ошибок меньше. Наверное.
*/

import mongoose from'mongoose';
mongoose.Promise = global.Promise;
var db = mongoose.connection;
const Schema = mongoose.Schema;


const songsToDisplay = 7; 


const RadioStatus = new Schema({
    playerStatus     : { type: Boolean,  required: true },
    dayPlaylist      : { type: [String], required: true },
    nightPlaylist    : { type: [String], required: true },
    previousSongs    : { type: [[String]], required: true }
});

const Status = mongoose.model('Status', RadioStatus);

function createEmpty()
{
    const status = new Status({
        playerStatus: true,
        dayPlaylist: [],
        nightPlaylist: [],
        previousSongs: [[]]
    });

    return status.save();
}


function getDayPlaylist (connection, params)
{
    var arrayToRet = [];
    connection.connect(params);
    connection.send('music.next', {ors: '\r\n', waitfor: 'END'}, function(err, telres) {
        var splitArray = telres.split('\n');
        for (var i = 0; i < songsToDisplay; i++)
        {
            arrayToRet[i] = splitArray[i].substring(splitArray[i].lastIndexOf("/")+1,splitArray[i].lastIndexOf(".mp3"));
        }

        if (arrayToRet[0].length !== 0)  Status.findOneAndUpdate({}, { $set:{ dayPlaylist: arrayToRet }}).then(res => {});
    })
    connection.end();
}

function getNightPlaylist (connection, params)
{
    var arrayToRet = [];
    connection.connect(params);
    connection.send('night.next', {ors: '\r\n', waitfor: 'END'}, function(err, telres) {
        
        var splitArray = telres.split('\n');
        for (var i = 0; i < songsToDisplay; i++)
        {
           if(splitArray[i]) arrayToRet[i] = splitArray[i].substring(splitArray[i].lastIndexOf("/")+1,splitArray[i].lastIndexOf(".mp3"));
        
        }
        Status.findOneAndUpdate({}, { $set:{ nightPlaylist: arrayToRet }}).then(res => {});
    })
    connection.end();
}


function getPreviousSongs (connection, params)
{

    connection.connect(params);
    connection.send('MAWARU!_Radio.1.metadata', {ors: '\r\n', waitfor: 'END'}, function(err, telres) 
    {

       var splits = telres.split('\n');
       var trackNames = [];
       var playingTime = []; 


       for (var q = 0; q < splits.length; ++q)
        {
            var val = splits[q];
            var arrayToPush = [];
            var needPush = false;

            if (val.indexOf("initial_uri=") >= 0)
            {
                trackNames.push(val.substring(val.lastIndexOf("/")+1,val.lastIndexOf(".mp3")));
            }

            if (val.indexOf("on_air=") >= 0)
            {
                playingTime.push(val.substring(val.lastIndexOf("on_air=")+8,val.lastIndexOf("\"")));
            }
        }

        var finalArray = [];
        for (var q = 0; q < trackNames.length; ++q)
        {
            var singleArray = [playingTime[q], trackNames[q]];
            finalArray.push(singleArray);
        }

        Status.findOneAndUpdate({}, { $set:{ previousSongs: finalArray.reverse() }}).then(res => {});
    })
}

function consoleMe(inputMe)
{
    console.log(inputMe);
}


export function playerData(connection, params)
{

    Status.count({}).then(res => 
        {
            if (res === 0) createEmpty();
            else 
            {
                getDayPlaylist(connection, params);
                setTimeout(getNightPlaylist, 2000, connection, params);
                setTimeout(getPreviousSongs, 4000, connection, params);
            }
        });
}


export function getData(connection, params, res)
{

    Status.count({}).then(respond => 
        {
            if (respond === 0) res.send('No Data! Server probably not started!');
            else 
            {
                Status.findOne({}).then(resp => { res.set('Content-Type', 'application/json').send(resp);  });
            }
        });
}

export function ConnectToDB() {

    mongoose.connect('mongodb://localhost/MawaruStation');
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
        console.log('MongoDB connection OK!!');
    });
}

