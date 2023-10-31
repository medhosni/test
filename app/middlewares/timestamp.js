// middleware/timestamp.js
const moment = require('moment');

const setTimestamps = (req, res, next) => {
  const now = moment().toISOString();
  // If the request is for creating a new resource
  if (req.method === 'POST') {
    req.body.created_at = now;
  }
  // If the request is for updating an existing resource
  if (req.method === 'PUT' || req.method === 'PATCH') {
    req.body.updated_at = now;
  }
  next();
};

module.exports = setTimestamps;
