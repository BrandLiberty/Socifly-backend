import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    email :{
        type : String,
        reqiured : true,
        unique :true
    },
    password :{
        type : String,
        required : true 
    },
    name : {
        type : String,
    },
    phone:{
        type:Number
    }
},{
    timestamps : true
})

const User = mongoose.model('User',userSchema);

export default User