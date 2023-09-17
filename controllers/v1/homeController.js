import Category from '../../models/Category.js'
import Images from '../../models/Images.js'

export const getCategory = async (req,res)=>{
    console.log('LOG : get Category')
    try {
        let category = await Category.find({}).select('type')
        console.log('Category FOund',category)
        return res.status(200).json({
            message : 'Category Types',
            data : category
        })
    } catch (error) {
        return res.status(500).json({
            message : "Internal Server Error"
        })
    }
}

export const getImages = async (req,res)=>{
    console.log('LOG : GET IMAGES')
    try {
        let images = await Images.find({}).select('path').sort({'createdAt'  : -1})
        console.log('images',images)
        return res.status(200).json({
            message : 'Images',
            data : images
        })
    } catch (error) {
        return res.status(500).json({
            message : "Internal Server Error"
        })
    }
}

export const getImagesByCategory = async(req,res)=>{
    console.log("LOG : GET IMAGES BY CATEGORY",req.query.category )
    try {
        const {category}= req.query 
        let cat = await Category.findOne({type : category})
        if(!cat){
            return res.status(400).json({
                message : 'No Such Category'
            })
        }
        console.log(cat)
        if(cat.images.length===0){
            return res.status(300).json({
                message  : 'No Images In this Category'
            })
        }
        let images= []

        for(let id of cat.images){
            let image = await Images.findById(id).select('path').sort({createdAt : -1})
            images.push(image)
        }
        return res.status(200).json({
            message : `${cat.type} category images`,
            data : images
        })
    } catch (error) {
        console.log('ERROR : get-images-by-category',error)
        return res.status(500).json({
            message  : 'Internal Server Error'
        })
    }
}
