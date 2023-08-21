import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    
    name : {
        type : String,
    },
    about:{
        type:String
    },
    photo:{
        type:String
    },

    phone:{
        type:Number
    },
    address:{
        type:String
    },
   social_media_url:{
        type:String
    },
    organization_name:{
        type:String
    },
    organization_logo:{
        type:String
    }

},{
    timestamps : true
})

const  Profile= mongoose.model("Personal-profile",userSchema);

export default Profile