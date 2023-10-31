const controller = require("../controllers/news.controller");
const upload = require("../middlewares/multer");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/news", controller.getAllNews);
  app.post("/api/news",upload.single('image') , controller.createNews);
  app.patch("/api/news", upload.single('image')  ,controller.updateNews);
  app.delete("/api/news", controller.deleteNews);

}