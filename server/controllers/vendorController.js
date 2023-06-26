import { maccount } from "../models/userModel.js"




export const getvendortransactions = async(req, res) => {

    try {


        const vendorid = req.body.vendorid
        var vendortransactions = []
        
        
        const transactions = await maccount.find()

        console.log()
        

        for(let i = 0; i < transactions.length; i++) {

                var new_obj = JSON.parse(JSON.stringify(transactions[i]))

                
                
                
                new_obj.bag = []
               
                var r = 0

               

               
               
                for(let k = 0; k < transactions[i].bag.length; k++) {

                    
                    
                    
                    if(vendorid === transactions[i].bag[k].vendorId) {


                        console.log('tata')
                       
                        new_obj.bag.push(transactions[i].bag[k])
                        
                        r = 1
                      
                    }
                }

                if(r === 1) {
                    
                    vendortransactions.push(new_obj)
                }

                r = 0

        }

        res.status(200).json({
            vendortransactions
        })



    } catch(err) {

        return res.status(500).json({msg: err.message})

    }



}