const User = require('../db/models/users')


//middleware for finding user by id
const findId = async (req, res, next)=>{
    let user
    try{
        user = await User.findById(req.params.id)
        if(!user){
            return res.status(404).json({message: 'User not found'})
        }
    }catch(e){
        return res.status(500).json({
            message: e.message,
            errorMessage: 'User not found'
        })
    }

    res.user = user

    next()
}

module.exports = findId