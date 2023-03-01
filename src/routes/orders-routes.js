const Orders = require('../db/models/order')
const auth = require('../middlewares/authentication')
const findCustomerId = require('../middlewares/find-customer-id')
const orderId = require('../middlewares/find-order-id')
const router = require('express').Router()


//Make a new oder
router.post('/new-order/:id', auth, findCustomerId, async(req, res)=>{
    const order = new Orders({
        ...req.body,
        servedBy: req.user._id,
        orderedBy: res.customer._id
    })
    try{
        await order.save()
        res.customer.ordersMade.push(order._id)
        res.customer.totalOrders += order.totalPrice
        res.customer.totalOwing += order.totalPrice
        await res.customer.save()
        res.status(200).json({
            message: 'Order succesfully placed',
            order
        })
    }catch(e){
        res.status(404).json({message: e.message})
   }
})

//Get all orders made
router.get('/', auth, async(req, res)=>{
    try{
        const allOrders = await Orders.find({servedBy: req.user._id})
        if(!allOrders){
           return  res.status(400).json({message: 'No orders found'})
        }
        res.status(200).send(allOrders)
    }catch(e){
        res.status(500).json({message: e.message})
    }
})

//Get order by Id
router.get('/:id', [auth, orderId], async(req, res)=>{

    try{
        const order = await Orders.findOne({_id: res.order._id, servedBy: req.user._id})
        if(!order){
            throw new Error('Order not found')
        }
        res.status(200).send(order)
    }catch(e){
        res.status(500).json({message: e.message})
    }

    //res.send(res.order)
})

//find order by Id and update
router.patch('/:id',[auth, orderId], async(req, res)=>{
    if(req.body.itemName){
        res.order.itemName = req.body.itemName
    }
    if(req.body.totalPrice){
        res.order.totalPrice = req.body.totalPrice
    }
    if(req.body.quantity){
        res.order.quantity = req.body.quantity
    }
    if(req.body.tableNumber){
        res.order.tableNumber = req.body.tableNumber
    }
    try{
        const order = await Orders.findOne({_id: res.order._id, servedBy: req.user._id})
        if(!order){
            return res.status(404).json({message: 'order not found'})
        }
        const updatedOrder = await res.order.save()
        res.status(200).json({
            message: 'order updated succesfull',
            order: updatedOrder
        })
    }catch(e){
        res.status(400).json({message: e.message})
    }
})

//Get order by Id and delete
router.delete('/:id', [auth, orderId], async(req, res)=>{
    try{
        const order = await Orders.findOneAndDelete({_id: res.order._id, servedBy: req.user._id})
        if(!order){
           return  res.status(404).json({message: 'Order not found'})
        }
        res.status(200).json({message: 'Order deleted succesfully'})
    }catch(e){
        res.status(500).json({
            errorMessage: e.message,
            message: 'Cannot delete'
        })
    }
})

module.exports = router