const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./user.model");
db.request = require("./request.model");
db.news = require("./news.model");
module.exports = db;