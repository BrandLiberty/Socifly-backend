import mongoose from 'mongoose'

const languageSchema = new mongoose.Schema({
    lang: {
        type : String,
        required : true,
        unique : true,
        enum : ['english' , 'hindi', 'marathi' , 'wallpaper']
    },
    category : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Category"
        }
    ],
    images : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Images'
        }
    ],
    videoCategory : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'VideoCategory'
        }
    ],
    videos : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Videos'
        }
    ]
},{
    timestamps:true
})

const Language = mongoose.model('Language',languageSchema)

export default Language