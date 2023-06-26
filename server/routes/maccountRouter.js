import express from 'express'
import {register, activateEmail, login, refreshTokens, forgotPassword, resetPassword, getUserInfo, getAll, logout, updateUser, updateAllRole, deleteUser, googleLogin} from '../controllers/authController.js'
import {authorization} from '../middleware/authorization.js'
import { authorizationAdmin } from '../middleware/authorizationAdmin.js'
import { maccount, User } from '../models/userModel.js'
import { show_all_prods, new_prod, remove_prod, updt_prod} from '../controllers/authController.js'
import { new_transaction, show_transactions } from '../controllers/authController.js'

const maccountRouter = express.Router()
const bill = '/Transaction'

maccountRouter.route(bill).get(show_transactions)
maccountRouter.route(bill).post(authorization, new_transaction)


export default maccountRouter
