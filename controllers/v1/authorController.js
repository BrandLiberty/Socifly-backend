// admin panel controller ::: Server SIde Rendering 
import Category from '../../models/Category.js'
import Images from '../../models/Images.js'
import Language from '../../models/Language.js'

import User from '../../models/User.js'
import Activity from '../../models/activity.js'

import VideoCategory from '../../models/VideoCategory.js'
import Videos from '../../models/Videos.js'
import fs from 'node:fs'
import path from 'path'
const __dirname = path.resolve(path.dirname(''));



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

export const uploadVideo = async (req,res)=>{
    try{
        let categories = await VideoCategory.find({}).lean()
        console.log("LOG : rendering Category",categories)
        return res.render('upload_videos.ejs',{
            title: 'Socifly : Uploads Videos',
            categories
        })
    }catch(err){
        console.log('ERROR Rendering VIdeos',err)
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
        const {category , lang , special }  = req.body
        let spcl
        if(special==='on'){
            spcl = true
        }else{spcl = false}

        if(!category || !lang){
            return res.redirect('/v1/author/upload')
        }

        let cat = await Category.findOne({type : category})
        
        if(cat){
            cat.special = spcl
            cat.save()
            return res.redirect('/v1/author/upload')
        }

        
        cat = await Category.create({
            type : category,
            lang,
            special : spcl
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

export const createVideoCategory = async(req,res)=>{
    console.log('LOG : /v1/author/action/create-video-category',req.body)
    try {
        const {category , lang , special }  = req.body
        let spcl
        if(special==='on'){
            spcl = true
        }else{spcl = false}

        if(!category || !lang){
            console.log('HUHUHU')

            return res.redirect('/v1/author/upload-video')
        }

        let cat = await VideoCategory.findOne({type : category})
        
        if(cat){
            console.log('HUHUHU',cat)
            cat.special = spcl
            cat.save()
            // return res.redirect('/v1/author/upload-video')
        }

        
        cat = await VideoCategory.create({
            type : category,
            lang,
            special : spcl
        })
        console.log('HUHUHU')

        let langu = await Language.findOne({lang : lang})
            if(!langu){
                langu = await Language.create({lang : lang})
            }
            console.log('HUHUHU')
            langu.videoCategory.push(cat._id)
            langu.save()
        
        return res.redirect('/v1/author/upload-video')
    } catch (error) {
        console.log('ERROR CRETING UPLOAD VIDEO CATEGORY',error)
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
export const uploadVideos = (req,res)=>{
    console.log('LOG  : /v1/author/action/upload-videos')
    try {
        Videos.uploadVideo(req,res,async function(err){
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

            let cat = await VideoCategory.findOne({type : category})
            let langu = await Language.findOne({lang : lang})


            console.log('langu',langu)

            if(req.files.length > 0){
                for(let file of req.files){
                    Videos.create({
                        lang : lang,
                        category : cat._id,
                        path : Videos.videoPath + '/' + file.filename
                    })
                    .then(async image=>{
                        // cat.images.push(image._id)
                        await VideoCategory.findByIdAndUpdate(cat._id , {
                            $push : {
                                images : image._id
                            }
                        })
                        await Language.findByIdAndUpdate(langu._id , {
                            $push : {
                                videos : image._id,
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

export const manageImages = async (req,res)=>{
    console.log('Manage Images Called by', req.query)
    const {Lindex , C_id} = req.query
    if(Lindex || C_id){
        let data = await Language.find({}).populate({path: 'category', populate : {path : 'images'}}).populate('images')
        console.log('Data to sent is ',{data})
        return res.render('manage_images',{
            title : 'Images',
            data : data,
            C_id  : C_id || '',
            Lindex : Lindex,
            lang : 'english'
        })

    }  
        let data = await Language.find({}).populate({path: 'category', populate : {path : 'images'}}).populate('images')
        console.log('Data to sent is ',{data})
        return res.render('manage_images',{
            title : 'Images',
            data : data,
            C_id  : '',
            Lindex : 0,
            lang : 'english'
        })
}
export const manageVideos = async (req,res)=>{
    console.log('Manage VIdeos Called by', req.query)
    const {Lindex , C_id} = req.query
    if(Lindex || C_id){
        let data = await Language.find({}).populate({path: 'videoCategory', populate : {path : 'images'}}).populate('videos')
        console.log('Data to sent is ',{data})
        return res.render('manage_videos',{
            title : 'Images',
            data : data,
            C_id  : C_id || '',
            Lindex : Lindex,
            lang : 'english'
        })

    }  
    let data = await Language.find({}).populate({path: 'videoCategory', populate : {path : 'images'}}).populate('videos')
        console.log('Data to sent is ',{data})
        return res.render('manage_videos',{
            title : 'Images',
            data : data,
            C_id  : '',
            Lindex : 0,
            lang : 'english'
        })
}
export const deleteImage = async(req,res)=>{
    console.log('Delete Image By Id',req.query)
    const {id} = req.query
    if(!id){
        console.log('id not found')
        return res.redirect('back')
    }

    let image = await Images.findById(id)

    if(!image){
        console.log('Image not found')
        res.redirect('/v1/author/action/manage-images')
    }

    Category.findByIdAndUpdate(image.category,{
        $pull : {images : image._id}
    },{ new: true }).then(data=>{
        console.log('Image Removed from Category', data)
    }).catch(err=>console.log('Unable to remove image drom Category',err))

    Language.findOneAndUpdate({lang : image.lang},{
        $pull : {images : image._id}
    },{new : true}).then(data=>{
        console.log('Image Removed from Languages', data)
    }).catch(err=>console.log('Unable to remove image drom Language',err))

    if(image.path){
        fs.unlinkSync(path.join(__dirname , image.path))
    }
    Images.findByIdAndDelete(id).then(data=>{
        console.log('Image Removed from Images', data)
        return res.redirect('/v1/author/action/manage-images')
    }).catch(err=>console.log('Unable to remove image drom Images',err))



}
export const deleteVideo = async(req,res)=>{
    console.log('Delete Image By Id',req.query)
    const {id} = req.query
    if(!id){
        console.log('id not found')
        return res.redirect('back')
    }

    let video = await Videos.findById(id)

    if(!video){
        console.log('Image not found')
        res.redirect('/v1/author/action/manage-videos')
    }

    VideoCategory.findByIdAndUpdate(video.category,{
        $pull : {images : video._id}
    },{ new: true }).then(data=>{
        console.log('Image Removed from Category', data)
    }).catch(err=>console.log('Unable to remove video drom Category',err))

    Language.findOneAndUpdate({lang : video.lang},{
        $pull : {videos : video._id}
    },{new : true}).then(data=>{
        console.log('Image Removed from Languages', data)
    }).catch(err=>console.log('Unable to remove video drom Language',err))

    if(video.path){
        fs.unlinkSync(path.join(__dirname , video.path))
    }
    Images.findByIdAndDelete(id).then(data=>{
        console.log('Image Removed from Images', data)
        return res.redirect('/v1/author/action/manage-videos')
    }).catch(err=>console.log('Unable to remove video drom Images',err))



}
