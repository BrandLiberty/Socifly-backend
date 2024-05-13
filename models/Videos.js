import mongoose from "mongoose";
import multer from 'multer'
import path from 'path'
const __dirname = path.resolve(path.dirname(''));
const VIDEO_PATH = path.join('/uploads/videos');

const videoSchema = new mongoose.Schema({
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
        cb(null, path.join(__dirname, VIDEO_PATH))
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now();
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
})

videoSchema.statics.uploadVideo = multer({ storage: storage }).array('videos');
// userSchema.statics.uploadImages = multer({storage : storage})
videoSchema.statics.videoPath = VIDEO_PATH;

const Videos = mongoose.model('Videos', videoSchema)

export default Videos