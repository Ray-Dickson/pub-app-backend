const Orders = require('../db/models/order')

const orderId = async(req, res, next)=>{
    let order 
    try{
        order = await Orders.findById(req.params.id)
        if(!order){
            return res.status(404).json({message: 'Order not found'})
        }
    }catch(e){
        return res.status(500).json({
            message: 'Order not found',
            errorMessage: e.message
        })
    }
    res.order = order
    next()
}
module.exports = orderId