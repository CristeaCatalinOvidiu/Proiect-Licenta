import express from 'express'
import {register, activateEmail, login, refreshTokens, forgotPassword, resetPassword, getUserInfo, getAll, logout, updateUser, updateAllRole, deleteUser, googleLogin} from '../controllers/authController.js'
import {authorization} from '../middleware/authorization.js'
import { authorizationAdmin } from '../middleware/authorizationAdmin.js'
import { User } from '../models/userModel.js'
import { prev_ops } from '../controllers/authController.js'
import { put_prod_bag } from '../controllers/authController.js'
import { getvendortransactions } from '../controllers/vendorController.js'
import { show_admintransactions,new_admintransaction } from '../controllers/adminTransactionsController.js'
import { getsources } from '../controllers/adminTransactionsController.js'
import { makepointdelivered } from '../controllers/adminTransactionsController.js'
import { getDestinationById } from '../controllers/destinationController.js'
import { set_transaction_ontransit } from '../controllers/adminTransactionsController.js'
import { notifyUser } from '../controllers/notificationServiceController.js'
import { show_on_transit_admintransactions } from '../controllers/adminTransactionsController.js'
import { maketransactiondelivered } from '../controllers/adminTransactionsController.js'
import { timeout } from '../middleware/timeOut.js'



import { createdestination, deletedestination, getdestinations } from '../controllers/destinationController.js'
import {
	getDestinations as getDestinationsA,
	getDestination as getDestinationA,
	createDestination as createDestinationA,
	deleteDestination as deleteDestinationA,
	deleteDestinations as deleteDestinationsA,
	patchDestination as patchDestinationA,
} from "../controllers/destController.js";
import {
  createDeposit,
  deleteDeposit,
  getDeposits,
  getDepositById,
  getDepositFromId
} from "../controllers/depositController.js";

import { getDeposits as getDepositsA, createDeposit as createDepositA, deleteDeposit as deleteDepositA } from "../controllers/depController.js";


const router = express.Router()
const prev = '/prevops'
const putinbag = '/putinbag'
router.route('/register').post(register)
router.route('/activation').post(activateEmail)
router.route('/login').post(login)
router.route('/glog').post(googleLogin)
router.route('/refreshtoken').post(refreshTokens)
router.route('/forgot').post(forgotPassword)
router.route('/reset').post(authorization, resetPassword)
router.route('/userinfo').get(authorization, getUserInfo)
router.route('/all').get(authorization, authorizationAdmin, getAll)
router.route('/logout').delete(logout)
router.route('/updaterole/:id').patch(authorization,authorizationAdmin, updateAllRole)
router.route('/delete/:id').delete(authorization, authorizationAdmin, deleteUser)
router.route(prev).get(authorization, prev_ops)
router.route(putinbag).patch(authorization, put_prod_bag)




router.route('/getadmintransactions').get(show_admintransactions)
router.route('/show_admintransactions').get(show_admintransactions)




router.route('/getsources/:transactionid').get(getsources)



router.route('/newadmintransaction').post(authorization, new_admintransaction)



router.route('/getvendortransactions').post(getvendortransactions)


router.route('/makepointdelivered').patch(makepointdelivered)
router.route('/getdestinationbyid/:destinationid').get(getDestinationById)
router.route('/settransactionidontransit').patch(set_transaction_ontransit)
router.route('/notifyuser').post(notifyUser)

router.route('/maketransactiondelivered').patch(timeout, maketransactiondelivered)



// david dest route

router.route('/createdestination').post(createdestination)
router.route('/deletedestination').delete(deletedestination)
router.route('/getdestinations').get(getdestinations)



router.route('/showontransittransactions').get(show_on_transit_admintransactions)
router.route('/update').patch(authorization, updateUser)
router.route('/reset').post(authorization, resetPassword)





//MAP CONTROLLERS




router.route("/getdeposit").get(authorization, getDepositById)
router.route("/getdepositfromid/:id").get(getDepositFromId)


//MAP CONTROLLERS ANDREI
router.route("/destinations").get(getDestinationsA);
router.route("/destination").get(getDestinationA);
router.route("/destinations").delete(deleteDestinationsA);
router.route("/destination").delete(deleteDestinationA);
router.route("/destination").patch(patchDestinationA);
router.route("/destination").post(createDestinationA);

router.route("/deposits").get(getDepositsA);
router.route("/deposit").post(createDepositA);
router.route("/deposit").delete(deleteDepositA);





export default router
