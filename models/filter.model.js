var db = require('./db');
var filterSchema = new db.mongoose.Schema(
    {
        FilterType: { type: String, required: true },
        FilterValue: { type: String, required: true }
    },
    { collection: 'filters' }
);


let filterModel = db.mongoose.model('filterModel', filterSchema);

module.exports = { filterModel };