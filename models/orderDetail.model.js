var db = require('./db');
var orderDetailSchema = new db.mongoose.Schema(
    {
        OrderID: { type: db.mongoose.Schema.Types.ObjectId, ref: 'orderModel', required: true },
        Quantity: { type: Number, required: true },
        DetailCartData: { type: Object, required: false },
        UnitPrice: { type: Number, required: true }
    },
    { collection: 'orderDetails' }
);


let orderDetailModel = db.mongoose.model('orderDetailModel', orderDetailSchema);

module.exports = { orderDetailModel };
