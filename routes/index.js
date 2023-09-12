import express from 'express'
const router = express.Router()

import routes from './v1/index.js'
router.use('/v1',routes)

router.get('/v1/home',(req,res)=>{
    return res.render('home.ejs',{
            title: 'Socifly',
    
    })
})
router.get('/v1/upload',(req,res)=>{
    return res.render('upload.ejs',{
            title: 'Socifly',
    
    })
})

export default router