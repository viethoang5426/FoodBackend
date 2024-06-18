const express = require('express');
const router = express.Router();



const api_order = require('../controllers/api.order');






router.get('/', api_order.getAllOrder);

router.get('/u/:userID', api_order.getByIdUser);

router.put('/edit/:orderID', api_order.putOrderStatus);

router.delete('/del/:orderID', api_order.delOrderById);






module.exports = router;
