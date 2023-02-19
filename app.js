const express = require('express')
const bodyParser = require('body-parser')
const userRoutes = require('./src/routes/users-routes')
const customersRoutes = require('./src/routes/customers-routes')
const orderRoutes = require('./src/routes/orders-routes')

app = express()
port = process.env.PORT || 3000

app.use(express.json())
app.use(bodyParser.urlencoded({
    extended: true
}))

app.use(bodyParser.json())

app.use('/users', userRoutes)
app.use('/customers', customersRoutes)
app.use(orderRoutes)




app.listen(port, ()=>{
    console.log(`App is running of port ${port}`)
})