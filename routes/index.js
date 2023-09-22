import express from 'express'
const router = express.Router()

import routes from './v1/index.js'
router.use('/v1',routes)

 router.get('/',(req,res)=>{
      res.send("server start")
 })

// router.get('/v1/upload',(req,res)=>{
//     return res.render('upload.ejs',{
//             title: 'Socifly:Upload',
    
//     })
// })
// router.get('/v1/manage_user',(req,res)=>{
//     return res.render('manage_user.ejs',{
//             title: 'Socifly:Manage User',
    
//     })
// })
// router.get('/v1/manage_admin',(req,res)=>{
//     return res.render('manage_admin.ejs',{
//             title: 'Socifly:Manage Admin',
    
//     })
// })
// router.get('/v1/profile',(req,res)=>{
//     return res.render('profile.ejs',{
//             title: 'Socifly:Profile',
    
    
//     })
// })

export default router
