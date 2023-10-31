const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Request = mongoose.model(
  "Request",
  new mongoose.Schema({
    status : String,
    reciever: { type: Schema.Types.ObjectId, ref: 'User' },
    sender: { type: Schema.Types.ObjectId, ref: 'User' },
    created_at: Date,
  })
);

module.exports = Request;