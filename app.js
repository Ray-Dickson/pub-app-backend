const express = require('express')
const bodyParser = require('body-parser')
const userRoutes = require('./src/routes/users-routes')
const customersRoutes = require('./src/routes/customers-routes')
const orderRoutes = require('./src/routes/orders-routes')
const activeRoutes = require('./src/routes/active-orders')
const cors = require('cors')


app = express()
app.use(cors())
port = process.env.PORT || 3000


app.use(express.json())
app.use(bodyParser.urlencoded({
    extended: true
}))

app.use(bodyParser.json())

app.use('/users', userRoutes)
app.use('/customers', customersRoutes)
app.use('/orders', orderRoutes)
app.use('/active-orders', activeRoutes)




app.listen(port, ()=>{
    console.log(`App is running on port ${port}`)
})