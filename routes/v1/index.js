import express from 'express'
import authRoutes from './auth/User.js'
import homeRoutes from './home/index.js'

const router = express.Router()

router.use('/auth',authRoutes)
router.use('/home',homeRoutes)

export default router