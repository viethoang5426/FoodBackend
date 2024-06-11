const express = require("express");
const router = express.Router();

const api_category = require("../controllers/api.category");

const apiUserRoute = require("./api.user");
const apiProductRoute = require("./api.product");
const apiCartRoute = require("./api.cart");
const apiOrderRoute = require("./api.order");
const apiOrderDetailRoute = require("./api.orderdetail");
const apiPaymentMethod = require("./api.paymentmethod");

router.use("/u", apiUserRoute);
router.use("/product", apiProductRoute);
router.use("/cart", apiCartRoute);
router.use("/order", apiOrderRoute);
router.use("/orderDetail", apiOrderDetailRoute);
router.use("/paymentmethod", apiPaymentMethod);

router.get("/category/getAll", api_category.getAll);

module.exports = router;
