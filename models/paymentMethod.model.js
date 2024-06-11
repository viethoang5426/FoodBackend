var db = require('./db');
var paymentMethodSchema = new db.mongoose.Schema(
    {
        MethodName: { type: String, required: true }
    },
    { collection: 'paymentMethods' }
);


let paymentMethodModel = db.mongoose.model('paymentMethodModel', paymentMethodSchema);

module.exports = { paymentMethodModel };