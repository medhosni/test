const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = mongoose.model(
  "User",
  new mongoose.Schema({
    username: String,
    first_name: String,
    last_name: String,
    email: String,
    password: String,
    role: String,
    application_code: String,
    image: String,
    occupation: String,
    friends: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    created_at: Date,
    updated_at: Date
  })
);

module.exports = User;