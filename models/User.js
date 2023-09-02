import mongoose from "mongoose"
import multer from 'multer'
import path from 'path'
const __dirname = path.resolve(path.dirname(''));
const AVATAR_PATH = path.join('/uploads/users/avatars');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        reqiured: true,
        unique: true
    },
    phone: {
        type: Number,
    },
    name: {
        type: String,
    },
    hash: {
        type: String,
        required: true
    },
    avatar: {
        type: String
    },
    verified : {
        type : Boolean,
        default : false
    },
    underUpdate : {
        type : Boolean,
        default : false
    },
    status :{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'PendingUser'
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId
        }
    ],
    shared: [
        {
            type: mongoose.Schema.Types.ObjectId
        }
    ]
}, {
    timestamps: true
})


let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, AVATAR_PATH))
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now();
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
})

userSchema.statics.uploadAvatar = multer({storage : storage}).single('avatar');
userSchema.statics.uploadLogo = multer({storage : storage}).single('logo');
userSchema.statics.avatarPath = AVATAR_PATH;

const User = mongoose.model('User', userSchema);

export default User