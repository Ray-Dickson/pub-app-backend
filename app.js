require('./src/db/database')
const express = require('express')
const bodyParser = require('body-parser')
const User = require('./src/db/models/users')

app = express()
port = process.env.PORT || 3000

app.use(express.json())
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(bodyParser.json())

app.post('/register', (req, res)=>{
   const user = new User(req.body)
   user.save().then((user)=>{
    res.send(user)
   }).catch((e)=>{
    res.send(e)
   })
    
})




app.listen(port, ()=>{
    console.log(`App is running of port ${port}`)
})