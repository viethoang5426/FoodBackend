const express = require('express');
const router = express.Router();


const api_otp = require('../controllers/api.otp');

router.post("/sendotp", api_otp.sendotp);
router.post("/verifyotp", api_otp.checkOTP);


module.exports = router;
