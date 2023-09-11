import express from 'express'
import passport from 'passport'
import { getProfileInfo } from '../../../controllers/v1/profileController.js'
const router = express.Router()

// Get logged in User Info 
router.get('/get-info',passport.authenticate('jwt',{session : false}),getProfileInfo)

export default router