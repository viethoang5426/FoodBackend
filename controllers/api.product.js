var mProduct = require('../models/product.model');
var mCategory = require('../models/category.model');
const mongoose = require('mongoose');

var objReturn = {
    status: 1,
    msg: 'OK'
}

exports.getAll = async (req, res, next) => {
    console.log(1);
    objReturn.data = null;

    let list = [];

    try {
        list = await mProduct.productModel.find()
            .populate('CategoryID')
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
        const productId = req.params.productId;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            objReturn.status = 0;
            objReturn.msg = 'productId không hợp lệ';
            return res.status(400).json(objReturn);
        }

        const product = await mProduct.productModel.findById(productId)
            .populate('CategoryID')

        if (product) {
            objReturn.status = 1;

            objReturn.msg = 'tìm thành công';
            objReturn.data = product;
        } else {
            objReturn.status = 0;
            objReturn.msg = 'Không tìm đợt sản phẩm';
            return res.status(400).json(objReturn);
        }
    } catch (error) {
        objReturn.status = 0;
        objReturn.msg = error.message;
    }

    res.json(objReturn);
}
exports.getByIdCategory = async (req, res, next) => {
    objReturn.data = null;

    try {
        const categoryId = req.params.categoryId;

        if (!mongoose.Types.ObjectId.isValid(categoryId)) {
            objReturn.status = 0;
            objReturn.msg = 'categoryId không hợp lệ';
            return res.status(400).json(objReturn);
        }

        const product = await mProduct.productModel.find({ CategoryID: categoryId })
            .populate('CategoryID')

        if (product) {
            objReturn.msg = 'tìm thành công';
            objReturn.data = product;
        } else {
            objReturn.status = 0;
            objReturn.msg = 'Không tìm đợt sản phẩm';
            return res.status(400).json(objReturn);
        }
    } catch (error) {
        objReturn.status = 0;
        objReturn.msg = error.message;
    }

    res.json(objReturn);
}
exports.getByName = async (req, res, next) => {
    objReturn.data = null;

    try {
        const nameProduct = req.params.nameProduct;

        if (nameProduct) {
            var product = await mProduct.productModel.find({ ProductName: { $regex: nameProduct, $options: 'i' } });

        } else {
            var product = await mProduct.productModel.find();

        }
        if (product) {
            objReturn.msg = 'tìm thành công';
            objReturn.data = product;
        } else {
            objReturn.status = 0;
            objReturn.msg = 'Không tìm đợt sản phẩm';
            return res.status(400).json(objReturn);
        }
    } catch (error) {
        objReturn.status = 0;
        objReturn.msg = error.message;
        return res.status(400).json(objReturn);

    }

    res.json(objReturn);
}
exports.getByBrand = async (req, res, next) => {
    objReturn.data = null;

    try {
        const Brand = req.params.brandProduct;

        if (Brand) {
            var product = await mProduct.productModel.find({ Brand: { $regex: Brand, $options: 'i' } });

        } else {
            var product = await mProduct.productModel.find();

        }
        if (product) {
            objReturn.msg = 'tìm thành công';
            objReturn.data = product;
        } else {
            objReturn.status = 0;
            objReturn.msg = 'Không tìm đợt sản phẩm';
            return res.status(400).json(objReturn);
        }
    } catch (error) {
        objReturn.status = 0;
        objReturn.msg = error.message;
        return res.status(400).json(objReturn);

    }

    res.json(objReturn);
}
exports.getByPrice = async (req, res, next) => {
    objReturn.data = null;

    try {
        const { min, max } = req.query;
        if (min == null || max == null) {
            objReturn.status = 0;
            objReturn.msg = 'Thiếu tham số min hoặc max';
            return res.json(objReturn);
        }
        const minDiem = parseFloat(min);
        const maxDiem = parseFloat(max);

        if (isNaN(minDiem) || isNaN(maxDiem)) {
            objReturn.status = 0;
            objReturn.msg = 'Tham số min và max phải là số';
            return res.json(objReturn);
        }


        const results = await mProduct.productModel.find({ Price: { $gte: minDiem, $lte: maxDiem } });
        if (results.length > 0) {
            objReturn.msg = 'Tìm thấy các kết quả phù hợp';
            objReturn.data = results;
        } else {
            objReturn.status = 0;
            objReturn.msg = 'Không tìm thấy kết quả nào phù hợp';
        }


    } catch (error) {
        objReturn.status = 0;
        objReturn.msg = error.message;
        return res.status(400).json(objReturn);

    }
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    res.set('Surrogate-Control', 'no-store');

    res.status(200).json(objReturn);
}



exports.create = async (req, res, next) => {
    objReturn.data = null;

    const { CategoryID, Description, Price, ProductName, StockQuantity,Brand,Ratting} = req.body;
    try {
        if (!CategoryID || !Description || !Price || !ProductName || !StockQuantity || !Brand) {
            objReturn.status = 0;
            objReturn.msg = 'hãy nhập đủ';
            return res.status(400).json(objReturn);

        }
        const product = new mProduct.productModel({
            CategoryID,
            Description,
            Price,
            Brand,
            ProductName,
            Image: req.file.path,
            StockQuantity,
            Ratting : '5',
        });
        if (req.file && req.file.path) {
            product.Image = req.file.path;
        }


        const savedProduct = await product.save();
        objReturn.msg = 'tạo thành công';
        objReturn.data = savedProduct;



    } catch (error) {
        objReturn.status = 0;
        objReturn.msg = error.message;
        return res.status(500).json(objReturn);
    }
    res.status(200).json(objReturn);

};

exports.getRattingById = async (req, res, next) => {
    objReturn.data = null;

    const { productId } = req.params;
    const { Ratting } = req.body;

    try {
        const productId = req.params.productId;


        const product = await mProduct.productModel.findById(productId)

        if (product) {
            objReturn.status = 1;
            objReturn.msg = 'tìm thành công';
            objReturn.data = product.Ratting;
        } else {
            objReturn.status = 0;
            objReturn.msg = 'Không tìm đợt sản phẩm';
            return res.status(400).json(objReturn);
        }
    } catch (error) {
        objReturn.status = 0;
        objReturn.msg = error.message;
    }

    res.json(objReturn);
}

exports.updateById = async (req, res, next) => {
    objReturn.data = null;

    const { productId } = req.params;
    const { CategoryID, Description, Price, ProductName, StockQuantity,Brand } = req.body;

    try {
        const updatedProduct = await mProduct.productModel.findByIdAndUpdate(
            productId,
            {
                CategoryID,
                Description,
                Price,
                Brand,
                ProductName,
                StockQuantity
            },
            { new: true }
        );

        if (req.file && req.file.path) {
            updatedProduct.Image = req.file.path;
        }
        if (!updatedProduct) {
            objReturn.status = 0;
            objReturn.msg = 'Product not found';
            return res.status(404).json(objReturn);
        }

        await updatedProduct.save();

        objReturn.msg = 'Update successful';
        objReturn.data = updatedProduct;

    } catch (error) {
        objReturn.status = 0;
        objReturn.msg = error.message;
        return res.status(500).json(objReturn);
    }

    res.json(objReturn);
};


exports.updateRattingById = async (req, res, next) => {
    objReturn.data = null;

    const { productId } = req.params;
    const { Ratting } = req.body;
    console.log(req.body);
    try {
        const updatedProduct = await mProduct.productModel.findByIdAndUpdate(
            productId,
            {
                Ratting
            },
            { new: true }
        );
        if (!updatedProduct) {
            objReturn.status = 0;
            objReturn.msg = 'Product not found';
            return res.status(404).json(objReturn);
        }
        await updatedProduct.save();

        objReturn.msg = 'Update successful';
        objReturn.data = updatedProduct;

    } catch (error) {
        objReturn.status = 0;
        objReturn.msg = error.message;
        return res.status(500).json(objReturn);
    }

    res.json(objReturn);
}

exports.deleteById = async (req, res, next) => {
    const { productId } = req.params;

    try {
        const deletedProduct = await mProduct.productModel.findByIdAndDelete(productId);

        if (!deletedProduct) {
            objReturn.status = 0;
            objReturn.msg = 'Product not found';
            return res.status(404).json(objReturn);
        }

        objReturn.msg = 'Delete successful';
        objReturn.data = deletedProduct;

    } catch (error) {
        objReturn.status = 0;
        objReturn.msg = error.message;
        return res.status(500).json(objReturn);
    }

    res.json(objReturn);
};