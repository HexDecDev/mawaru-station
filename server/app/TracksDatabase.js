import mongoose from'mongoose';
mongoose.Promise = global.Promise;
var db = mongoose.connection;
const Schema = mongoose.Schema;


const collections = ['music', 'jin', 'night']

const Track = new Schema({
    path     : { type: String,  required: true },
    playCount : {type : Number, required : true},
    tags: {type: [String], required : true},
    rating: {type: Number}
});

const DayMusic = mongoose.model('DayMusic', Track);
const NightMusic = mongoose.model('NightMusic', Track);
const Jingles = mongoose.model('Jingles', Track);


