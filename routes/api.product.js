const express = require('express');
const router = express.Router();



const api_product = require('../controllers/api.product');





router.get('/getAll', api_product.getAll);
router.get('/search/name/:nameProduct', api_product.getByName);
router.get('/search/brand/:brandProduct', api_product.getByBrand);
router.get('/search/price', api_product.getByPrice);
router.get('/search/name/', api_product.getAll);
router.get('/search/brand/', api_product.getAll);
router.get('/:productId', api_product.getById);
router.get('/category/:categoryId', api_product.getByIdCategory);




module.exports = router;
