const express = require('express');
const router = express.Router();

require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'uploads', // Thư mục trên Cloudinary nơi ảnh sẽ được lưu trữ
        allowed_formats: ['jpg', 'png'],
    },
});

const upload = multer({ storage: storage });


const api_product = require('../controllers/api.product');



router.post('/create', upload.single('Image'), api_product.create);


router.get('/getAll', api_product.getAll);
router.get('/search/name/:nameProduct', api_product.getByName);
router.get('/search/brand/:brandProduct', api_product.getByBrand);
router.get('/search/price', api_product.getByPrice);
router.get('/search/name/', api_product.getAll);
router.get('/search/brand/', api_product.getAll);
router.get('/:productId', api_product.getById);
router.get('/category/:categoryId', api_product.getByIdCategory);
router.get('/getRattingById/:productId', api_product.getRattingById);

router.put('/updateRattingById/:productId', api_product.updateRattingById);

router.put('/updateProduct/:productId', upload.single('Image'), api_product.updateById);
router.delete('/deleteProduct/:productId', api_product.deleteById);

router.get('/elasticSearch/:ProductName', api_product.elasticSearch);



module.exports = router;
