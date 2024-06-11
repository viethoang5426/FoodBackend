const express = require('express');
const router = express.Router();



const api_orderdetail = require('../controllers/api.orderdetail');








router.get('/:orderID', api_orderdetail.getByIdOrder);





module.exports = router;
