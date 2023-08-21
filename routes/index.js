import express from 'express'
const router = express.Router()

import routes from './v1/index.js'
router.use('/v1',routes)

export default router