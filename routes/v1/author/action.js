import express from 'express'
const router = express.Router()

import {
    createCategory,
    manageImages,
    uploadImages
}from '../../../controllers/v1/authorController.js'

router.post('/create-category',createCategory)
router.post('/upload-images',uploadImages)
router.get('/manage-images',manageImages)

export default router