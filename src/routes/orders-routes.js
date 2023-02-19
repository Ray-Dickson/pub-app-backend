const { model } = require('mongoose')
const Order = require('../db/models/order')
const router = require('express').Router()

router.post('/order', (req, res)=>{
    const order = new Order(req.body)
    order.save().then(()=>{
        res.send(order)
    }).catch((e)=>{
        res.send(e)
    })
})

module.exports = router