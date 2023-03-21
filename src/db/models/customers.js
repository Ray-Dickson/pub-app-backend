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
   },
   ordersMade:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'orders'
   }],
   totalOrders:{
    type: Number,
    default: 0
   },
   totalOwing:{
    type: Number,
    default: 0
   },
   totalPaid:{
    type: Number,
    default: 0
   },
   numberOfPayments: [{
    amount: Number,
    date:{
        type: Date,
        default: Date.now
    }
   }]
}, {
    timestamps: true
})


const customer = mongoose.model('customers', customerSchema)

module.exports = customer
