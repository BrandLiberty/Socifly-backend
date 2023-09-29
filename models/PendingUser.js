import mongoose from 'mongoose'

const pendingUserSchema = new mongoose.Schema({
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    previousEmail :{
        type :String,
    },
    updatedEmail : {
        type : String,
        unique : true
    },
    hash : {
        type : String,
        required : true,
        default : ''
    }
},{
    timestamps : true
})

const PendingUser = mongoose.model('PendingUser', pendingUserSchema)

export default PendingUser