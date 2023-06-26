import express from 'express'
import { uploadImg } from '../controllers/upload.js'
import { midfunc } from '../middleware/uploadimg.js'
import {authorization} from '../middleware/authorization.js'




let router = express.Router()


router.route('/uploadimg').post(midfunc, authorization, uploadImg)



export {router}