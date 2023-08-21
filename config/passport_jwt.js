import passport from 'passport';
import  {JWTStrategy} from 'passport-jwt'
import {ExtractJWT} from 'passport-jwt'
import User from  "../models/User.js"

let opts = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'aman'
}

passport.use(new JWTStrategy(opts, async function (jwtPayload, done) {
    // try 
    //     {
    //         let user= await User.findById(jwtPayload._id);

    //         if(user){
    //             return done(null,user)
    //         }else{
    //             return done(null,false);
    //         }
    //     } 
    // catch (error) 
    //     {
    //         console.log('Error in JWT Strategy',error)
    //     }
    User.findById(jwtPayload._id)
        .then(user => {
            if (user) {
                return done(null, user)
            } else {
                return done(null, false);
            }
        })
        .catch(err => {
            console.log('Error finding user through JWT._id', err);
        })

}))


export default  passport
