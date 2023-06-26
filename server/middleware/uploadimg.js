import fs from 'fs'


export const midfunc =  async(req, res , next) => {

    try {

        if(!req.files || Object.keys(req.files).length === 0)
            return res.status(400).json({error: "No file uploaded."})

        const file = req.files.file

        if(file.size > 1024 * 1024) {
            removeTmp(file.tempFilePath)
            return res.status(400).json({error: "Size too large"})
        }

        if(file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png') {
            removeTmp(file.tempFilePath)
             return res.status(400).json({error: "File format is not jpeg or png"})
        }

        next()
    }
    catch(error) {

        return res.status(401).json({error: error.message})

    }
}


export const removeTmp = (path) => {

    fs.unlink(path, err => {
        if(err)
            throw err
    })
}