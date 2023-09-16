import mongoose from 'mongoose'

let activitySchema = new mongoose.Schema({
    user:{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    loginTime : {
        type : Number,
        default : new Date().getTime()
    }
},{
    timestamps : true
})

const Activity = mongoose.model('Activity',activitySchema)

export default Activity