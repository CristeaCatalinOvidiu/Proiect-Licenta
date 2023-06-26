import mongoose from 'mongoose'

const {Schema, model} = mongoose


const userSchema = new Schema({
    name: {
        type: String,
        required: [true, "Please enter your name!"],
        trim: true,
        unique: true
    }, 
    email: {
        type: String,
        required: [true, "Please enter your email!"],
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: [true, "Please enter your password!"],
        trim: true
    },
    role: {
        type: Number,
        default: 0
    },
    image: {
       type: String,
       default: "https://res.cloudinary.com/devatchannel/image/upload/v1602752402/avatar/avatar_cugq40.png"
    },
    bag: {
        type: Array,
    },
updated: Date,
created: {
        type: Date,
        default: Date.now
}})





export const User = model("User", userSchema)


const productS = new Schema({
    iid:{
        type: String,
        unique: true,
        trim: true,
        required: [true, 'Product must have an item id (iid)']
    },
    nr:{
        type: Number,
        default: 0
    },
    sold:{

        type: Number,
        default: 0

    },
    vendorId:{
        type:String
    },
    depositId:{
        type:String
    },
    type:{
        type: String,
        unique:true,
        trim: true,
        required: [true, 'Product must have a name']
    },
    about:{
        type: String,
        required: true
    },
    offer:{
        type: Number,
        trim: true,
        required: [true, 'Product must have a price']
    },
    
    details:{
        type: String,
        required: [true, 'Product must have details']
    },
    photo:{
        type: Object,
        required: [true, 'Product must have a photo, url and publ_id']
    },
    typo:{
        type: String,
        required: [true, 'Product must have a type']
    },
    checked:{
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
   } ,
    {timestamps:true}
)


export const product =  model("product", productS)


const newpS = new Schema({

    newp_t: {
        type: String,
        default:"lala"
    },
updated: Date,
created: {
    type: Date,
    default: Date.now
}
})



export const newp = model("newp", newpS)


export const moneyAccountS = new Schema({



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

export const maccount = model("maccount", moneyAccountS)