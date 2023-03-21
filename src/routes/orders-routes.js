const Orders = require('../db/models/order')
const auth = require('../middlewares/authentication')
const findCustomerId = require('../middlewares/find-customer-id')
const orderId = require('../middlewares/find-order-id')
const router = require('express').Router()


//Make a new oder
router.post('/new-order/:id', [auth, findCustomerId], async(req, res)=>{

    try{
            const customerActiveOrder = await Orders.find({servedBy: req.user._id, orderedBy: res.customer._id})
    
            const activeOrders = customerActiveOrder.filter((order)=>{
                return order.amountOwing > 0
                })
            if(activeOrders.length === 0){
                const servedOrder = new Orders({ 
                servedBy: req.user._id,
                orderedBy: res.customer._id,
                customerOrders: [{
                    ...req.body,
                    }]
                })
            await servedOrder.save()
            res.customer.ordersMade.push(servedOrder._id)
            
            //updating customer who made the order his amount owing and total amount of orders made
            servedOrder.customerOrders.forEach(async(order)=>{
                res.customer.totalOrders = res.customer.totalOrders + order.totalPrice
                res.customer.totalOwing = res.customer.totalOwing + order.totalPrice
                servedOrder.amountOwing = servedOrder.amountOwing + order.totalPrice
                req.user.totalSalesMade = req.user.totalSalesMade + order.totalPrice
                req.user.ordersCount = req.user.ordersCount + 1
            })
            await servedOrder.save()
            await req.user.save()
            await res.customer.save()
            res.status(200).json({
                message: 'Order succesfully placed',
                servedOrder
            })
        }else{
            return res.json({
                message: 'Customer has active order',
                activeOrders
            })
        }
    }catch(e){
        res.status(404).json({message: e.message})
        }  
})

//Get all orders made
router.get('/', auth, async(req, res)=>{
    try{
        const orders = await Orders.find({ servedBy: req.user._id }).populate('orderedBy', 'name phone totalOwing')
        if(!orders){
           return res.json({message: 'No orders to show'})
        }
        res.json({orders})
    }catch(e){
        res.status(500).json({message: e.message})
    }
})


//Get order by Id
router.get('/:id', [auth, orderId], async(req, res)=>{
    try{
        res.status(200).json(res.order)
    }catch(e){
        res.status(500).json({message: e.message})
    }
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