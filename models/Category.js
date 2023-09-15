import mongoose from 'mongoose'

const categorySchema = new mongoose.Schema({
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
    downloads : {
        type:  Number
    },
    likes : {
        type : Number
    }
},{
    timestamps : true
})

const Category = mongoose.model('Category', categorySchema)

export default Category