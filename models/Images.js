import mongoose from "mongoose";
import multer from 'multer'
import path from 'path'
const __dirname = path.resolve(path.dirname(''));
const IMAGE_PATH = path.join('/uploads/images');

const imageSchema = new mongoose.Schema({
    category : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Category',
        required: true
    },
    path : {
        type: String
    },
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
    timestamps  : true
})

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, IMAGE_PATH))
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now();
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
})

imageSchema.statics.uploadImage = multer({storage : storage}).single('image');
// userSchema.statics.uploadImages = multer({storage : storage})
imageSchema.statics.imagePath = IMAGE_PATH;

const Image = mongoose.model('Image',imageSchema)

export default Image