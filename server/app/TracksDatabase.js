import mongoose from'mongoose';
mongoose.Promise = global.Promise;
var db = mongoose.connection;
const Schema = mongoose.Schema;



const Track = new Schema({
    path        : { type: String,  required: true },
    playCount   : {type : Number, required : true},
    rating      : {type: Number, required : true}
});

const daytracks = mongoose.model('daytracks', Track);
const nighttracks = mongoose.model('nighttracks', Track);
const jingles = mongoose.model('jingles', Track);


//Можно универсальнее, с конфигами и прочими плюшками.
//Но с другой стороны это все такой узкоспецилизированный софт, что кому оно кроме меня надо?
//Возможно, когда у меня кончатся идеи для новых фич, я и причешу этот код и сделаю его универсальным.
//В итоге кончено круто было бы сделать из этого в итоге свой аналог эйртайма. Но пока не нужно.

function CollectionsWrapper(folder){
    var returnCollection = 'none';

    switch (folder){
        case 'music':
            returnCollection = daytracks;
        break;

        case 'night':
            returnCollection = nighttracks;
        break;

        case 'jin':
            returnCollection = jingles;
        break;

        default:
            returnCollection = jingles;
        break;

    }


    return returnCollection;
}

function RecordTracks(array, collection){

    for (var i = 0; i < array.length; i++){
        
        if (array[i]){
            console.log(`Adding ${array[i]}`);
            const newTrack = new collection({
                path:array[i], 
                playCount: 0,
                rating: 0
            })
            newTrack.save();
        }
    }

}

function CheckAndAdd(path, collection){

    collection.find({path: path}).then( (data) => {
        if(!data.length) {
            console.log(`New track found ${path}`);
            const newTrack = new collection({
                path:path, 
                playCount: 0,
                rating: 0
            })
            newTrack.save();
        }
    })
}

function RemoveTrackFromBase(id, collection){
    console.log(`File not found. Removing ${id} entry from base`)
    collection.remove({ _id: id }).then( data => console.log(data));
}

function UpdateTracks(arrayOfFiles, collection){
    //Check new tracks in folder
    for (var iter = 0; iter < arrayOfFiles.length; iter++){
        
        if (arrayOfFiles[iter]){
            CheckAndAdd(arrayOfFiles[iter], collection);
        }
    }

    //Check removed files
    collection.count({}).then( (data) => {
        for (var i = 0; i < data; i++){
            collection.findOne({}).skip(i).limit(1).then( (newData) => {
                if (arrayOfFiles.indexOf(newData.path) === -1)
                    RemoveTrackFromBase(newData._id, collection)
            })
        }
     })
    

}

export function GenerateDB(folder, array) {

    var collection = CollectionsWrapper(folder);
    mongoose.connection.db.listCollections({name: collection.modelName})
    .next(function(err, collinfo) {
        if (collinfo) {
            UpdateTracks(array, collection);
        }

        else {
            RecordTracks(array, collection);
        }
    });

    return ('done');
}



export function GetTracksList(folder){
    var collection = CollectionsWrapper(folder);
    return collection.find({});
}


