import mongoose from 'mongoose'

const {Schema, model} = mongoose

export const adminTransactionsSchema = new Schema({


    status:{
        type: Number,
        default: 0
    },
    mid:{
        type: String,
        required:[true, 'mid required']
    },
    uname:{
        type:String,
        default:'guest'
    },
    uid: {
        type:String
    },
    toemail:{
        type:String,
       
        required: [true, 'Must have an email']
    },
    dest:{
        type:Object
    },
    destid:{
        type:String

    },
    start:{
        type:Boolean,
        required: [true, 'must have a start for transaction'],
        default:false
    },
    isActive:{
        type:Boolean,
        default:false
    },
     bag:{
        type:Array
    }
    
}, {
    timestamps: true
})

export const admintranscations =  model("admintransactions", adminTransactionsSchema)
