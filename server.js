const express = require("express");
const cors = require("cors");
const dbConfig = require("./app/config/db.config");
const app = express();
const db = require("./app/models");
const setTimestamps = require("./app/middlewares/timestamp");
 

app.use(cors());

// parse requests of content-type - application/json
app.use(express.json());
app.use(setTimestamps);
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
db.mongoose
  .connect(`mongodb+srv://mohamedhosni:ykvwsEqBgs9q7tld@cluster0.5oohcth.mongodb.net/`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    // initial();
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });


// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to esprit-cdio application." });
});
// routes
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/request.routes')(app);
require('./app/routes/news.routes')(app);
// set port, listen for requests
const PORT = process.env.PORT || 9080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

