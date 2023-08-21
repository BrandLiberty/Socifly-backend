import express from "express"
const router = express.Router();

import {createSession , signUp} from "../../../controllers/v1/authController.js"
 import {editProfile}  from "../../../controllers/v1/editController.js"
 import {Upload}from "../../../config/multer.js"

router.post('/signup',signUp)
router.post('/create-session',createSession)
router.post('/edit-profile',Upload.array("image"), editProfile)
export default router