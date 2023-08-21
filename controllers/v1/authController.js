
import User from "../../models/User.js"
import jwt from 'jsonwebtoken'
import sign from "../../mailers/auth/signup_mailer.js"

export const createSession = async function(req,res){
    try {
        let user = await User.findOne({email : req.body.email});

        console.log('CHecking what the user is inside the creates session',user);

        if(!user || user.password != req.body.password){
            return res.status(422).json({
                message : 'Invalid email or password'
            });
        }
        return res.status(200).json({
            message : 'Sign In successful here is your token keep it safe',
            data :{
                token : jwt.sign(user.toJSON(),'aman',{expiresIn:'100000'})
            }
        })

    } catch (err) {
        console.log('Error in the create Session module',err?.response);
        res.send(err)
    } 
}

export const signUp = async(req,res)=>{
    console.log('In the SIgnup MOdule',req.body);

    // let body  = JSON.parse(req?.body)

    // console.log('Parsed Data is',body)

    const {email , password , confirm_password , name, phone} = req.body

    if(!email || !password || !confirm_password){
        console.log('MIssing information');
        return res.status(400).json({
            message : 'Insufficient INformation',
        })
    }

    if(password !== confirm_password){
        console.log('Passwords do not match');
        return res.status(400).json({
            message : "Passwords Didn't match"
        })
    }

    let user = await User.findOne({email : email})
    console.log('User Found before creating the schema is',user)

    if(user){
        console.log('User already Exists');
        return res.status(200).json({
            message: 'User Already Exists'
        })
    }

    User.create({email , password , name, phone})
    .then(user => {
        sign(user)
        console.log('User Created Successfully');
        return res.status(200).json({
            message : 'User Created Succesully',
            data : user
        })
    })
    .catch(err =>{
        if(err){
            console.log('Error in creating the User SIgn up',err);
            return res.status(500).json({
                message : 'Internal Server Error',
            })
        }
    })
}
