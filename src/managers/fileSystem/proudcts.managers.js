const fs = require('fs')
const path = './src/jsonFiles/products.json'

class ProductsManagerFs{
    constructor(){
        this.path = path
    }

    //GET
    getProduct = async (id) => {
        try{
            const products = await this.getProducts()
            let productFound = false
            let prod
            products.forEach((product) => {
                if(product.id == id){
                    productFound = true
                    prod = product
                }
            })

            if(productFound){ //SI EXISTE EL PRODUCTO LO DEVOLVEMOS
                return prod
            }else{
                return -1 //SI NO EXISTE EL PRODUCTO DEVOLVEMOS -1
            }
        }catch(error){
            console.error(error)
        }
    }

    getProducts = async () => {
        try{
            const products = await this.readProducts()
            const activeProducts = products.filter((product) => product.status)

            return activeProducts //DEVOLVEMOS LOS PRODUCTOS CON STATUS = TRUE
        }catch(error){
            console.error(error)

            return []
        }
    }

    readProducts = async () => {
        try{
            if(fs.existsSync(path)){
                const productsJson = await fs.promises.readFile(path , 'utf-8')
    
                const productsJs = JSON.parse(productsJson)
    
                return productsJs //PRODUCTOS EN JS
            }
    
            return [] //SI NO EXISTE
        }catch(error){
            console.error(error)

            return []
        }
    }

    //POST
    createProduct = async (newProduct) => {
        try{
            const products = await this.readProducts()
            let dupCode = false
            products.forEach((product) => {
                if(product.code === newProduct.code){
                    dupCode = true
                }
            })

            if(dupCode){ //SI EL CODIGO YA EXISTE
                return -1
            }

            newProduct.id = products.length + 1
            newProduct.status = true

            products.push(newProduct)
            await fs.promises.writeFile(path , JSON.stringify(products , null , '\t'))

            return (newProduct) //DEVOLVEMOS EL NUEVO PRODUCTO
        }catch(error){
            console.error(error)
        }
    }

    //DELETE
    deleteProduct = async (id) => {
        try{
            const products = await this.readProducts()
            let productFound = false
            let deletedProduct
            products.forEach((product) => {
                if(product.id == id && product.status){
                    productFound = true
                    product.status = false
                    deletedProduct = product
                }
            })

            if(productFound){
                await fs.promises.writeFile(path , JSON.stringify(products , null , '\t'))
                return deletedProduct //SETEAMOS EL STATUS EN FALSE
            }

            return -1 //SI NO SE ENCONTRO
        }catch(error){
            console.error(error)
        }
    }

    //PUT
    updateProduct = async (updatedProduct) => {
        try{
            const products = await this.readProducts()

            products.forEach((product) => {
                if(product.id == updatedProduct.id){
                    product.title = updatedProduct.title
                    product.price = updatedProduct.price
                    product.stock = updatedProduct.stock
                    product.category = updatedProduct.category
                    product.description = updatedProduct.description
                }
            })

            await fs.promises.writeFile(path , JSON.stringify(products , null , '\t'))

            return updatedProduct //DEVOLVEMOS EL PRODUCTO ACTUALIZADO
        }catch(error){
            console.error(error)
        }
    }
}

module.exports = ProductsManagerFs