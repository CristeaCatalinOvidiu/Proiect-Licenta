import jwt from 'jsonwebtoken'


export const supportauth = async (req, res, next) => {

    try {

       

        next()

    } catch(error) {

        console.log('[ILA')
        return res.status(500).json({
            status: 'failed_Support',
            error: error.message})
    }
    
}