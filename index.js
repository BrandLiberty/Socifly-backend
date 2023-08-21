import express from 'express'
import cors from 'cors'
const PORT = 8000;
const app = express();

// CONNECTING TO THE DATABASE 
import db from './config/mongoose.js'

// Enabling Cors 
app.use(cors('*'))

// Configuring Parser 
app.use(express.json())
// app.use(express.urlencoded())


// Mapping Routes 
import routes from './routes/index.js'
app.use('/',routes)

app.listen(PORT , err =>{
  if(err){
    console.log('Error connecting to the server at Port' , PORT)
  }
  console.log('Successfully COnnected to the Server at Port' , PORT)
})
