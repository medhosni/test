const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");
const upload = require("../middlewares/multer");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/users", controller.findAll);
  app.get("/api/users/getUserById", controller.findOnebyId);
  app.get("/api/users/getUsersByName", controller.findByUsername);
  app.patch("/api/users", upload.single('image')  ,controller.update);
  app.delete("/api/users", controller.delete);
  app.patch("/api/users/addFriend", controller.addFriend);
  app.patch("/api/users/deleteFriend", controller.deleteFriend);
}