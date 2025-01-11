
let express = require('express');
let dateFormat = require('date-format')
let moment = require('moment')
var config = require('../config/default.json');
const crypto = require('crypto');
const { urlencoded } = require('body-parser');
const mongoose = require('mongoose');
const axios = require('axios');
let mdOrder = require('../models/order.model')
let mdOrderDetail = require('../models/orderDetail.model')
let mdPaymentMethod = require('../models/paymentMethod.model')
let mdProduct = require('../models/product.model')
let mdCart = require('../models/cart.model')
let mdUser = require('../models/user.model')
const moment2 = require('moment-timezone');
const timeZone = 'Asia/Ho_Chi_Minh';
var now = moment2().tz(timeZone);





//==
function sortObject(obj) {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}


let globalCartID;
let globalUserID;
let globalAmount;
let globalPaymenthemodID;


const create_payment_url = async (req, res, next) => {
    var ipAddr =
        req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

    var tmnCode = config.vnp_TmnCode
    var secretKey = config.vnp_HashSecret
    var vnpUrl = config.vnp_Url
    var returnUrl = config.vnp_ReturnUrl


    var date = new Date();
    let createDate = moment(date).format('YYYYMMDDHHmmss');
    var orderId = dateFormat(date, 'HHmmss');

    let userID = req.params.userID;
    let cartID = req.body.cartID;
    let PaymentMethodID = req.body.PaymentMethodID;
    let amount = 0;


    try {
        if (!mongoose.Types.ObjectId.isValid(userID) || !mongoose.Types.ObjectId.isValid(PaymentMethodID)) {
            return res.status(400).json({ status: 0, msg: 'iduser hoặc PaymentMethodID không hợp lệ' });

        }

        const finUser = await mdUser.userModel.findById(userID);
        const finPaymentMethod = await mdPaymentMethod.paymentMethodModel.findById(PaymentMethodID);

        if (finPaymentMethod.MethodName != 'VNPAY') {
            return res.status(400).json({ status: 0, msg: 'truyền đúng paymentmethod id có name VNPAY' });
        }




        if (!cartID || !Array.isArray(cartID) || !finUser) {
            return res.status(400).json({ status: 0, msg: 'Dữ liệu giỏ hàng hoặc user không hợp lệ' });
        }


        for (const itemCart of cartID) {
            if (!mongoose.Types.ObjectId.isValid(itemCart)) {
                return res.status(400).json({ status: 0, msg: 'idcart không hợp lệ' });
            }


            const fincart = await mdCart.cartModel.findById(itemCart);


            if (!fincart) {
                return res.status(400).json({ message: 'Không tìm thấy sản phẩm trong giỏ hàng ' });
            }
            const findProduct = await mdProduct.productModel.findById(fincart.ProductID);
            if (findProduct.StockQuantity <= 0 && itemCart.Quantity > findProduct.StockQuantity) {

                return res.status(400).json({ message: 'số lượng sản phẩm đã hết hoặc không đủ' });
            }

            amount += findProduct.Price;

        }
    } catch (error) {
        return res.status(404).json({ status: 0, error: "Đã xảy ra lỗi " + error.message });
    }



    globalCartID = cartID;
    globalAmount = amount;
    globalUserID = userID;
    globalPaymenthemodID = PaymentMethodID;


    let locale = req.body.language;
    if (locale === null || locale === '' || locale === undefined) {
        locale = 'vn';
    }

    var currCode = 'VND';
    var vnp_Params = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode;
    vnp_Params['vnp_Locale'] = locale;
    vnp_Params['vnp_CurrCode'] = currCode;
    vnp_Params['vnp_TxnRef'] = orderId;
    vnp_Params['vnp_OrderInfo'] = 'Thanh toan cho ma GD:' + orderId;
    vnp_Params['vnp_OrderType'] = 'other';
    vnp_Params['vnp_Amount'] = amount * 100;
    vnp_Params['vnp_ReturnUrl'] = returnUrl;
    vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_CreateDate'] = createDate;


    vnp_Params = sortObject(vnp_Params);

    var querystring = require('qs');
    var signData = querystring.stringify(vnp_Params, { encode: false });
    var crypto = require("crypto");
    var hmac = crypto.createHmac("sha512", secretKey);
    var signed = hmac.update(new Buffer.from(signData, 'utf-8')).digest("hex");
    vnp_Params['vnp_SecureHash'] = signed;
    vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

    objReturn.status = 1
    objReturn.msg = 'Lấy URL thanh toán thành công'
    objReturn.data = vnpUrl
    res.status(200).json(objReturn);
}

const create_payment_cod = async (req, res, next) => {


    let userID = req.params.userID;
    let cartID = req.body.cartID;
    let PaymentMethodID = req.body.PaymentMethodID;
    let amount = 0;


    try {
        if (!mongoose.Types.ObjectId.isValid(userID) || !mongoose.Types.ObjectId.isValid(PaymentMethodID)) {
            return res.status(400).json({ status: 0, msg: 'iduser hoặc PaymentMethodID không hợp lệ' });

        }

        const finUser = await mdUser.userModel.findById(userID);
        const finPaymentMethod = await mdPaymentMethod.paymentMethodModel.findById(PaymentMethodID);
        if (finPaymentMethod.MethodName != 'COD') {
            return res.status(400).json({ status: 0, msg: 'truyền đúng paymentmethod id có name COD' });
        }




        if (!cartID || !Array.isArray(cartID) || !finUser) {
            return res.status(400).json({ status: 0, msg: 'Dữ liệu giỏ hàng hoặc user không hợp lệ' });
        }


        for (const itemCart of cartID) {
            if (!mongoose.Types.ObjectId.isValid(itemCart)) {
                return res.status(400).json({ status: 0, msg: 'idcart không hợp lệ' });
            }


            const fincart = await mdCart.cartModel.findById(itemCart);


            if (!fincart) {
                return res.status(400).json({ message: 'Không tìm thấy sản phẩm trong giỏ hàng ' });
            }
            const findProduct = await mdProduct.productModel.findById(fincart.ProductID);
            if (findProduct.StockQuantity <= 0 && itemCart.Quantity > findProduct.StockQuantity) {

                return res.status(400).json({ message: 'số lượng sản phẩm đã hết hoặc không đủ' });
            }

            amount += findProduct.Price;

        }

    } catch (error) {
        return res.status(404).json({ status: 0, error: "Đã xảy ra lỗi " + error.message });
    }


    try {



        for (const iterator of cartID) {
            const finCart = await mdCart.cartModel.findById(iterator);
            if (!finCart) {
                return res.status(404).json({ error: "Cart item not found" });
            }
            const findProduct = await mdProduct.productModel.findById(finCart.ProductID);
            if (!findProduct) {
                return res.status(404).json({ error: "Product not found" });
            }

            const quantityCart = finCart.Quantity;
            const quantityProduct = findProduct.StockQuantity;

            if (quantityCart > quantityProduct) {
                return res.status(400).json({ message: 'Không thể thực hiện ,do số lượng sản phẩm nào đó không đủ hoặc đã hết' });
            } else {

            }

        }




        let data_cart = [];
        for (const iterator of cartID) {
            const finCart = await mdCart.cartModel.findById(iterator)
                .populate('UserID', 'Email FullName PhoneNumber Address')
                .populate({
                    path: 'ProductID',
                    populate: { path: 'CategoryID' }
                })

            const cartObject = {
                _id: finCart._id,
                UserID: {
                    _id: finCart.UserID._id,
                    FullName: finCart.UserID.FullName,
                    Email: finCart.UserID.Email,
                    PhoneNumber: finCart.UserID.PhoneNumber,
                    Address: finCart.UserID.Address
                },
                ProductID: {
                    _id: finCart.ProductID._id,
                    CategoryID: {
                        _id: finCart.ProductID.CategoryID._id,
                        CategoryName: finCart.ProductID.CategoryID.CategoryName
                    },
                    Brand: finCart.ProductID.Brand,
                    Description: finCart.ProductID.Description,
                    Price: finCart.ProductID.Price,
                    ProductName: finCart.ProductID.ProductName,
                    StockQuantity: finCart.ProductID.StockQuantity,
                    Image: finCart.ProductID.Image
                },
                Quantity: finCart.Quantity,
                __v: finCart.__v
            };

            data_cart.push(cartObject)


        }

        var date = moment(Date.now()).utc().toDate();

        const newOrderData = {
            UserID: userID,
            CartID: cartID,
            PaymentMethodID: PaymentMethodID,
            TotalAmount: amount,
            Status: 1,
            OrderDate: date
        };



        const newORDER = new mdOrder.orderModel(newOrderData);


        const newOrderDetailData = {
            OrderID: newORDER._id,
            Quantity: cartID.length,
            DetailCartData: data_cart,
            UnitPrice: amount / cartID.length
        };
        const newORDERDETAIL = new mdOrderDetail.orderDetailModel(newOrderDetailData);

        newORDER.save()
        newORDERDETAIL.save()

        for (const iterator of cartID) {
            const finCart = await mdCart.cartModel.findById(iterator);
            const findProduct = await mdProduct.productModel.findById(finCart.ProductID);

            let quantityCart = finCart.Quantity;
            let quantityProduct = findProduct.StockQuantity;

            try {
                quantityProduct -= quantityCart
                await mdProduct.productModel.findByIdAndUpdate(finCart.ProductID, { StockQuantity: quantityProduct }, { new: true });
                await mdCart.cartModel.findByIdAndDelete(iterator);


            } catch (error) {
                return res.status(404).json({ error: "Đã xảy ra lỗi 2" + error.message });
            }

        }
        return res.status(200).json({

            status: 1,
            msg: 'order success',
            data: newORDERDETAIL
        });


    } catch (error) {
        return res.status(404).json({ error: "Đã xảy ra lỗi 1 " + error.message });
    }





}
const vnpay_return = async (req, res, next) => {
    let vnp_Params = req.query;


    let secureHash = vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = sortObject(vnp_Params);

    let config = require('config');
    let tmnCode = config.get('vnp_TmnCode');
    let secretKey = config.get('vnp_HashSecret');

    let querystring = require('qs');
    let signData = querystring.stringify(vnp_Params, { encode: false });
    let crypto = require("crypto");
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(new Buffer.from(signData, 'utf-8')).digest("hex");

    if (secureHash === signed) {
        try {

            const userID = globalUserID;
            const cartID = globalCartID;
            const amount = globalAmount;


            for (const iterator of cartID) {
                const finCart = await mdCart.cartModel.findById(iterator);
                const findProduct = await mdProduct.productModel.findById(finCart.ProductID);

                const quantityCart = finCart.Quantity;
                const quantityProduct = findProduct.StockQuantity;

                if (quantityCart > quantityProduct) {
                    res.render('order/success', { code: 'Không thể thực hiện ,do số lượng sản phẩm nào đó không đủ hoặc đã hết' })
                } else {
                }

            }




            let data_cart = [];
            for (const iterator of cartID) {
                const finCart = await mdCart.cartModel.findById(iterator)
                    .populate('UserID', 'Email FullName PhoneNumber Address')
                    .populate({
                        path: 'ProductID',
                        populate: { path: 'CategoryID' }
                    })

                const cartObject = {
                    _id: finCart._id,
                    UserID: {
                        _id: finCart.UserID._id,
                        FullName: finCart.UserID.FullName,
                        Email: finCart.UserID.Email,
                        PhoneNumber: finCart.UserID.PhoneNumber,
                        Address: finCart.UserID.Address
                    },
                    ProductID: {
                        _id: finCart.ProductID._id,
                        CategoryID: {
                            _id: finCart.ProductID.CategoryID._id,
                            CategoryName: finCart.ProductID.CategoryID.CategoryName
                        },
                        Brand: finCart.ProductID.Brand,
                        Description: finCart.ProductID.Description,
                        Price: finCart.ProductID.Price,
                        ProductName: finCart.ProductID.ProductName,
                        StockQuantity: finCart.ProductID.StockQuantity,
                        Image: finCart.ProductID.Image
                    },
                    Quantity: finCart.Quantity,
                    __v: finCart.__v
                };

                data_cart.push(cartObject)


            }

            var date = moment(Date.now()).utc().toDate();

            const newOrderData = {
                UserID: userID,
                CartID: cartID,
                PaymentMethodID: globalPaymenthemodID,
                TotalAmount: amount,
                Status: 1,
                OrderDate: date
            };



            const newORDER = new mdOrder.orderModel(newOrderData);
            newORDER.save()

            const newOrderDetailData = {
                OrderID: newORDER._id,
                Quantity: cartID.length,
                DetailCartData: data_cart,
                UnitPrice: amount / cartID.length
            };
            const newORDERDETAIL = new mdOrderDetail.orderDetailModel(newOrderDetailData);
            newORDERDETAIL.save()

            for (const iterator of cartID) {
                const finCart = await mdCart.cartModel.findById(iterator);
                const findProduct = await mdProduct.productModel.findById(finCart.ProductID);

                let quantityCart = finCart.Quantity;
                let quantityProduct = findProduct.StockQuantity;

                try {
                    quantityProduct -= quantityCart
                    await mdProduct.productModel.findByIdAndUpdate(finCart.ProductID, { StockQuantity: quantityProduct }, { new: true });
                    await mdCart.cartModel.findByIdAndDelete(iterator);


                } catch (error) {
                    return res.status(404).json({ error: "Đã xảy ra lỗi " + error.message });
                }

            }

        } catch (error) {
            return res.status(404).json({ error: "Đã xảy ra lỗi 1 " + error.message });
        }
        res.render('order/success', {
            code: vnp_Params['vnp_ResponseCode']
        })
    } else {
        return res.status(404).json({ error: "Đã xảy ra lỗi 2 " + error.message });
    }
}
var objReturn = {
    status: 1,
    msg: 'OK'
}



const getByIdUser = async (req, res, next) => {


    objReturn.data = null;

    try {
        const userID = req.params.userID;

        if (!mongoose.Types.ObjectId.isValid(userID)) {
            objReturn.status = 0;
            objReturn.msg = 'userID không hợp lệ';
            return res.status(400).json(objReturn);
        }

        const order = await mdOrder.orderModel.find({ UserID: userID })
            .populate('PaymentMethodID')
            .populate('UserID', '_id FullName Email PhoneNumber');

        if (order <= 0) {
            objReturn.status = 0;
            objReturn.msg = 'Không tìm thấy đơn hàng';
            return res.status(400).json(objReturn);
        } else {
            objReturn.status = 1;
            objReturn.msg = 'tìm thành công';
            objReturn.data = order;
        }
    } catch (error) {
        objReturn.status = 0;
        objReturn.msg = error.message;
        return res.status(500).json(objReturn);

    }

    res.json(objReturn);
}
const getAllOrder = async (req, res, next) => {


    objReturn.data = null;

    try {


        const order = await mdOrder.orderModel.find().sort({ _id: -1 })
            .populate('PaymentMethodID');

        if (!order) {
            objReturn.status = 0;
            objReturn.msg = 'Không tìm thấy';
            return res.status(404).json(objReturn);
        } else {
            objReturn.status = 1;
            objReturn.msg = 'tìm thành công';
            objReturn.data = order;
        }
    } catch (error) {
        objReturn.status = 0;
        objReturn.msg = error.message;
        return res.status(500).json(objReturn);

    }

    res.json(objReturn);
}
// TODO: Implement putOrderStatus to update the status of an order
const putOrderStatus = async (req, res, next) => {
    const orderId = req.params.orderID;
    const Status = req.body.Status;



    if (!Status || Status < 1 || Status > 2) {
        objReturn.status = 0;
        objReturn.msg = 'status không hợp lệ hoặc phải nhỏ hơn 1 và lớn hơn 3';
        return res.status(404).json(objReturn);
    }
    if (!mongoose.Types.ObjectId.isValid(orderId) || !orderId) {
        objReturn.status = 0;
        objReturn.msg = 'orderId không hợp lệ';
        return res.status(400).json(objReturn);
    }

    try {
        const order = await mdOrder.orderModel.findByIdAndUpdate(orderId, { Status }, { new: true });

        if (!order) {
            objReturn.status = 0;
            objReturn.msg = 'Order not found';
            return res.status(404).json(objReturn);
        }

        objReturn.status = 1;
        objReturn.msg = 'Order status updated successfully';
        objReturn.data = order;

    } catch (error) {
        objReturn.status = 0;
        objReturn.msg = error.message;
        return res.status(500).json(objReturn);
    }

    res.json(objReturn);
}
const delOrderById = async (req, res, next) => {
    const orderId = req.params.orderID;

    if (!mongoose.Types.ObjectId.isValid(orderId) || !orderId) {
        objReturn.status = 0;
        objReturn.msg = 'orderId không hợp lệ';
        return res.status(400).json(objReturn);
    }

    try {
        const order = await mdOrder.orderModel.findByIdAndDelete(orderId);

        if (!order) {
            objReturn.status = 0;
            objReturn.msg = 'Order not found';
            return res.status(404).json(objReturn);
        }

        objReturn.status = 1;
        objReturn.msg = 'Order deleted successfully';

    } catch (error) {
        objReturn.status = 0;
        objReturn.msg = error.message;
        return res.status(500).json(objReturn);
    }

    res.json(objReturn);
}








module.exports = { create_payment_url, vnpay_return, getByIdUser, create_payment_cod,getAllOrder,putOrderStatus,delOrderById }
