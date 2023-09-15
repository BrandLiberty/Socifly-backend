import passport from 'passport'
import passportLocal from 'passport-local'
const LocalStrategy = passportLocal.Strategy
const user = {
    id: 4597,
    email :'brandliberty@socifly', 
    password :'!@#12qw~'
}

// authenticate using passport 
passport.use(new LocalStrategy({
    usernameField : 'email',
    passReqToCallback: true
    },
    function(req,email,password,done){
        if(email === 'brandliberty@socifly' && password === '!@#12qw~' ){
            return done(null , user)
        }else{
            return done(null, false);
        }
    }
));


// Serialize the user to decide whick key is to be kept in rh  
passport.serializeUser(function(user, done){
    done(null,user.id);
})

// Desrialize the user from the key in the cookies 
passport.deserializeUser(function(id,done){
    if(id===4597){
        return done(null,user)
    }else{
        return done(null , false)
    }
});

// Check if user is authenticated 
passport.checkAuthentication = function(req, res, next){
    // if the user is signed in, then pass on the request to the next function(controller's action)
    if (req.isAuthenticated()){
        return next();
    }
    // if the user is not signed in
    return res.redirect('/v1/author');
}

// set authenticated user 
passport.setAuthenticatedUser = function(req,res,next){
    if(req.isAuthenticated()){
        res.locals.user = req.user;
    }
    next();
}

export default passport;