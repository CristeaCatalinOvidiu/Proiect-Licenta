import express from 'express'
import {register, activateEmail, login, refreshTokens, forgotPassword, resetPassword, getUserInfo, getAll, logout, updateUser, updateAllRole, deleteUser, googleLogin} from '../controllers/authController.js'
import {authorization} from '../middleware/authorization.js'
import { authorizationAdmin } from '../middleware/authorizationAdmin.js'
import { User } from '../models/userModel.js'
import { show_all_prods, new_prod, remove_prod, updt_prod} from '../controllers/authController.js'



const getposturl = '/item'

const delpatchurl = '/item/:item_uid'


const itemRouter = express.Router()




itemRouter.route(getposturl).get(show_all_prods)
itemRouter.route(getposturl).post(authorization, new_prod)


itemRouter.route(delpatchurl).delete(authorization, remove_prod)
itemRouter.route(delpatchurl).patch(updt_prod)

export default itemRouter


