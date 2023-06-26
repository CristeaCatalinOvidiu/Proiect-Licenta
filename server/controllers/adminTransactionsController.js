import { admintranscations } from "../models/adminTransaction.js"
import { User } from "../models/userModel.js"
import { Deposit } from "../models/depositModel.js"
import { timeout } from "../middleware/timeOut.js"

export const show_admintransactions = async(req, res) => {

    try {

        res.status(200).json({
            status:'success',
            data:await admintranscations.find()
        })

    } catch(error) {
        return res.status(401).json({
            status: 'failed',
            error: error.message})
    }

}


export const show_on_transit_admintransactions =  async(req, res) => {

    try {

        res.status(200).json({
            status:'success',
            data:await admintranscations.find({status : 1})
        })

    } catch(error) {
        return res.status(401).json({
            status: 'failed',
            error: error.message})
    }

}


export const set_transaction_ontransit = async(req, res) => {

    try {
                
        //transaction id
        const tid = req.body.transactionid
        //dest id
        const did = req.body.destid

        console.log(tid)
        
       
         const update = await admintranscations.findByIdAndUpdate({_id: tid}, {
            status: 1,
            destid : did
        })

        res.status(200).json(update)
        

       

    } catch(error) {
        console.log(error)
        return res.status(500).json({
            status: 'failed',
            error: error.message})
    }

}

export const new_admintransaction = async(req, res) => {

    try {

       
        const buyer = await User.findOne({_id:req.user.id})
        
       // console.log(bagArr)
       // console.log(req.body)
      

        if(buyer) {

            

           
           
           
            const create_new_transaction = await admintranscations.create({
                status: 0,
                uid:buyer._id,
                uname:buyer.name,
                toemail:buyer.email,
                dest:req.body.destination,
                bag:req.body.bag,
                mid:req.body.method_id
            }) 

            
           // console.log(create_new_transaction)

            if(create_new_transaction) {


              /*
               bagArr.filter(item => {
                    
                    return updtnr(item.id, item.quantity, item.nr)
                                                        
                }) 
            */
            
               
           

                res.status(200).json({
                    status:'success',
                    msg:'Success transaction create'
                })

            }
            


        }
        


    } catch(error) {
        console.log(error.message)
        return res.status(409).json({
            status: 'failed',
            error: error.message})
    }


}








export const getsources = async(req, res) => {

    try {

    const paymentid = req.params.transactionid
    console.log(paymentid)
    var sourceids = []
    const transaction = await admintranscations.findOne({_id: paymentid})


    

    

    for(let i = 0; i < transaction.bag.length; i++) {


        const curr_deposit = await Deposit.findOne({_id: transaction.bag[i].depositId})
        const vendor = await User.findOne({_id : transaction.bag[i].vendorId})
        sourceids.push({

            x : curr_deposit.x,
            y : curr_deposit.y,
            vendor: vendor,
            item_id: transaction.bag[i]._id
           } )

    }

    res.status(200).json(sourceids)
    
    }
    catch(error) {

        return res.status(409).json({
            status: 'failed',
            error: error.message})

    }


}




export const maketransactiondelivered =  async(req, res) => {
    
    try {

        

        
        console.log('rarirara')
           const maketransactiondelivered = await admintranscations.findByIdAndUpdate({_id : req.body.transactionid},
            {status: 2})
       
    
       


    } catch(error) {


       

        return res.status(409).json({
            status: 'failed',
            error: error.message})

    }

}



export const makepointdelivered = async(req, res) => {

    try {


        console.log('parasitesss')
    

        const {transactionid, x, y, item_id} = req.body


        

        const curr_transaction = await admintranscations.findOne({_id: transactionid})
        



       var new_bag = JSON.parse(JSON.stringify(curr_transaction.bag))


   


        const curr_deposit = await Deposit.findOne({x: x, y: y})


        console.log(curr_deposit)
       

        for(let i = 0; i < new_bag.length; i++) {

            
           if(new_bag[i].depositId === JSON.parse(JSON.stringify(curr_deposit._id)) && new_bag[i]._id === item_id) {
                    console.log('depa2')
                    new_bag[i].checked = true

                }

        }


        const update = await admintranscations.findByIdAndUpdate({_id: transactionid}, {
            bag: new_bag
        })



        const check_full_deliver = new_bag.every((el) => {
            return el.checked === true
        })


        console.log(check_full_deliver)


        res.status(200).json({
            transacation_delivered: check_full_deliver,
            new_bag})

    

   
    
    }
    catch(error) {

        return res.status(409).json({
            status: 'failed',
            error: error.message})

    }


}

