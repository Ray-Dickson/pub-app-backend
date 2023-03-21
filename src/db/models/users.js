const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require("dotenv").config()

const userSchema = mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    phone:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true,
        trim: true,
        validate(value){
            if(value.length <= 6){
                throw new Error ('Password weak! Please enter 7 or more characters.')
            }
        }
    },
    totalSalesMade: {
        type: Number,
        default: 0
    },
    ordersCount: {
        type: Number,
        default: 0
    },
    tokens: [{
        token:{
            type: String,
            required: true
        }
    }]   
}, {
    timestamps: true
})

userSchema.methods.toJSON = function(){
    const user = this

    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject
}

userSchema.methods.generateAuthToken = async function(){
    const user = this
    const token = jwt.sign({userId: user._id.toString()}, process.env.SECRETE)

    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}

userSchema.statics.findBycredentials = async(phone, password)=>{
    const user = await User.findOne({phone})
    if(!user){
        throw new Error('Unable to login')
    }

    const isMatchPassword = await bcrypt.compare(password, user.password)
    if(!isMatchPassword){
        throw new Error('Unable to login')
    }

    return user
}


// Hashing plain text password before saving
userSchema.pre('save', async function(next){
    const user = this

    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 7)
    }
    next()
})

const User = mongoose.model('Users', userSchema) 

module.exports = User