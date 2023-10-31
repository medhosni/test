const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const News = mongoose.model(
  "News",
  new mongoose.Schema({
    title :String,
    description :String,
    image: String,
    created_at: Date,
    updated_at: Date
  })
);

module.exports = News;