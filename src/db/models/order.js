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
    tableNumber: Number,
    //orderedBy: reference the customer id
    //servedBy: reference the user id
}, {
    timestamps: true
})

const order = mongoose.model('orders', orderSchema)

module.exports = order