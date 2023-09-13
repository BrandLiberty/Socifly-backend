import mongoose from 'mongoose'

const otpVerificationSchema = new mongoose.Schema({
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    otp : {
        type :Number,
    },
    sendingTime : {
        type : Number,
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

const OtpVerification = mongoose.model('OtpVerification', otpVerificationSchema)

export default OtpVerification