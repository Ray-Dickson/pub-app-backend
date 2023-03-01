const router = require('express').Router()
const Customer = require('../db/models/customers')
const auth = require('../middlewares/authentication')
const findCustomerId = require('../middlewares/find-customer-id')
require('mongoose')


//create a new customer
router.post('/addcustomer', auth, async (req, res)=>{
    const customer = new Customer({
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
        const myCustomers = await Customer.find()
        res.status(200).send(myCustomers)
    }catch(e){
        res.status(500).json({message: e.message})
    }
    
})

//find customer by Id

router.get('/:id', [auth,findCustomerId], (req, res)=>{
    res.send(res.customer)
})

//find a customer by id and update
router.patch('/:id', [auth, findCustomerId], async(req, res)=>{
    if(req.body.name){
        res.customer.name = req.body.name
    }
    if(req.body.phone){
        res.customer.phone = req.body.phone
    }
    try{
        const updatedCustomer = await res.customer.save()
        res.status(200).json({
            message: 'customer updated sucussfull',
            customer: updatedCustomer
    })
    }catch(e){
        res.status(400).json({message: e.message})
    }  
})

//find customer by id and delete
router.delete('/:id', [auth, findCustomerId], async(req, res)=>{
    try{
        await res.customer.delete()
        res.status(200).json({message: 'Customer deleted sucessfully'})
    }catch(e){
        res.status(400).json({message: e.message})

    }
})

//making of payment by customer
router.post('/:id/make-payment', [auth, findCustomerId], async(req, res)=>{
    try{
        const amount = req.body.amount
        res.customer.totalOwing -= amount
        res.customer.totalPaid += amount
        res.customer.numberOfPayments.push({amount})
        res.customer.save()
        res.status(200).json({message: `Amount of ${amount} has succesfully been paid`})
    }catch(e){
        res.status(404).json({
            errorMessage: e.message,
            message: 'Payment unsuccesful'
        })
    }
})



module.exports = router