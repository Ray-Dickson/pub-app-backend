const mongoose = require('mongoose')

const orderSchema = mongoose.Schema({
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
    tableNumber: Number,
}, {
    timestamps: true
})

const order = mongoose.model('orders', orderSchema)

module.exports = order