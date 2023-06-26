import dotenv from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import fileUpload from 'express-fileupload'
import router from './routes/userRoutes.js'
import {router as routerupload} from './routes/upload.js'
import producttypeRouter from './routes/producttypeRouter.js'
import { authorizationAdmin } from './middleware/authorizationAdmin.js'
import { timeout } from './middleware/timeOut.js'

import itemRouter from './routes/itemOpsRouter.js'
import maccountRouter from './routes/maccountRouter.js'
import productRouter from './routes/uploadImgProduct.js'


dotenv.config()

let app = express()

const middlewares = [express.json(), cors(), cookieParser(), fileUpload({
    useTempFiles: true
})]
app.use(middlewares)


app.use('/user', router)
app.use('/api', routerupload)
app.use('/api', producttypeRouter)
app.use('/api', itemRouter)
app.use('/api', maccountRouter)
app.use('/api', productRouter)


const connectwithRetry = () => {
    mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("succesfully connected to db"))
.catch((e) => {
    console.log(e)
})
}

connectwithRetry()
/*
app.use('/', (req, res, next) => {
    res.json({msg: "Hello Everyone!"})
}) */


const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`App is listening on poert ${PORT}`)
})
