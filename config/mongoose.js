import mongoose from 'mongoose'
//import config  from '../config.json' assert { type: "json" };

let dbUrl = "mongodb+srv://brand_liberty_web:brandliberty1010@cluster0.wqfp3cw.mongodb.net/Socifly"
let local ='mongodb://127.0.0.1/socifly_db'
mongoose.connect(local);

const db = mongoose.connection;

db.on('error',console.error.bind(console,'Erroe connecting MOngoDB'));

db.once('open',function(){
    console.log("connected to the database"); 
})

export default db
