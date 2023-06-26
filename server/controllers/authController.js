import { UserRefreshClient } from 'google-auth-library'
import {User} from '../models/userModel.js'
import {jwtTokens, activateToken}  from '../utils/jwt-helpers.js' 
import bcrypt from 'bcrypt'
import sendEmail from './sendMail.js'
import jwt from 'jsonwebtoken'
import {google} from 'googleapis'
import {product, newp, maccount} from 
'../models/userModel.js'
import newPassword from './newPasswordController.js'
import notifyVendor from './notificationVendorController.js'
import sendEmailVendor from './sendEmailVendor.js'



import  FormatPage  from '../utils/FormatPage.js'


const {OAuth2} = google.auth


const client  = new OAuth2(process.env.MAILING_SERVICE_CLIENT_ID)

export const show_transactions = async(req, res) => {

    try {

        res.status(200).json({
            status:'success',
            data:await maccount.find()
        })

    } catch(error) {
        return res.status(401).json({
            status: 'failed',
            error: error.message})
    }

}

export const new_transaction = async(req, res) => {

    try {

  


        const buyer = await User.findOne({_id:req.user.id})
        console.log(req.user.id)
       
        const bagArr = req.body.bag
       // console.log(bagArr)
       // console.log(req.body)

        if(buyer) {

            

           
           
           
            const create_new_transaction = await maccount.create({
                uid:buyer._id,
                uname:buyer.name,
                toemail:buyer.email,
                dest:req.body.destination,
                bag:req.body.bag,
                mid:req.body.method_id
            }) 

            
           // console.log(create_new_transaction)

            if(create_new_transaction) {


               for(let i = 0; i < bagArr.length; i++) {

                    var curr_item = bagArr[i]
                   
                  //  console.log(curr_item)
                    const check_updt_prod = await product.findByIdAndUpdate({_id: curr_item._id}, {
                        sold: curr_item.quantity + curr_item.sold,
                        nr: curr_item.nr - curr_item.quantity

                 })

                 if(curr_item.nr - curr_item.quantity === 0) {

                    let details = `The product with unique item id (iid) ${curr_item.iid} with title ${curr_item.type} is no longer in stock!!.`
                    await notifyVendor("b.banus@yahoo.com", details)
                 }
               // console.log(check_updt_prod)


               }
              
            
               
           

                res.status(200).json({
                    status:'success',
                    msg:'Success transaction create'
                })

            }
            


        }
        


    } catch(error) {

        console.log(error)
        
        return res.status(409).json({
            status: 'failed',
            error: error.message})
    }


}

export const put_prod_bag = async(req, res) => {

    try{

        
        const buyer = await User.findOne({_id:req.user.id})
        

        if(buyer) {
            const add_to_bag = await User.findByIdAndUpdate({_id:req.user.id}, 
                {
                    bag:req.body.bag
                })
            console.log(add_to_bag)
            if(add_to_bag)
                return res.status(200).json({
                    status:'success',
                    msg:'Item added to bag'
                })
        }

    } catch(error) {

        return res.status(401).json({
            status: 'failed',
            error: error.message})
    }

}


export const prev_ops = async(req, res) => {

    try {

        const uid = req.user.id
        console.log(uid)

        const prev_op = await maccount.find({uid: uid})

        if(prev_op)
            return res.status(200).json({
                status: "success",
                data:
                prev_op
            })
    } catch(error) {

        return res.status(405).json({
            status: 'failed',
            error: error.message})
    }

}


export const show_all_prods = async(req, res) => {

    try {
       
       
             const objarr = req.query
            
             const vendorid = req.query.vendorid
            
             let ARRAY

            if(req.query.role === '2') {
                
                ARRAY = product.find({vendorId: vendorid})
            }
            else{
                ARRAY = product.find()
            }

            if(ARRAY) {
            const formatted_array = new FormatPage(ARRAY, objarr).search_by_method().refresh_page().sort_by_method().iterate_by_method()

            

            if(formatted_array) {

                res.status(200).json({
                    data:await formatted_array.ARR,
                    status:'ok'
                })
            }
            
            }


    } catch(error) {
        console.log(error)
        return res.status(401).json({
            status: 'failed_YA',
            error: error.message})
    }
     

}

export const new_prod = async(req, res) => {

    try {

        const existprod = await product.findOne({iid: req.body.item_id})

        if(!existprod) {
            console.log('haha')
            const newprod = await product.create({
                iid:req.body.item_id,
                type:req.body.item_type,
                offer:req.body.item_offer,
                about:req.body.item_about,
                details:req.body.item_details,
                photo:req.body.item_photo,
                typo:req.body.item_typo,
                vendorId:req.body.item_vendorid,
                depositId:req.body.item_depositid,
                nr:req.body.item_nr
              
            })
            

            if(newprod) {

                res.status(200).json({
                    data:new_prod,
                    status:'success',
                    msg:"The product was created"
                })
            }
        }

        else {
            res.status(401).json({
                status:'failed',
                msg:'This item already exists'
            })
        }



    } catch(error) {
        
        return res.status(401).json({
            status: 'failed',
            error: error.message})
    }

}


export const remove_prod = async(req, res) => {

    try {

        const removedprod = await product.deleteOne({_id: req.params.item_uid})
        if(removedprod)
            res.status(200).json({
                status:'success',
                msg:'The item was deleted'
            })

    } catch(error) {
        
        return res.status(401).json({
            status: 'failed',
            error: error.message})
    }

}


export const updt_prod = async(req, res) => {

    try {
        console.log('hai')
        console.log(req.params)
        const updt_prod = await product.findByIdAndUpdate({_id:req.params.item_uid},
             {
                iid:req.body.item_id,
                type:req.body.item_type,
                offer:req.body.item_offer,
                about:req.body.item_about,
                details:req.body.item_details,
                photo:req.body.item_photo,
                typo:req.body.item_typo,
                nr:req.body.item_nr
             })


        if(updt_prod)
            res.status(200).json({
                status:'success',
                msg:'The item was updated'
            })


    } catch(error) {
        
        return res.status(401).json({
            status: 'failed',
            error: error.message})
    }

}


export const getallcat = async(req, res) => {
    try {

    
        res.status(200).json(await newp.find())

    } catch (error) {

        return res.status(401).json({
            status: 'failed',
            error: error.message})
    }
}




export const createtype = async(req, res) => {

    try {


        const item_type = await newp.findOne({newp_t : req.body.name})
        if(!item_type) {

            const new_type = await newp.create({
                newp_t: req.body.name
            })

            res.status(200).json({
                status: 'success',
                data: new_type,
                msg: 'A new item type was created by an admin'
            })
        }

        else {

            return res.status(401).json({
                status: 'failed', 
                error: 'this item was already created'})

        }




    } catch (error) {

        return res.status(401).json({
            status: 'failed',
            error: error.message})

    }

}

export const deletetype =  async(req, res) => {

    const id_product = req.params.id
    
    try {

        const delete_action = await newp.deleteOne({_id : id_product})
        if(delete_action)
            res.status(200).json({
                status: 'success',
                msg: 'Item was deleted'
            })      


    } catch(error) {

        return res.status(401).json({
            status: 'failed',
            error: error.message})
        

    }
}

export const updtcat =  async(req, res) => {


    try {

       
        const updt_item = await newp.findByIdAndUpdate({_id:req.params.id}, {newp_t: req.body.name})
       // console.log(updt_item)
        if(updt_item)
            return res.status(200).json({
                status:'success',
                type:'update',
                msg:'Success item updated'
            })
        

    } catch(error) {
        
        return res.status(401).json({
            status: 'failed',
            type: 'error',
            error: error.message})
        

    }
}

export const register = async (req, res) => {
     try {

        const {name, email, password, register_type} = req.body
      //  console.log(register_type)
        var role

        if(!name || !email || !password)
            return res.status(400).json({msg: "Please fill in all fields"})

        if(!validateEmail(email))
            return res.status(400).json({msg: 'Register Test'})
        
        
        const user = await User.findOne({email})
        if(user) 
            return res.status(400).json({msg: "This email already exists"})

        if(password.length < 6)
            return res.status(400).json({msg: "Password must be at least 6 characters."})
        
        const passwordHash = await bcrypt.hash(password, 12)

        if(register_type === 'customer')
            role = 0
        else if(register_type === 'vendor')
            role = 2
        else 
            return res.status(400).json({msg: "You can't create an account with this role !"})
        
        const newUser = {name, email, password:passwordHash, role}

        
        const activation_token = activateToken(newUser).activateToken

        const url = `${process.env.CLIENT_URL}/user/activate/${activation_token}`
        if(register_type === 'customer')
            await sendEmail(email, url, "verifyMail")
        else
            await sendEmailVendor(email, url, "checkMail")
        

        
        res.json({msg:"Register Success! Please activate your email to start."})
     } catch (err) {
         return res.status(500).
         json({msg: err.message})
     }
}

export const activateEmail = async(req, res) => {
    try {
        const {activation_token} = req.body
        const user = jwt.verify(activation_token, process.env.ACTIVATION_TOKEN_SECRET)
        const {name, email, password, role} = user

        const check = await User.findOne({email})
        if(check) return res.status(400).json({msg:"This email already exists"})

        const newUser = new User({
            name, email, password, role
        })

        await newUser.save()

        res.json({msg: "Account has been activated"})
    
    } catch(err) {
        return res.status(500).
         json({msg: err.message})        
    }
}


export const login = async(req, res) => {
    try {

        const {email, password} = req.body
        const user = await User.findOne({email})

        if(!user)
            return res.status(400).json({msg: "This email does not exist."})

        
        const validPassword = await bcrypt.compare(password, user.password)
        if (!validPassword)
            return res.status(401).json({error: "Incorrect password"})


        
           
    const userToken = {id:user._id,name:user.name, email:user.email, password:user.password}
    const tokens = jwtTokens(userToken)

    


    res.cookie('refreshtoken', tokens.refreshToken, {
        httpOnly:true,
        path: '/user/refreshtoken',
        maxAge:7 * 24 * 60 * 60 * 1000

    })

    res.json({msg:tokens.refreshToken})
    
  
    } catch (err) {
        return res.status(500).
         json({
             status: 'failed',
             msg: err.message})         
    }
}


export const refreshTokens = (req, res) => {

    try {

        const refreshtoken = req.cookies.refreshtoken
        
        if(refreshtoken === null) return res.sendStatus(401)

        jwt.verify(refreshtoken, process.env.REFRESH_TOKEN_SECRET, (error, user) => {

            if(error) return res.status(403).json({error:error.message})
            let tokens = jwtTokens(user)
             res.cookie('refreshtoken', tokens.refreshToken, {
        httpOnly:true,
        path: '/user/refreshtoken',
        maxAge:7 * 24 * 60 * 60 * 1000

    })
        
        res.json(tokens.accessToken)
        })
    } catch(error) {
        res.status(401).json({error: error.message})
    }
}


export const forgotPassword = async(req, res) => {

    try {
        const {email} = req.body
        const user = await User.findOne({email})
        if(!user) return res.status(401).json({error: "This email does not exist in our DATABASE !"})
      //  console.log(user)
       // const tokens = jwtTokens()
       const userToken = {name:user.name, email:user.email, password:user.password}
       const tokens  = jwtTokens(userToken)

       res.cookie('refreshtoken', tokens.refreshToken, {
        httpOnly:true,
        path: '/user/refreshtoken',
        maxAge:7 * 24 * 60 * 60 * 1000

    })
       const url = `${process.env.CLIENT_URL}/user/reset/${tokens.accessToken}`

       await newPassword(email, url, "Change password")
       res.json({msg: "Re-send the password, please check your email."})
    } catch(error) {
        res.status(401).json({error: error.message})
    }


}


export const resetPassword = async(req, res) => {

    try {
        const {password} = req.body

        const passwordHash = await bcrypt.hash(password, 12)

        //console.log(req.user)

        await User.findOneAndUpdate({email : req.user.email}, {
            password: passwordHash
        })

        res.json({msg: "Password succesfully changed!"})

    } catch(error) {

        res.status(401).json({error: error.message})

    }

}


export const googleLogin = async(req, res) => {

    try {

        const {tokenId} = req.body
   
        const verify = await client.verifyIdToken({idToken: tokenId, audience: process.env.MAILING_SERVICE_CLIENT_ID})
        
        const passwordHash =  await bcrypt.hash(verify.payload.email + process.env.GOOGLE_SECRET, 12)

   

        if(!verify.payload.email) 
            return res.status(404).json({msg: "Email incorect"})
            
      
        const user =  await User.findOne({email : verify.payload.email})

        
        console.log('mama3'+req.user)
    // console.log(user)
    if(user) {
       
        
        

       const userToken = {id:user.id, name:user.name, email:user.email, password:user.password}
       const tokens  = jwtTokens(userToken)

       res.cookie('refreshtoken', tokens.refreshToken, {
        httpOnly:true,
        path: '/user/refreshtoken',
        maxAge:7 * 24 * 60 * 60 * 1000

    })    

    res.json({msg: "Login success!"})
            
            
    } else  {
        //create new user if he doesn't exist

        const newUser = new User({
            name : verify.payload.name,email: verify.payload.email, password: passwordHash, avatar: verify.payload.picture
        })


        await newUser.save()

       


        if(newUser) {
            
       const userToken = {id:newUser.id, name:newUser.name, email:newUser.email, password:newUser.password}
       const tokens  = jwtTokens(userToken)

       res.cookie('refreshtoken', tokens.refreshToken, {
        httpOnly:true,
        path: '/user/refreshtoken',
        maxAge:7 * 24 * 60 * 60 * 1000

    })    

    res.json({msg: "Login success with new USER!"})
            
            }

    }


    } catch(error) {
        
        return res.status(500).json({error: error.message.data})

    }

}

export const getUserInfo = async(req, res) => {
    try {

        const user = await User.findOne({email: req.user.email}).select("-password")
        
        res.json(user)

    } catch(error) {
        res.status(401).json({error: error.message})
    }
}

export const getAll = async(req, res) => {

     try {
   
        const users = await User.find().select('-password')

        res.json(users)
    } catch(error) {
        res.status(401).json({error: error.message})
    }

}

export const logout = async(req, res) => {


      try {
        

       // console.log(req.cookies.refreshToken)
        res.clearCookie('refreshtoken', {path:'/user/refreshtoken'})
        console.log(req.cookies.refreshToken)
        //console.log('BLABLA')
        res.status(200).json({msg: "Logout success!"})
        console.log('success')
        
    } catch(error) {
        
        res.status(401).json({
            status:'logout failed',
            error: error.message})
    }


}

export const updateUser = async(req, res) => {
    try {

        const {name, image} = req.body

        await User.findOneAndUpdate({email: req.user.email}, {
            name, image
        })
        res.json({msg: "Succes update"})

    } catch(err) {
        res.status(401).json({error: error.message})
    }

}

export const updateAllRole = async(req, res) => {
    try {

        const {role} = req.body
        await User.findOneAndUpdate({_id : req.params.id}, {
            role
        })

        res.json({msg : "Updated succesfully"})

    } catch(error) {
        
        return res.status(500).json({error: error.message})
        
    }
}

export const deleteUser = async(req, res) => {

    try {

        await User.findByIdAndDelete(req.params.id)
        res.json({msg : "Delete success"})

    } catch (error) {

        return res.status(500).json({error: error.message})
    }

}

const validateEmail = (email) => {

    const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
    return re.test(email)

}