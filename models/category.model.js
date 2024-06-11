var db = require('./db');
var categorySchema = new db.mongoose.Schema(
    {
        CategoryName: { type: String, required: true }
    },
    { collection: 'categorys' }
);


let categoryModel = db.mongoose.model('categoryModel', categorySchema);

module.exports = { categoryModel };