import express from 'express'
const router = express.Router()

import {
    createCategory
}from '../../../controllers/v1/authorController.js'

router.post('/create-category',createCategory)

export default router