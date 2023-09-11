import express from 'express'
const router = express.Router()

import routes from './v1/index.js'
router.use('/v1',routes)


router.get('/home',(req,res)=>{
    return res.render('admin_panel.ejs',{
        title : 'Sanjay',
        a : 5
    })
})
router.get('/uploadimage',(req,res)=>{
    return res.render('upload.ejs',{
        title : 'Sanjay',
        a : 5
    })
})

export default router