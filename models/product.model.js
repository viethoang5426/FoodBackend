var db = require('./db');
var productSchema = new db.mongoose.Schema(
    {
        CategoryID: { type: db.mongoose.Schema.Types.ObjectId, ref: 'categoryModel', required: true },
        ProductName: { type: String, required: true },
        Description: { type: String },
        Price: { type: Number, required: true },
        Brand: { type: String },
        Image: { type: String, required: false},
        StockQuantity: { type: Number, required: true }
        
    },
    { collection: 'products' }
);


let productModel = db.mongoose.model('productModel', productSchema);

module.exports = { productModel };