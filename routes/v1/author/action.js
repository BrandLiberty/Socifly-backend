import express from 'express'
const router = express.Router()

import {
    createCategory,
    deleteImage,
    manageImages,
    uploadImages,
    createVideoCategory,
    uploadVideos,
    manageVideos,
    deleteVideo
}from '../../../controllers/v1/authorController.js'

router.post('/create-category',createCategory)
router.post('/create-video-category',createVideoCategory)
router.post('/upload-images',uploadImages)
router.post('/upload-videos',uploadVideos)
router.get('/manage-images',manageImages)
router.get('/manage-videos',manageVideos)
router.get('/delete-images',deleteImage)
router.get('/delete-videos',deleteVideo)

export default router