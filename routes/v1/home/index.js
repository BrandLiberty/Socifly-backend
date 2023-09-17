import express from 'express'
const router = express.Router()

import {
    getCategory,
    getImages,
    getImagesByCategory
} from '../../../controllers/v1/homeController.js'

router.get('/get-category',getCategory)
router.get('/get-images',getImages)
router.get('/get-images-by-category',getImagesByCategory)

export default router