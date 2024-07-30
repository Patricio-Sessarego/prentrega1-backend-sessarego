const CartsManagerFs = require('../managers/fileSystem/carts.managers')
const { Router } = require('express')

const router = Router()

module.exports = router
const cartService = new CartsManagerFs

//GET
router.get('/:cid' , async (req , res) => {
    try{
        const { cid } = req.params //AGARRAMOS EL PARAMETRO 'cid'
        const response = await cartService.getCart(cid)

        if(response == -1){
            res.status(400).send({message: "NO SE ENCONTRO UN CARRITO CON ESE ID" , status: 'error'})
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
        const response = await cartService.createCart()
        res.status(200).send({message: "CARRITO AGREGADO CORRECTAMENTE" , status: 'success' , data: response})
    }catch(error){
        console.error(error)
    }
})

router.post('/:cid/product/:pid' , async (req , res) => {
    try{
        const { cid , pid } = req.params //AGARRAMOS LOS PARAMETROS 'cid' Y 'pid'
        const response = await cartService.createProductCart(cid , pid)

        if(response == -1){
            res.status(400).send({message: "NO SE ENCONTRO UN PRODUCTO CON ESE ID" , status: 'error'})
        }else if(response == -2){
            res.status(400).send({message: "NO SE ENCONTRO UN CARRITO CON ESE ID" , status: 'error'})
        }else{
            res.status(200).send({message: "PRODUCTO AGREGADO AL CARRITO CORRECTAMENTE" , status: 'success' , data: response})
        }
    }catch(error){
        console.error(error)
    }
})

module.exports = router