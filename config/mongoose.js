import mongoose from 'mongoose'
import config  from '../config.json' assert { type: "json" };

mongoose.connect(config.MONGO_URL);

const db = mongoose.connection;

db.on('error',console.error.bind(console,'Erroe connecting MOngoDB'));

db.once('open',function(){
    console.log("connected to the database"); 
})

export default db