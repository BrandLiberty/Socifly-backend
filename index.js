import config  from './config.json' assert { type: "json" };

import express from 'express'
import cors from 'cors'
import path from 'path'
import passport from 'passport';
import jwtStrategy from './config/passport_jwt.js'
import passportLocal from './config/passport-local-strategy.js'
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
app.set('views',['./views','./views/info','./views/auth','./views/admin_panel',]);

// MANAGING STYLES AND SCRIPTS FROM VARIOUS VIEWS FOLLOWING LAYOUTS 
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);

// DISABLING GLOBAL LAYOUTS 
app.set('view options', { layout: true });

// CONFIGURING PATH TO STATIC FILES 
app.use(express.static('./assets'));

// Configuring Parser 
// import multer from 'multer'
// const upload = multer()
// app.use('/auth/edit-profile',upload.any())
app.use(express.json())
app.use(express.urlencoded())

// MAKE AVAILABLE UPLOADS OF THE USER 
app.use('/uploads',express.static(__dirname + '/uploads'))

import session from 'express-session'

import MongoStore from 'connect-mongo'
app.use('/v1/author',session({
    name : 'Socifly',
    secret : "4597",
    saveUninitialized : false,
    resave:false,
    cookie:{
        maxAge:(1000*60*100)
    },
    store : new MongoStore(
        {
                mongoUrl : config.MONGO_URL
        },
        {
            mongooseConnection : db,
            autoRemove : 'disabled'
        },
        function(err){
            console.log(err || 'connect-mongo setup ok!!')
        }
    )
}));

app.use(passport.initialize());
app.use('/v1/author',passport.session());
app.use('/v1/author',passport.setAuthenticatedUser);

// Mapping Routes 
import routes from './routes/index.js'
app.use('/',routes)

app.listen(PORT , err =>{
  if(err){
    console.log('Error connecting to the server at Port' , PORT)
  }
  console.log('Successfully COnnected to the Server at Port' , PORT)
})
