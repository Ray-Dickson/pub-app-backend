const mongoose = require('mongoose')
const validator = require('validator')

const userSchema = mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    phone:{
        type: Number,
        required: true
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
    }
})

const User = mongoose.model('Users', userSchema) 

module.exports = User