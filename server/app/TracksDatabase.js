import mongoose from'mongoose';
mongoose.Promise = global.Promise;
var db = mongoose.connection;
const Schema = mongoose.Schema;


const collections = ['music', 'jin', 'night']

const Track = new Schema({
    path        : { type: String,  required: true },
    playCount   : {type : Number, required : true},
    rating      : {type: Number, required : true}
});

const daytracks = mongoose.model('daytracks', Track);
const NightMusic = mongoose.model('NightMusic', Track);
const Jingles = mongoose.model('Jingles', Track);




function RecordTracks(array){

    console.log('here' + array[0])
    for (var i = 0; i < array.length; i++){
        console.log(array[i]);
        if (array[i]){
            const newTrack = new daytracks({
                path:array[i], 
                playCount: 0,
                rating: 0
            })
            newTrack.save();
        }
    }

}

export function GenerateDB(array) {

    mongoose.connection.db.listCollections({name: 'daytracks'})
    .next(function(err, collinfo) {
        if (collinfo) {
            console.log('drop');
        }

        else {
            RecordTracks(array);
        }
    });

    return ('done');
}



export function GetTracksList(){
    return daytracks.find({});
}


