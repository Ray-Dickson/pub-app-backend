const mongoose = require('mongoose')


const customerSchema = mongoose.Schema({
    name:{
        type: String,
        required: false
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
   createdBy:{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Users'
   }
}, {
    timestamps: true
})

const customer = mongoose.model('customers', customerSchema)

module.exports = customer
