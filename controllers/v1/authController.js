import User from "../../models/User.js"
import jwt from 'jsonwebtoken'
import * as fs from 'fs'
import bcrypt from "bcrypt";
import crypto from 'crypto'
const saltRounds = 10;

import signupMailer from "../../mailers/auth/signup_mailer.js"
import updatedEmailMailer from "../../mailers/update/email_mailer.js";
import PendingUser from "../../models/PendingUser.js";

// SIGNIN 
export const createSession = async function(req,res){
    try {
        console.log('API : /v1/auth/create-session',req?.body)
        let user = await User.findOne({email : req.body.email});

        console.log('CHecking what the user is inside the creates session',user,bcrypt.compareSync(req?.body?.password, user?.hash));

        if(!user || !bcrypt.compareSync(req?.body?.password, user?.hash)){
            return res.status(422).json({
                message : 'Invalid email or password'
            });
        }

        if(user.verified===false || user.underUpdate===true){
            return res.status(400).json({
                message :'Authentication pending. Check your email for authentication link'
            })
        }

        return res.status(200).json({
            message : 'Sign In successful here is your token keep it safe',
            data :{
                token : jwt.sign(user.toJSON(),'aman',{expiresIn:'10000000'})
            }
        })

    } catch (err) {
        console.log('Error in the create Session module',err);
        res.send(err)
    } 
}

// SIGNUP 
export const signUp = async(req,res)=>{
    console.log('API : /v1/auth/signup')
    console.log('req.body',req?.body)

    const {email , password , confirm_password , name, phone} = req.body

    if(!email || !password || !confirm_password){
        console.log('MIssing information');
        return res.status(400).json({
            message : 'Insufficient Information',
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

    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);

    User.create({email , hash , name, phone })
    .then(async user => {
        let key = crypto.randomBytes(20).toString('hex');
        signupMailer(user,key)
        await PendingUser.create({
            user : user._id,
            hash : key
        })
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

// EDIT PROFILE 
export const editProfile = async (req,res)=>{
    console.log('API : /v1/auth/edit-profile',req.user)
    try {
        const user = req.user;
        await User.uploadAvatar(req,res,async function(err){
            if(err){
                console.log('LOG : Multer Error',err)
                return res.status(500).json({
                    message : 'Internal Server Error'
                })
            }
            const {email , name, phone , avatar} = req.body
            // console.log('API : /v1/auth/edit-profile',req?.body)

            // UPDATING EMAIL 
            if(user.email!==email){
                let key = crypto.randomBytes(20).toString('hex');
                user.underUpdate = true
                PendingUser.create({
                    user : user._id || user.id,
                    previousEmail : user.email,
                    updatedEmail : email,
                    hash : key
                })
                .then(pUser =>{
                    updatedEmailMailer(pUser , key)
                })
            }

            // Updating Name 
            if(user.name!==name){
                // console.log('LOG : Updating Name')
                user.name = name
            }
            
            // Updating Phone 
            if(user.phone!== phone){
                console.log('LOG : Phone nuber update pending')
            }
            
            // Updating Avatar 
            if(req.file){
                console.log('INFO : FILE INFO',req?.file)
                if(user.avatar){
                    fs.unlinkSync(user.avatar)
                }
                user.avatar = req.file.path
            }
            
            // await user.save()
            user = await User.findByIdAndUpdate(user._id || user.id , user)

        })
        return res.status(200).json({
            message : 'Profile Updated Successfully',
            data  : user
        })
    } catch (error) {
        
    }
}

export const updateEmail = async (req,res)=>{
    console.log('API : /v1/auth/update-email',req.query)
    try {
        const {email , hash} = req.query
        let pUser = await PendingUser.findOne({updatedEmail : email})
        let user = await User.findOne({email : pUser.previousEmail})
        if(!user){
            return res.status(404)
        }
        if(user && !pUser){
            return res.render('info.ejs',{
                title : 'Socifly',
                message : 'User already Updatedd'
            })
        }
        if(hash === pUser.hash){
            console.log('LOG : Hash Matched')
            await User.findByIdAndUpdate(user._id , {email : email ,underUpdate : false})
            PendingUser.findOneAndDelete({user : user._id || user.id})
            .then(user=>{
                return res.render('info.ejs',{
                    title : 'Socifly',
                    message : 'Email Updated Successfully'
                })
            })
            .catch(err=>{
                console.log('ERROR : ',err)
                return res.status(500).json({
                    message : 'Internal Server Error'
                })
            })
        }
        else{
            return res.status(404).json({
                message : 'Link Intercepted and is now invalid'
            })
        }
    } catch (error) {
        console.log('ERROR : ',error)
        return res.status(500).json({
            message : 'Internal Server Error'
        })
    }
}

export const verifyEmail = async (req,res)=>{
    console.log('API : /v1/auth/verify-email',req.query)
    try {
        const {email , hash} = req.query
    
        let user = await User.findOne({email})
        let pUser = await PendingUser.findOne({user : user._id || user.id})
        if(!user){
            return res.status(404)
        }

        if(user && !pUser){
            return res.render('info.ejs',{
                title : 'Socifly',
                message : 'User already Updatedd'
            })
        }
        
        if(hash === pUser.hash){
            console.log('LOG : Hash Matched')
            await User.findByIdAndUpdate(user._id , {verified : true})
            PendingUser.findOneAndDelete({user : user._id || user.id})
            .then(user=>{
                return res.render('info.ejs',{
                    title : 'Socifly',
                    message : 'Email Verified Successfully'
                })
            })
            .catch(err=>{
                return res.status(500).json({
                    message : 'Internal Server Error'
                })
            })
        }
        else{
            return res.status(404).json({
                message : 'Link Intercepted and is now invalid'
            })
        }
    } catch (error) {
        console.log('ERROR : Unable to verify User Email')
        return res.status(500).json({
            message : 'Internal Server Error'
        })
    }
}