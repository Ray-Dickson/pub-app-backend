const router = require("express").Router()
require('../db/database')
const User = require('../db/models/users')
const findId = require('../middlewares/find-id')
const auth = require('../middlewares/authentication')

//creating new user
router.post('/register', async(req, res)=>{
    const user = new User(req.body)
    try{
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).json({
            message: 'You succesfully signed up',
            user,
            token
        })
    }catch(e){
        res.status(400).json({message: e.message})
    }
})

//loging in a user
router.post('/login', async(req, res)=>{
    try{
        const user = await User.findBycredentials(req.body.phone, req.body.password)
        const token = await user.generateAuthToken()
        res.status(201).json({
            mesaage: 'Login succesfull',
            user,
            token
        })
    }catch(e){
        res.status(400).json({
            mesaage: 'Unable to login',
            errorMessage: e.mesaage
        })
    }
})

//geting all users
router.get('/me', auth, async(req, res)=>{
    res.send(req.user)
})

//searh for a user by id
router.get('/:id', findId, (req, res)=>{
    res.json(res.user)
})

//find user by id and update
router.patch('/:id', [findId, auth], async (req, res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'phone', 'password']
    const isValidUpdate = updates.every((update) => allowedUpdates.includes(update))
    if(!isValidUpdate){
        return res.status(404).json({message: 'Invalid update'})
    }
    try{
        updates.forEach((update)=> res.user[update] = req.body[update] )
        await res.user.save()
        res.json({
            message: 'update succesfully made',
            user: res.user
        })
    }catch(e){
        res.status(400).json({message: e.message })
    }
})

//find user by id and delete
router.delete('/:id', findId, async (req, res)=>{
    try{
        await res.user.delete()
        res.status(200).json({message: 'User deleted succesfully'})
    }catch(e){
        res.status(500).json({message: e.message})
    }
})

 module.exports = router