import mongoose from "mongoose";

const { Schema, model } = mongoose;

const depositSchema = new Schema(
  {
    x: {
      type: Number,
      required: true,
    },
    y: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
    },
    vendorid: {
      type: String,
    },
  },

  { timestamps: true }
);

export const Deposit = model("Deposit", depositSchema);
