import express from 'express'
import passport from 'passport'
const router = express.Router()

import{
    home,
    signIn,
    signOut,
    uploads,
    manageUser,
    manageAdmin
}from '../../../controllers/v1/authorController.js'

router.get('/',home)

router.post('/signin',passport.authenticate(
    'local',
    { failureRedirect: '/v1/author' })
    ,signIn
)
router.get('/signout',signOut)
router.get('/manage-user',passport.checkAuthentication,manageUser)
router.get('/manage-admin',passport.checkAuthentication,manageAdmin)
router.get('/upload', passport.checkAuthentication,uploads)

export default router