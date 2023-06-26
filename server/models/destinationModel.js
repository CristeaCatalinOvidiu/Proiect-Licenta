import mongoose from "mongoose";

const { Schema, model } = mongoose;

const destinationSchema = new Schema(
  {
    x: {
      type: Number,
      required: true,
    },
    y: {
      type: Number,
      required: true,
    },
    receiver_name: {
      type: String,
      required: true,
      maxLength: 100,
    },
    receiver_company_name: {
      type: String,
      required: false,
      maxLength: 100,
    },
    receiver_email: {
      type: String,
      required: true,
      maxLength: 100,
    },
    receiver_location: {
      type: String,
      required: true,
      maxLength: 100,
    },
  },
  {
    timestamps: true,
  }
);
export const Destination = model("Destination", destinationSchema);
