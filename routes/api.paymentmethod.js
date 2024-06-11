const express = require('express');
const router = express.Router();



const api_paymentmethod = require('../controllers/api.paymentmethod');







router.get('/getAll', api_paymentmethod.getAll);




module.exports = router;
