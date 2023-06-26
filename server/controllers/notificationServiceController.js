
import notifyService from "./notifyController.js"


export const notifyUser = async (req, res) => {
     try {



        
        notifyService(req.body.receiver_email, req.body.txt)

        
        res.json({msg:"The message was delivered successfully"})
     } catch (err) {
         return res.status(500).
         json({msg: err.message})
     }
}