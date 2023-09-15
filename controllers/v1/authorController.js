import Category from '../../models/Category.js'
import Images from '../../models/Images.js'



export const home = (req,res)=>{
    try {
        return res.render('home',{
            title: 'Socifly : Admin'
        })
    } catch (error) {
        
    }
}

export const uploads = (req,res)=>{
    try {

        let categories = Category.find({})


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
    console.log('LOG : /v1/author/action/create-category')
    try {
        const {category}  = req.body

        let cat = Category.findOne({type : category})

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

export const getCategory = async (req,res)=>{
    console.log('LOG : get Category')
    try {
        let category = await Category.find({}).select('type')
        console.log
    } catch (error) {
        
    }
}