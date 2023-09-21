import mongoose from 'mongoose'
//import config  from '../config.json' assert { type: "json" };

mongoose.connect("mongodb+srv://brand_liberty_web:brandliberty1010@cluster0.wqfp3cw.mongodb.net/Socifly");

const db = mongoose.connection;

db.on('error',console.error.bind(console,'Erroe connecting MOngoDB'));

db.once('open',function(){
    console.log("connected to the database"); 
})

export default db
