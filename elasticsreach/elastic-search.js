var elasticseach = require('@elastic/elasticsearch');

var client = new elasticseach.Client({
    cloud: {
        id: process.env.ELASTIC_CLOUD_ID
    },
    auth: {
        username: process.env.ELASTIC_USERNAME,
        password: process.env.ELASTIC_PASSWORD
    },
    ssl: {
        rejectUnauthorized: false
    }
});

module.exports = client;