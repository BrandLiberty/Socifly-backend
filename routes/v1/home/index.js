import express from 'express'
const router = express.Router()

import {
    getCategory,
    getImages,
    getImagesByCategory,
    getVideoCategory,
    getVideos,
    getVideosByCategory
} from '../../../controllers/v1/homeController.js'

router.get('/get-category',getCategory)
router.get('/get-video-category',getVideoCategory)
router.get('/get-images',getImages)
router.get('/get-videos',getVideos)
router.get('/get-images-by-category',getImagesByCategory)
router.get('/get-videos-by-category',getVideosByCategory)

export default router