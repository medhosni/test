const db = require("../models");
const News = db.news;




exports.createNews = (req, res) => {
    const { title, description } = req.body;
    if (req.file) {
      image = "images/"+req.file.filename;
    } 
    const newNews = new News({
      title,
      description,
      image
    });
    
    newNews.save()
      .then(news => {
        res.json(news);
      })
      .catch(err => {
        res.status(500).send({
          message: "Error creating news",
        });
      });
  };
exports.getAllNews = (req, res) => {
  News.find()
    .then(news => {
      res.json(news);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving news",
      });
    });
};
exports.updateNews = (req, res) => {
    const newsId = req.body._id;
    const updateFields = req.body;
    if (req.file) {
      updateFields.image = "images/"+req.file.filename;
    } 
    News.findByIdAndUpdate(newsId, {
      $set: updateFields, 
    }, { new: true })
      .then(news => {
        if (!news) {
          res.status(404).send({
            message: `News not found with id ${newsId}`,
          });
        } else {
          res.json(news);
        }
      })
      .catch(err => {
        res.status(500).send({
          message: `Error updating news with id ${newsId}`,
        });
      });
  };
exports.deleteNews = (req, res) => {
    const newsId = req.body._id;
  
    News.findByIdAndRemove(newsId)
      .then(news => {
        if (!news) {
          res.status(404).send({
            message: `News not found with id ${newsId}`,
          });
        } else {
          res.json({ message: "News deleted successfully" });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: `Error deleting news with id ${newsId}`,
        });
      });
  };
  
  
  
  
  