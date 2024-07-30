const fs = require('fs')
const path = './src/jsonFiles/carts.json'
const ProductsManagerFs = require('../fileSystem/proudcts.managers')

const productService = new ProductsManagerFs

class CartManagerFs{
    constructor(){
        this.path = path
    }

    //GET
    getCart = async (id) => {
        try{
            const carts = await this.readCarts()
            let cartFound = false
            let cartId
            carts.forEach((cart) => {
                if(cart.id == id){
                    cartFound = true
                    cartId = cart
                }
            })

            if(cartFound){
                return cartId.products //SI EXISTE EL CARRITO DEVOLVEMOS SUS PRODUCTS
            }else{
                return -1 //SI NO EXISTE EL PRODUCTO DEVOLVEMOS -1
            }
        }catch(error){
            console.error(error)
        }
    }

    readCarts = async () => {
        try{
            if(fs.existsSync(path)){
                const cartsJson = await fs.promises.readFile(path , 'utf-8')
    
                const cartsJs = JSON.parse(cartsJson)
    
                return cartsJs //CARRITOS EN JS
            }
    
            return [] //SI NO EXISTE
        }catch(error){
            console.error(error)

            return []
        }
    }

    //POST
    createCart = async () => {
        try{
            const carts = await this.readCarts()

            const newCart = {
                id: carts.length + 1,
                products: []
            }

            carts.push(newCart)
            await fs.promises.writeFile(path , JSON.stringify(carts , null , '\t'))

            return(newCart) //DEVOLVEMOS EL NUEVO CARRITO
        }catch(error){
            console.error(error)
        }
    }

    createProductCart = async (cId , pId) => {
        try{
            const carts = await this.readCarts()
            let productFound = false
            let cartFound = false
            let updatedCart
    
            const isExistProd = await productService.getProduct(pId)
            if(isExistProd == -1){ //SI NO EXISTE EL PRODUCTO
                return -1
            }
    
            carts.forEach((cart) => {
                if(cart.id == cId){
                    cartFound = true
                    
                    cart.products.forEach((cartProduct) => {
                        if(cartProduct.productId == pId){ //SI YA EXISTE EL PRODUCTO EN EL CARRITO
                            cartProduct.quantity++
                            productFound = true
                            updatedCart = cart
                        }
                    })

                    if(!productFound){ //SI NO EXISTE EL PRODUCTO EN EL CARRITO
                        cart.products.push({productId: pId , quantity: 1})
                        updatedCart = cart
                    }
                }
            })

            if(cartFound){ //SI EXISTE EL CARRITO
                await fs.promises.writeFile(path , JSON.stringify(carts , null , '\t'))
                return updatedCart
            }
    
            return -2 //SI NO EXISTE EL CARRITO
        }catch(error){
            console.error(error)
        }
    }
}

module.exports = CartManagerFs