const controller = require("../controllers/request.controller");
const upload = require("../middlewares/multer");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/api/requests", controller.addRequest);
  app.delete("/api/requests", controller.delete);

}