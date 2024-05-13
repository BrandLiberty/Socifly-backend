import express from 'express'
import passport from 'passport'
const router = express.Router()

import{
    home,
    signIn,
    signOut,
    uploads,
    manageUser,
    manageAdmin,
    userController,
    uploadVideo
}from '../../../controllers/v1/authorController.js'

import action from './action.js'

router.get('/',home)

router.post('/signin',passport.authenticate(
    'local',
    { failureRedirect: '/v1/author' })
    ,signIn
)
router.get('/signout',signOut)
router.post('/manage-user',passport.checkAuthentication,manageUser)
router.get('/manage-user',passport.checkAuthentication,manageUser)
router.get('/manage-admin',passport.checkAuthentication,manageAdmin)
router.get('/upload', passport.checkAuthentication,uploads)
router.get('/upload-video', passport.checkAuthentication,uploadVideo)
router.get('/manage-admin/user-controller/:id', userController)
router.use('/action',passport.checkAuthentication,action)

export default router