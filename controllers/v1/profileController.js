import User from "../../models/User.js";

export const getProfileInfo = async(req,res)=>{
    console.log('API : /profile/get-info',req?.user)

    try {
        if(req.user){
        return res.status(200).json({
            message : 'Profile Info',
            data : {
                email : req.user.email,
                name : req.user.name,
                phone : req.user.phone,
                image : req.user?.avatar
            }
        })
    }else{
        return res.status(401).json({
            message : 'Invalid Login Attempt'
        })
    }
    } catch (error) {
        return res.status(500).json({
            message : 'Internal Server Error'
        })
    }
}