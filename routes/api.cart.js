const express = require('express');
const router = express.Router();



const api_cart = require('../controllers/api.cart');







router.get('/getAll', api_cart.getAll);
router.post('/addCart', api_cart.addCart);
router.get('/:cartId', api_cart.getById);
router.get('/u/:userId', api_cart.getByUserId);
router.put('/updateCart/:cartId', api_cart.updateById);
router.delete('/delCart/:cartId', api_cart.deleteById);




module.exports = router;
