const router = require('express').Router()
const Customer = require('../db/models/customers')
const Orders = require('../db/models/order')
const auth = require('../middlewares/authentication')
const findCustomerId = require('../middlewares/find-customer-id')
const findOrderId = require('../middlewares/find-order-id')


// add orders to customer outstanding orders
router.post('/add-orders/:id', [auth, findCustomerId], async (req, res) => {

    try {
        const orders = await Orders.find({ servedBy: req.user._id, orderedBy: res.customer._id })

        if (orders.length === 0) {
            return res.json({ message: 'No orders found' })
        }

        let outstandingOrder
        for (const order of orders) {
            if (order.amountOwing > 0) {
                outstandingOrder = order
                break
            }
        }

        if (!outstandingOrder) {
            return res.json({ message: 'No outstanding orders' })
        }


        outstandingOrder.customerOrders.push(req.body)
        outstandingOrder.amountOwing = outstandingOrder.amountOwing + req.body.totalPrice

        await Orders.updateOne({ _id: outstandingOrder._id }, { $set: outstandingOrder })

        req.user.totalSalesMade = req.user.totalSalesMade + req.body.totalPrice
        req.user.ordersCount = req.user.ordersCount + 1
        res.customer.totalOrders = res.customer.totalOrders + req.body.totalPrice
        res.customer.totalOwing = res.customer.totalOwing + req.body.totalPrice

        await req.user.save()
        await res.customer.save()

        res.status(200).json({
            message: 'Order added successfully',
            order: outstandingOrder
        })

    } catch (e) {
        res.json({ errorMessage: e.message })
    }
})


// Make payment to outstanding orders
router.post('/make-payment/:id', [auth, findOrderId], async(req, res) =>{
    const amount = req.body.amount
    try{

        const customer = await Customer.findOne({_id: res.order.orderedBy})
        if(!customer){
            return res.json({message: 'Customer not found'})
        }

        res.order.amountOwing = res.order.amountOwing - amount
        res.order.amountPaid = res.order.amountPaid + amount
        await res.order.save()

        customer.totalOwing = customer.totalOwing - amount
        customer.totalPaid = customer.totalPaid + amount
        customer.numberOfPayments.push({amount})
        await customer.save()
        
        res.status(200).json({message: `Amount of ${amount} has succesfully been paid`})


    }catch(e){
        res.status(404).json({errorMessage: e.message})
    }
})

// All orders that has not been paid for
router.get('/outstandings', auth, async(req, res)=>{
    try{
        const orders = await Orders.find({servedBy: req.user._id})
        if(orders.length === 0){
            return res.json({message: 'No active orders available'})
        }

        const activeOrders = orders.filter((order)=>{
            return order.amountOwing > 0
        })

        if(activeOrders.length === 0){
            return res.json({message: 'No active orders available'})
        }
        res.status(200).json({activeOrders})
        console.log(activeOrders.length)
    }catch(e){
        res.status(400).json({errorMessage: e.message})
    }
})




module.exports = router