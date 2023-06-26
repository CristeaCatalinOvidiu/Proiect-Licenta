import { uploadImgProduct } from "../controllers/uploadForProduct.js";
import { midfunc } from '../middleware/uploadimg.js'
import {authorization} from '../middleware/authorization.js'
import express from 'express'
import { destroyImg } from "../controllers/uploadForProduct.js";


let productRouter = express.Router()

const uploadproductimg = '/uploadproductimg'
const delphoto = '/delphoto'

productRouter.route(uploadproductimg).post(midfunc, uploadImgProduct)
productRouter.route(delphoto).post(destroyImg)

export default productRouter