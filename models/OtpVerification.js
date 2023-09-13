import mongoose from 'mongoose'

const otpVerificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    otp: {
        type: Number,
        required: true
    },
    otpverified: {
        type: Boolean,
        default: false
    },
    sendingTime: {
        type: Number,
        required: true
    },
    hash: {
        type: String,
        required: true,
        default: ''
    }
}, {
    timestamps: true
})

const OtpVerification = mongoose.model('OtpVerification', otpVerificationSchema)

export default OtpVerification