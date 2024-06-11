const mongoose = require('mongoose');
let mdOrderDetail = require('../models/orderDetail.model')

var objReturn = {
    status: 1,
    msg: 'OK'
}

const getByIdOrder = async (req, res, next) => {


    objReturn.data = null;

    try {
        const orderID = req.params.orderID;

        if (!mongoose.Types.ObjectId.isValid(orderID)) {
            objReturn.status = 0;
            objReturn.msg = 'orderID không hợp lệ';
            return res.status(400).json(objReturn);
        }

        const order = await mdOrderDetail.orderDetailModel.find({ OrderID: orderID })
            .populate('OrderID')

        if (order <= 0) {
            objReturn.status = 0;
            objReturn.msg = 'Không tìm thấy đơn hàng chi tiết';
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







module.exports = { getByIdOrder }
