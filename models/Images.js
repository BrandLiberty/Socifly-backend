import mongoose from "mongoose";
import multer from 'multer'
import path from 'path'
const __dirname = path.resolve(path.dirname(''));
const IMAGE_PATH = path.join('/uploads/images');

const imageSchema = new mongoose.Schema({
    lang: {
        type: String,
        required: true,
        enum: ['english', 'hindi', 'marathi', 'wallpaper']
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    path: {
        type: String,
        required: true
    },
    downloads: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }
    ],
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }
    ]
}, {
    timestamps: true
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

imageSchema.statics.uploadImage = multer({ storage: storage }).array('images');
// userSchema.statics.uploadImages = multer({storage : storage})
imageSchema.statics.imagePath = IMAGE_PATH;

const Images = mongoose.model('Images', imageSchema)

export default Images