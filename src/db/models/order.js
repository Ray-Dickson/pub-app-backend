const mongoose = require('mongoose')

const orderSchema = mongoose.Schema({
    orderedBy:{
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'customers' 
    },
    servedBy:{
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    customerOrders: [{
        itemName: {
            type: String,
            required: true
        },
        totalPrice: {
            type: Number,
            required: true
        },
        quantity:{
            type: Number,
            required: true
        },
        tableNumber: Number,
        date:{
            type: Date,
            default: Date.now
        }
    }],
    amountPaid:{
        type: Number,
        default: 0
    },
    amountOwing:{
        type: Number,
        default: 0
    }  
})

const order = mongoose.model('orders', orderSchema)

module.exports = order