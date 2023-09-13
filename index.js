import express from 'express'
import cors from 'cors'
import path from 'path'
import passport from 'passport';
import jwtStrategy from './config/passport_jwt.js'
const __dirname = path.resolve(path.dirname(''));
const PORT = process.env.PORT || 8000;
const app = express();

// CONNECTING TO THE DATABASE 
import db from './config/mongoose.js'

// Enabling Cors 
app.use(cors('*'))

// CONFIGURING LAYOUTS 
import expressLayouts from 'express-ejs-layouts'
app.use(expressLayouts);

// CONFIGURING VIEW ENGINE 
app.set('view engine','ejs');
app.set('views',['./views','./views/info','./views/auth']);

// MANAGING STYLES AND SCRIPTS FROM VARIOUS VIEWS FOLLOWING LAYOUTS 
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);

// DISABLING GLOBAL LAYOUTS 
app.set('view options', { layout: true });

// CONFIGURING PATH TO STATIC FILES 
app.use(express.static('./assets'));

// Configuring Parser 
app.use(express.json())
app.use(express.urlencoded())

// MAKE AVAILABLE UPLOADS OF THE USER 
app.use('/uploads',express.static(__dirname + '/uploads'))

app.use(passport.initialize());

// Mapping Routes 
import routes from './routes/index.js'
app.use('/',routes)

app.listen(PORT , err =>{
  if(err){
    console.log('Error connecting to the server at Port' , PORT)
  }
  console.log('Successfully COnnected to the Server at Port' , PORT)
})
