import { Deposit } from "../models/depositModel.js";

export const createDeposit = async (req, res) => {
  try {
    const { lng, lat, adresadepozit, vendorid } = req.body;

    const new_point = await Deposit.create({
      x: lng,
      y: lat,
      address: adresadepozit,
      vendorid,
    });

    res.status(200).json({
      data: new_point,
      msg: "Deposit was created",
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

export const deleteDeposit = async (req, res) => {
  try {
    const { lng, lat } = req.body;

    const new_point = await Deposit.findOneAndDelete({ x: lng }, { y: lat });

    res.status(200).json({
      msg: "Item was deleted",
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

export const getDeposits = async (req, res) => {
  try {
    const { lat, lng } = req.body;

    const all_deposits = await Deposit.find();

    res.status(200).json({ all_deposits });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

export const getDepositById = async (req, res) => {
  try {
   

   
    
    const vendordeposits = await Deposit.find({ vendorid: req.user.id });

    res.status(200).json({
      vendordeposits
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};


export const getDepositFromId = async (req, res) => {
  try {
   

 
    
    const vendordeposits = await Deposit.findOne({ _id: req.params.id });

    res.status(200).json({
      vendordeposits
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};