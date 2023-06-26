
import cloudinary from 'cloudinary'
import fs from 'fs'
import {removeTmp} from '../middleware/uploadimg.js'



cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
})

export const uploadImgProduct = async(req, res) => {

    try {

        const file = req.files.file
        

        cloudinary.v2.uploader.upload(file.tempFilePath, {
            folder: 'productphoto'
        }, async(err, result) => {
            if(err) throw err;
            removeTmp(file.tempFilePath)

            res.status(200).json({public_id: result.public_id, url:result.secure_url})
        })

    } catch(error) {
        
        res.status(500).json({error: error.message})

    }
}


export const destroyImg = async(req, res) => {

    try {
        const {public_id} = req.body;
        if(!public_id) return res.status(400).json({msg: 'No images Selected'})

        cloudinary.v2.uploader.destroy(public_id, async(err, result) =>{
            if(err) throw err;

            res.json({msg: "Deleted Image"})
        })

    } catch (err) {
        return res.status(500).json({msg: err.message})
    }

}