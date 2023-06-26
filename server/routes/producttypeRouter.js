import express from 'express'
import {getallcat, createtype, deletetype, updtcat} from '../controllers/authController.js'
import {authorization} from '../middleware/authorization.js'
import { authorizationAdmin } from '../middleware/authorizationAdmin.js'
import { supportauth } from '../middleware/supportauth.js'
import { User } from '../models/userModel.js'
import router from './userRoutes.js'



const postget = '/type'


const delpatch = '/type/:id'

const producttypeRouter = express.Router()




producttypeRouter.route(postget).get(getallcat)
producttypeRouter.route(postget).post(authorization,  createtype)

producttypeRouter.route(delpatch).patch(updtcat)
producttypeRouter.route(delpatch).delete(authorization,  deletetype)

export default producttypeRouter
