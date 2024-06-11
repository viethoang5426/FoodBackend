var db = require('./db');
var cartSchema = new db.mongoose.Schema(
    {
        UserID: { type: db.mongoose.Schema.Types.ObjectId, ref: 'userModel', required: true },
        ProductID: { type: db.mongoose.Schema.Types.ObjectId, ref: 'productModel', required: true },
        Quantity: { type: Number, required: true }
    },
    { collection: 'carts' }
);


let cartModel = db.mongoose.model('cartModel', cartSchema);

module.exports = { cartModel };