const express = require('express');
const router = express.Router();



const api_order = require('../controllers/api.order');








router.get('/u/:userID', api_order.getByIdUser);






module.exports = router;
