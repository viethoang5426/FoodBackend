var mProduct = require('../models/product.model');
var mCategory = require('../models/category.model');
var mCart = require('../models/cart.model');
const mongoose = require('mongoose');

var objReturn = {
    status: 1,
    msg: 'OK'
}

exports.getAll = async (req, res, next) => {
    objReturn.data = null;

    let list = [];

    try {
        list = await mCart.cartModel.find()
            .populate('ProductID')
            .populate('UserID', '_id FullName Email PhoneNumber');
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
exports.getById = async (req, res, next) => {
    objReturn.data = null;

    try {
        const cartId = req.params.cartId;

        if (!mongoose.Types.ObjectId.isValid(cartId)) {
            objReturn.status = 0;
            objReturn.msg = 'cartId không hợp lệ';
            return res.status(400).json(objReturn);
        }

        const cart = await mCart.cartModel.findById(cartId)
            .populate('ProductID')
            .populate('UserID', '_id FullName Email PhoneNumber');

        if (cart) {
            objReturn.msg = 'tìm thành công';
            objReturn.data = cart;
        } else {
            objReturn.status = 0;
            objReturn.msg = 'Không tìm giỏ hàng';
            return res.status(400).json(objReturn);
        }
    } catch (error) {
        objReturn.status = 0;
        objReturn.msg = error.message;
        return res.status(500).json(objReturn);

    }

    res.json(objReturn);
}
exports.getByUserId = async (req, res, next) => {
    objReturn.data = null;

    try {
        const userId = req.params.userId;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            objReturn.status = 0;
            objReturn.msg = 'userId không hợp lệ';
            return res.status(400).json(objReturn);
        }

        const cart = await mCart.cartModel.find({ UserID: userId })
            .populate('ProductID')
            .populate('UserID', '_id FullName Email PhoneNumber');

        if (cart <= 0) {
            objReturn.status = 0;
            objReturn.msg = 'Không tìm thấy giỏ hàng';
            return res.status(200).json(objReturn);
        } else {
            objReturn.status = 1;
            objReturn.msg = 'tìm thành công';
            objReturn.data = cart;
        }
    } catch (error) {
        objReturn.status = 0;
        objReturn.msg = error.message;
        return res.status(500).json(objReturn);

    }

    res.json(objReturn);
}
exports.addCart = async (req, res, next) => {
    objReturn.data = null;
    try {
        const { ProductID, Quantity, UserID } = req.body;

        const product = await mProduct.productModel.findById(ProductID);
        
        const cart = await mCart.cartModel.findOne({ProductID: ProductID , UserID: UserID});
        if (cart) {
            objReturn.status = 0;
            objReturn.msg = 'sản phẩm đã được thêm trong giỏ hàng của bạn';
            return res.status(400).json(objReturn);
        }



        if (Quantity > product.StockQuantity ) {
            objReturn.status = 0;
            objReturn.msg = 'sản phẩm trong kho không đủ cho yêu cầu của bạn';
            return res.status(400).json(objReturn);
        }

        if (!ProductID || !Quantity || !UserID) {
            objReturn.status = 0;
            objReturn.msg = 'cách trường yêu cầu nhập đủ';
            return res.status(400).json(objReturn);
        }

        const newCart = new mCart.cartModel({
            ProductID,
            Quantity,
            UserID
        });

        const savedCart = await newCart.save();
        objReturn.msg = `cart được thêm thành công `;
        objReturn.data = savedCart;


    } catch (error) {
        objReturn.status = 0;
        objReturn.msg = error.message;
        return res.status(400).json(objReturn);
    }

    res.json(objReturn);
}
exports.updateById = async (req, res, next) => {
    objReturn.data = null;

    try {
        const cartId = req.params.cartId;

        if (!mongoose.Types.ObjectId.isValid(cartId)) {
            objReturn.status = 0;
            objReturn.msg = 'cartId không hợp lệ';
            return res.status(400).json(objReturn);
        }
        const updateFields = req.body;

        delete updateFields.ProductID;
        delete updateFields.UserID;
        if (updateFields.Quantity <= 0) {
            await mCart.cartModel.findByIdAndDelete(cartId);

        }

        const updatedCart = await mCart.cartModel.findByIdAndUpdate(cartId, updateFields, { new: true });

        if (!updatedCart) {
            objReturn.status = 0;
            objReturn.msg = 'Không tìm thấy hoặc đã bị xóa';
            return res.status(400).json(objReturn);
        } else {
            objReturn.msg = 'sửa thành công';
            objReturn.data = updatedCart;

        }
    } catch (error) {
        objReturn.status = 0;
        objReturn.msg = error.message;
        return res.status(400).json(objReturn);

    }

    res.json(objReturn);
}
exports.deleteById = async (req, res, next) => {
    objReturn.data = null;

    try {
        const cartId = req.params.cartId;

        if (!mongoose.Types.ObjectId.isValid(cartId)) {
            objReturn.status = 0;
            objReturn.msg = 'cartId không hợp lệ';
            return res.status(400).json(objReturn);
        }

        const delCart = await mCart.cartModel.findByIdAndDelete(cartId);

        if (!delCart) {
            objReturn.status = 0;
            objReturn.msg = 'Không tìm thấy';
            return res.status(400).json(objReturn);
        } else {
            objReturn.msg = 'xóa thành công';
            objReturn.data = delCart;

        }
    } catch (error) {
        objReturn.status = 0;
        objReturn.msg = error.message;
        return res.status(400).json(objReturn);

    }

    res.json(objReturn);
}