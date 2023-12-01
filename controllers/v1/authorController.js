// admin panel controller ::: Server SIde Rendering 
import Category from '../../models/Category.js'
import Images from '../../models/Images.js'
import Language from '../../models/Language.js'

import User from '../../models/User.js'
import Activity from '../../models/activity.js'



export const home = (req,res)=>{
    try {
        return res.render('home',{
            title: 'Socifly : Admin',
        })
    } catch (error) {
        
    }
}

export const uploads = async(req,res)=>{
    try {

        let categories = await Category.find({}).lean()
        console.log("LOG : rendering Category",categories)
        return res.render('upload',{
            title: 'Socifly : Uploads',
            categories
        })
    } catch (error) {
        
    }
}

export const manageUser = async(req,res)=>{
    try {
        console.log('Nakli coder',User)
        const {email} = req.body
        if(email){
            let user = await User.find({email: email}).sort({name : 1})
            return res.render('manage_user',{
                title: 'Socifly : Users',
                user
            })
        }
        const {phone} = req.body
        if(phone){
            let user = await User.find({phone: phone}).sort({name : 1})
            return res.render('manage_user',{
                title: 'Socifly : Users',
                user
            })
        }        
        const {name} = req.body
        if(name){
            let user = await User.find({name: name}).sort({name : 1})
            return res.render('manage_user',{
                title: 'Socifly : Users',
                user
            })
        }        
        const {tbc} = req.query
        if(tbc){
            let date = new Date()
            let user = await User.find({
                bday_day : date.getDate(),
                bday_month : date.getMonth()
            }).sort({name : 1})
            return res.render('manage_user',{
                title: 'Socifly : Users',
                user
            })
        }        
        let user = await User.find({}).sort({name : 1})
        return res.render('manage_user',{
            title: 'Socifly : Users',
            user
        })
    } catch (error) {
        
    }
}

export const manageAdmin = (req,res)=>{
    try {
        return res.render('manage_admin',{
            title: 'Socifly : Admin'
        })
    } catch (error) {
        
    }
}

export const signIn = (req,res)=>{
    console.log('API : /author/sign-in',req.body)
    try {
        const {email , password} = req.body
        if(email === 'brandliberty@socifly' && password === '!@#12qw~' ){
            return res.redirect('/v1/author/upload')
        }else{
            return res.redirect('back')
        }
    } catch (error) {
        
    }
}

export const signOut = function(req,res){
    req.logout(function(err) {
        if (err) { return next(err); }
        return res.redirect('/v1/author');
      });
}

export const userController = async function(req, res){
    try {
        console.log('In USER CONtroller')
        const {id} = req.params
        // const ided = req.params.id
        let user = await User.findById(id)
        console.log('In MANAGE USER',user)
        let activity = await Activity.findOne({user : id})
        console.log(activity)
        return res.render('profile.ejs',{
            title: 'Socifly:ManageUser',
            user,
            activity
        } )
    } catch (error) {
        console.log('Error in User Controller ',error)
        return res.redirect('back')
    }
}

export const createCategory = async(req,res)=>{
    console.log('LOG : /v1/author/action/create-category',req.body)
    try {
        const {category , lang }  = req.body

        if(!category || !lang){
            return res.redirect('/v1/author/upload')
        }

        let cat = await Category.findOne({type : category})
        
        if(cat){
            return res.redirect('/v1/author/upload')
        }

        
        cat = await Category.create({
            type : category,
            lang
        })
        let langu = await Language.findOne({lang : lang})
            if(!langu){
                langu = await Language.create({lang : lang})
            }
            langu.category.push(cat._id)
            langu.save()
        
        return res.redirect('/v1/author/upload')
    } catch (error) {
        
    }
}

export const uploadImages = (req,res)=>{
    console.log('LOG  : /v1/author/action/upload-images')
    try {
        Images.uploadImage(req,res,async function(err){
            if(err){
                console.log('ERROR: MULTER ERROR',err)
            }
            console.log('***',req.body)
            console.log('***',req.files)

            const {category , lang} = req.body

            if(!category || !lang){
                console.log('cat , lang not found')
                return res.redirect('back')
            }

            let cat = await Category.findOne({type : category})
            let langu = await Language.findOne({lang : lang})


            console.log('langu',langu)

            if(req.files.length > 0){
                for(let file of req.files){
                    Images.create({
                        lang : lang,
                        category : cat._id,
                        path : Images.imagePath + '/' + file.filename
                    })
                    .then(async image=>{
                        // cat.images.push(image._id)
                        await Category.findByIdAndUpdate(cat._id , {
                            $push : {
                                images : image._id
                            }
                        })
                        await Language.findByIdAndUpdate(langu._id , {
                            $push : {
                                images : image._id,
                            }
                        })
                    })
                    .catch(err=>{
                        console.log('ERROR : Raised From IMage Create',err)
                    })
                }
                // cat.save()
            }


            return res.redirect('back')
        })
    } catch (error) {
        
    }
}
