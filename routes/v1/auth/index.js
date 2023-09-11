import express from "express"
const router = express.Router();

import {
    createSession , 
    signUp , 
    editProfile , 
    updateEmail ,
    verifyEmail ,
    resetPassword
} from "../../../controllers/v1/authController.js"
import passport from "passport";

// Sign Up 
router.post('/signup',signUp)

// Sign IN 
router.post('/create-session',createSession)

// Edit Profile 
router.post('/edit-profile',passport.authenticate('jwt',{session : false}),editProfile)

// Update Email 
router.get('/update-email',updateEmail)
// Verify Email 
router.get('/verify-email',verifyEmail)
// Reset Password 
router.get('/reset-password',resetPassword)


export default router