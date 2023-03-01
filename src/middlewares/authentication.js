const jwt = require('jsonwebtoken')
const User = require('../db/models/users')
require("dotenv").config()

const auth = async(req, res, next)=>{
    try{
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.SECRETE)
        const user = await User.findOne({userId: decoded._id, 'tokens.token': token})

        if(!user){
            throw new Error()
        }
        req.token = token
        req.user = user
        next()
    }catch(e){
        res.status(401).json({message: 'You are not authenticated'})
    }
}

module.exports = auth