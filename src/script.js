const express = require('express')

const app = express()
const PORT = 8080

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const producstRouter = require('./routes/products.router')
const cartsRouter = require('./routes/carts.router')
app.use('/api/products' , producstRouter)
app.use('/api/carts' , cartsRouter)

app.listen(PORT , () => {
    console.log(`ESCUCHANDO EN EL PUERTO ${PORT}`)
})