import mongoose from 'mongoose'

const categorySchema = new mongoose.Schema({
    lang : {
        type : String,
        required : true,
        enum : ['english' , 'hindi' , 'marathi' ,'wallpaper']
    },
    special : {
        type : Boolean,
        default : false
    },
    type : {
        type :String,
        required : true,
        unique : true
    },
    images : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref  : 'Images'
        }
    ],
    users : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref  : 'Users'
        }
    ],
    downloads: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }
    ],
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }
    ]
},{
    timestamps : true
})

const Category = mongoose.model('Category', categorySchema)

export default Category