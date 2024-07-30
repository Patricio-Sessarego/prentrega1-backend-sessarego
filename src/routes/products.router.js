const ProductsManagerFs = require('../managers/fileSystem/proudcts.managers')
const { Router } = require('express')

const router = Router()
const productService = new ProductsManagerFs

//GET
router.get('/' , async (req , res) => {
    try{
        const products = await productService.getProducts()

        if(products.length == 0){
            res.status(400).send({message: "NO HAY PRODUCTOS CARGADOS" , status: 'error'})
        }else{
            res.status(200).send({status: 'success' , data: products})
        }
    }catch(error){
        console.error(error)
    }
})

router.get('/:pid' , async (req , res) => {
    try{
        const { pid } = req.params //AGARRAMOS EL PARAMETRO 'pid'
        const response = await productService.getProduct(pid)

        if(response == -1){
            res.status(400).send({message: "NO SE ENCONTRO UN PRODUCTO CON ESE ID" , status: 'error'})
        }else{
            res.status(200).send({status: 'success' , data: response})
        }
    }catch(error){
        console.error(error)
    }
})

//POST
router.post('/' , async (req , res) => {
    try{
        const { body } = req    
        if(!body.code || !body.title || !body.stock || !body.price || !body.category || !body.description){
            return res.status(400).send({message: "LLENDAR TODOS LOS CAMPOS" , status: 'error'})
        }
        
        const response = await productService.createProduct(body)

        if(response == -1){
            res.status(400).send({message: "EL CODIGO DEL PRODUCTO YA EXISTE" , status: 'error'})
        }else{
            res.status(200).send({message: "PRODUCTO AGREGADO CORRECTAMENTE" , status: 'success' , data: response})
        }
    }catch(error){
        console.error(error)
    }
})

//DELETE
router.delete('/:pid' , async (req , res) => {
    try{
        const { pid } = req.params //AGARRAMOS EL PARAMETRO 'pid'
        const response = await productService.deleteProduct(pid)

        if(response == -1){
            res.status(400).send({message: "NO SE ENCONTRO UN PRODUCTO CON ESE ID" , status: 'error'})
        }else{
            res.send({message: "PRODUCTO DADO DE BAJA CORRECTAMENTE" , status: 'success' , data: response})
        }
    }catch(error){
        console.error(error)
    }
})

//PUT
router.put('/:pid' , async (req , res) => {
    try{
        const { pid } = req.params//AGARRAMOS EL PARAMETRO 'pid'
        const { body } = req

        const product = await productService.getProduct(pid)

        if(product == -1){
            return res.status(400).send({message: "NO SE ENCONTRO UN PRODUCTO CON ESE ID" , status: 'error'})
        }

        if(!body.title && !body.price && !body.stock && !body.category && !body.description){
            return res.status(400).send({message: "LLENAR AL MENOS UN CAMPO" , status: 'error'})
        }

        if(body.title){
            product.title = body.title
        }

        if(body.price){
            product.price = body.price
        }

        if(body.stock){
            product.stock = body.stock
        }

        if(body.category){
            product.category = body.category
        }

        if(body.description){
            product.description = body.description
        }

        const response = await productService.updateProduct(product)

        return res.status(200).send({message: "PRODUCTO MODIFICADO CORRECTAMENTE" , status: 'success' , data: response})
    }catch(error){
        console.error(error)
    }
})

module.exports = router