import express from 'express'
const router = express.Router()

import {
    createCategory,
    uploadImages
}from '../../../controllers/v1/authorController.js'

router.post('/create-category',createCategory)
router.post('/upload-images',uploadImages)

export default router