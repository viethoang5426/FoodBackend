var db = require('./db');
var orderSchema = new db.mongoose.Schema(
    {
        UserID: { type: db.mongoose.Schema.Types.ObjectId, ref: 'userModel', required: true },
        CartID: [{ type: db.mongoose.Schema.Types.ObjectId, ref: 'cartModel', required: true }],
        OrderDate: { type: Date, required: true  },
        TotalAmount: { type: Number, required: true },
        PaymentMethodID: { type: db.mongoose.Schema.Types.ObjectId, ref: 'paymentMethodModel', required: true },
        Status: { type: Number, required: true }
    },
    { collection: 'orders' }
);


let orderModel = db.mongoose.model('orderModel', orderSchema);

module.exports = { orderModel };