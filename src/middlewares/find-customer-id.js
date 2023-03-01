const Customers = require('../db/models/customers')

const findCustomerId = async(req, res, next)=>{
    let customer
    try{
        customer = await Customers.findById(req.params.id)
        if(!customer){
            return res.status(404).json({message: 'Customer not found'})
        }
    }catch(e){
        res.status(500).json({
            message: e.message,
            errorMessage: 'Customer not found'
        })
    }
    res.customer = customer

    next()
}

module.exports = findCustomerId