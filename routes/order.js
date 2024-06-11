const express = require('express');
const router = express.Router();
const api_order = require('../controllers/api.order');

router.post('/create_payment_cod/:userID', api_order.create_payment_cod)



// VNPAY
router.post('/create_payment_url/:userID', api_order.create_payment_url)
router.get('/vnpay_return', api_order.vnpay_return)



// MOMO
router.post('/create_payment_url_momo', api_order.create_payment_url_momo)
router.post('/momo_return', api_order.momo_return)


module.exports = router;