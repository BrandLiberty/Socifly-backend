import express from "express"
const router = express.Router();

import {
    createSession , 
    signUp , 
    editProfile , 
    updateEmail ,
    verifyEmail ,
    resetPassword,
    verifyResetPasswordOtp,
    newPassword,
    handleLike
} from "../../../controllers/v1/authController.js"
import passport from "passport";

// Sign Up 
router.post('/signup',signUp)

// Sign IN 
router.post('/create-session',createSession)

// Edit Profile 
router.post('/edit-profile',passport.authenticate('jwt',{session : false}),editProfile)

// Like
router.get('/like-image',passport.authenticate('jwt',{session : false}),handleLike)

// Update Email 
router.get('/update-email',updateEmail)
// Verify Email 
router.get('/verify-email',verifyEmail)
// Reset Password 
router.get('/reset-password',resetPassword)
// Verify Reset Password OTP
router.post('/verify-reset-password-otp/:id',verifyResetPasswordOtp)
router.post('/confirm-new-password/:id',newPassword)


export default router