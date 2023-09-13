import express from 'express'
import authRoutes from './auth/index.js'
import homeRoutes from './home/index.js'
import profileRoutes from './profile/index.js'

const router = express.Router()

router.use('/auth',authRoutes)
router.use('/home',homeRoutes)
router.use('/profile',profileRoutes)


export default router