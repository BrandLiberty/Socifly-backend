import Category from '../../models/Category.js'
import Images from '../../models/Images.js'



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

export const manageUser = (req,res)=>{
    try {
        return res.render('manage_user',{
            title: 'Socifly : Users'
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

export const createCategory = async(req,res)=>{
    console.log('LOG : /v1/author/action/create-category',req.body)
    try {
        const {category}  = req.body

        let cat = await Category.findOne({type : category})

        if(cat){
            return res.redirect('/v1/author/upload')
        }

        cat = await Category.create({
            type : category
        })

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

            const {category} = req.body

            let cat = await Category.findOne({type : category})

            if(req.files.length > 0){
                for(let file of req.files){
                    Images.create({
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
