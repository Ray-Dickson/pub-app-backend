const router = require('express').Router()
const Customers = require('../db/models/customers')
const auth = require('../middlewares/authentication')
require('mongoose')


//create a new customer
router.post('/addcustomers', auth, async (req, res)=>{
    const customer = new Customers({
        ...req.body,
        createdBy: req.user._id
    })

    try {
        await customer.save()
        res.status(201).json({
            message: 'Customer created succesfully',
            customer})
    } catch (e) {
        res.status(400).json({message: e.message})
    }
})

//get all customers
router.get('/', auth, async(req, res)=>{
    try{
        const myCustomers = await Customers.find()
        res.status(200).send(myCustomers)
    }catch(e){
        res.status(500).json({message: e.message})
    }
    
})



module.exports = router