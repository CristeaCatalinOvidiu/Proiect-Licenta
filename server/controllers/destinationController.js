import { Destination } from "../models/destinationModel.js";



export const createdestination = async(req, res) => {

    try {

        const {lng, lat, destinatar, emaildestinatar, adresadestinatie} = req.body

        const new_point = await Destination.create({
            x: lng,
            y: lat,
            destinatar,
            emaildestinatar,
            address: adresadestinatie
        })


        res.status(200).json({
            data: new_point,
            msg: "DEstination was created"})


    } catch(err) {

        return res.status(500).json({msg: err.message})

    }

}





export const deletedestination = async(req, res) => {

    try {

        const {lng, lat} = req.body

        const new_point = await Destination.findOneAndDelete({x: lng}, {y: lat})

        res.status(200).json({

            msg: "Item was deleted"})


    } catch(err) {

        return res.status(500).json({msg: err.message})

    }

}

export const getDestinationById = async(req, res) => {
    

    try {
    
        console.log(req.params.destinationid)
    const dest = await Destination.findOne({_id: req.params.destinationid})

    


    res.status(200).json({dest})

    } catch(err) {

        return res.status(500).json({msg: err.message})

    }

}


export const getdestinations = async(req, res) => {

    try {

       

        const all_destinations = await Destination.find()

        res.status(200).json({all_destinations})


    } catch(err) {

        return res.status(500).json({msg: err.message})

    }

}