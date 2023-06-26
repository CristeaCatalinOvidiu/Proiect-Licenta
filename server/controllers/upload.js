
import cloudinary from 'cloudinary'
import fs from 'fs'
import {removeTmp} from '../middleware/uploadimg.js'



cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
})

export const uploadImg = async(req, res) => {

    try {

        const file = req.files.file
        

        cloudinary.v2.uploader.upload(file.tempFilePath, {
            folder: 'avatar', width: 150, height: 150, 
            crop: "fill"
        }, async(err, result) => {
            if(err) throw err;
            removeTmp(file.tempFilePath)

            res.json({url:result.secure_url})
        })

    } catch(error) {
        
        res.status(500).json({error: error.message})

    }
}