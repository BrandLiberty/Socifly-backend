import User from "../../models/User.js"
import PendingUser from "../../models/PendingUser.js";
import OtpVerification from "../../models/OtpVerification.js";
import Images from '../../models/Images.js'
import Category from '../../models/Category.js'
import jwt from 'jsonwebtoken'
import * as fs from 'fs'
import bcrypt from "bcrypt";
import crypto from 'crypto';
import otplib from 'otplib'
const saltRounds = 10;
import path from 'path'
const __dirname = path.resolve(path.dirname(''));

import signupMailer from "../../mailers/auth/signup_mailer.js"
import updatedEmailMailer from "../../mailers/update/email_mailer.js";
import forgetPasswordMailer from "../../mailers/auth/forgetPassword_mailer.js";
import Activity from "../../models/activity.js";

// SIGNIN 
export const createSession = async function(req,res){
    try {
        console.log('API : /v1/auth/create-session',req?.body)
        let user = await User.findOne({email : req.body.email});

        console.log('CHecking what the user is inside the creates session',user);

        if(!user || !bcrypt.compareSync(req?.body?.password, user?.hash)){
            return res.status(400).json({
                message : 'Invalid email or password'
            });
        }

        if(user.verified===false || user.underUpdate===true){
            return res.status(400).json({
                message :'Authentication pending. Check your email for authentication link'
            })
        }

        let activity = await Activity.findOne({user : user._id})
        if(!activity){
            activity = await Activity.create({user : user._id})
        }
        activity.loginTime = new Date().getTime()
        activity.save()

        return res.status(200).json({
            message : `Welcome ${user.name}`,
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

    const {email , password , confirm_password , name, phone ,bday} = req.body

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

    let birth = new Date(bday)
    if(birth.getDate()===NaN){
        return res.status(400).json({
            message : 'Date Not Found'
        })
    }

    User.create({email , 
        hash , 
        name, 
        phone, 
        bday_day : birth.getDate(),
        bday_month : birth.getMonth(),
        bday_year : birth.getFullYear()
    })
    .then(async user => {
        let key = crypto.randomBytes(20).toString('hex');
        signupMailer(user,key)
        await Activity.create({user : user._id})
        await PendingUser.create({
            user : user._id,
            hash : key
        })
        console.log('User Created Successfully');
        return res.status(200).json({
            message : 'You are registered Succesully! Verify Your Email',
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
        let user = req.user;
        await User.uploadAvatar(req,res,async function(err){
            if(err){
                console.log('LOG : Multer Error',err)
                return res.status(500).json({
                    message : 'Internal Server Error'
                })
            }
            const {email , name, phone , avatar} = req.body
            console.log('API : /v1/auth/edit-profile',req?.body)

            // UPDATING EMAIL 
            if(user.email!==email && email!== undefined){
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
                user.phone  = phone
            }
            
            // Updating Avatar 
            if(req.file){
                console.log('INFO : FILE INFO',req?.file)
                if(user.avatar){
                    fs.unlinkSync(path.join(__dirname , user.avatar))
                }
                user.avatar = User.avatarPath + '/' + req.file.filename
            }
            
            // await user.save()
            user = await User.findByIdAndUpdate(user._id || user.id , user)

            return res.status(200).json({
                message : 'Profile Updated Successfully',
                data  : user
            })
        })
    } catch (error) {
        
    }
}

// Update Email 
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

// Verify Email 
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

// Reset Password : Send OTP
export const resetPassword = async (req,res)=>{
    console.log('API : /v1/auth/reset-password',req.query)
    try {
        let user = await User.findOne({email: req.query.email})

        if(!user || user.verified===false){
            return res.status(400).json({
                message : 'No Such User Exists!'
            })
        }
        let secretKey = user.hash
        let otp = otplib.authenticator.generate(secretKey);
        console.log('LOG : OTP generated is ',otp)

        let confirmUser = await OtpVerification.findOne({user : user._id})

        if(confirmUser){
           await OtpVerification.findByIdAndDelete(confirmUser._id)
        }

        OtpVerification.create({
            user : user._id,
            otp,
            sendingTime : new Date().getTime(),
            hash : user.hash
        })
        .then(user_for_otp_request =>{
            console.log(`LOG : ${user.email} has requested to reset the otp`)
            // forgetPasswordMailer(user , otp)
            return res.status(200).json({
                message : 'Reset Password',
                userId : user._id
            })
        })
        .catch(err=>{
            console.log('ERROR : Raised from Reset Password',err)
        })
    } catch (error) {
        if(error){
            console.log('ERROR : Internal Server Error',error)
        }
        return res.status(200).json({
            message: 'Internal Server Error'
        })
    }
} 

// Verify Reset Password OTp 
export const verifyResetPasswordOtp = async (req,res)=>{
    console.log('API : /v1/auth/verify-reset-password',req.body,req.params)

    if(!req.body.otp){
        return res.status(400).json({
            message : 'Enter the Otp'
        })
    }
    
    try {
        let user = await OtpVerification.findOne({user : req.params.id})
    
        console.log('LOG : OTP VERIFICATION USR ',user)

        if(!user){
            return res.status(400).json({
                message : 'No Reset Password Request Found'
            })
        }
    
        if(Number(req.body.otp) !== user.otp){
            return res.status(409).json({
                message : 'Invalid OTP'
            })
        }
    
        if(user.sendingTime + 1000*60*2 <= new Date().getTime()){
            await OtpVerification.findByIdAndDelete(user._id)
            return res.status(408).json({
                message: 'Time Limit Exceeded'
            })
        }
        user.otpverified = true
        await user.save()

        return res.status(200).json({
            message : 'Enter New Password',
            userId : user.user
        })
    } catch (error) {
        console.log('ERROR : Raised from Verify OTP ',error)
        return res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}

// Update password after verification 
export const newPassword = async (req, res)=>{
    console.log('API : /v1/auth/confirm-new-password',req.body,req.params)
    try {

        if(!req.body.password && !req.body.confirm_password){
            return res.status(400).json({
                message : "Enter password and confirm it"
            })
        }

        let user = await OtpVerification.findOne({user : req.params.id})

        if(!user){
            return res.status(400).json({
                message : 'Invalid Password Reset Request'
            })
        }

        if(user.sendingTime + 1000*60*2 <= new Date().getTime()){
            await OtpVerification.findByIdAndDelete(user._id)
            return res.status(408).json({
                message: 'Time Limit Exceeded'
            })
        }

        if(req.body.password !== req.body.confirm_password){
            return res.status(409).json({
                message : 'Passwords do not match'
            })
        }

        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(req.body.password, salt);

        await User.findByIdAndUpdate(req.params.id,{hash : hash})

        await OtpVerification.findByIdAndDelete(user._id)

        return res.status(200).json({
            message : 'Password reset successfully'
        })

    } catch (error) {
        console.log('ERROR : Raised from new Password request')
    }
}

export const handleLike = async(req,res)=>{
    console.log('CAlled handle Likes',req.query , req.user)

    try {
        const {id} = req.query
        const {user}= req

        if(!id || !user){
            return res.status(400).json({
                message : 'Incomplete Request'
            })
        }

        let image = await Images.findById(id)
        let category = await Category.findById(image.category)

        if(image.likes.indexOf(user._id)===-1){
            image = await Images.findByIdAndUpdate(image._id , {
                $push : {
                    likes : user._id
                }
            },{new :true})

            category = await Category.findByIdAndUpdate(category._id , {
                $push : {
                    likes : user._id
                }
            },{new :true})

            await User.findByIdAndUpdate(user._id , {
                $push : {
                    likes : image._id
                }
            },{new :true})
    
        }else{
            image = await Images.findByIdAndUpdate(image._id , {
                $pull : {
                    likes : user._id
                }
            },{new :true})

            category = await Category.findByIdAndUpdate(category._id , {
                $pull : {
                    likes : user._id
                }
            },{new :true})
            await User.findByIdAndUpdate(user._id , {
                $pull : {
                    likes : image._id
                }
            },{new :true})
        }

        return res.status(200).json({
            message : 'Likes Updated',
            data : {
                image : image.likes.length,
                category : category.likes.length
            }
        })

    } catch (error) {
        console.log('Error in likes',error)
        return res.status(500).json({
            message : 'Internal Server Error'
        })
    }
}