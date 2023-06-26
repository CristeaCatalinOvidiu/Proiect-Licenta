import {User} from '../models/userModel.js'


export const authorizationAdmin = async (req, res, next) => {


    try {

     
        const user = await User.findOne({email : req.user.email})

        


        if(user.role !== 1) {
            console.log('bafta man')
            return res.status(401).json({
                status: 'failed_auth_admin',
                error: "Admin resources access denied"})

            }
        else {
            console.log('NU INTELEG')
            next()
        }

        

        
        
    } catch(error) {
        console.log('second')
        return res.status(500).json({error: error.message})
    }
}