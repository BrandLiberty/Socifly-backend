import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    
    
 business_name : {
        type : String,
    },
    about_business:{
        type:String
    },
    logo:{
        type:String
    },

    phone:{
        type:Number
    },
    address:{
        type:String
    },
    Social_media_url:{
        type:String
    },
   product_photo:{
    type:String
   }

},{
    timestamps : true
})

const  Profile= mongoose.model("Business-profile",userSchema);

export default Profile