var mCategory = require('../models/category.model');
const mongoose = require('mongoose');

var objReturn = {
    status: 1,
    msg: 'OK'
}

exports.getAll = async (req, res, next) => {
    objReturn.data = null;

    let list = [];

    try {
        list = await mCategory.categoryModel.find();
        if (list.length > 0) {
            objReturn.msg = 'tìm thành công';
            objReturn.data = list;
        } else {
            objReturn.status = 0;
            objReturn.msg = 'Không có dữ liệu phù hợp';
            return res.status(500).json(objReturn);

        }

    } catch (error) {
        objReturn.status = 0;
        objReturn.msg = error.message;
        return res.status(500).json(objReturn);
    }

    res.json(objReturn);
}
