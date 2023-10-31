const db = require("../models");
const Request = db.request;


exports.addRequest = (req, res) => {
    const { status, reciever, sender } = req.body;
    const conditions = {
        status,
       reciever,
        sender,
      }; 
      Request.find(conditions).exec((err, r) => {
        if(r)
     { 
        res.send({ message: "Friend request already exist" });

     }
     else {
        const newRequest = new Request({
            status,
            reciever, // This should be the ObjectId of the receiver user
            sender, // This should be the ObjectId of the sender user
          });
          newRequest
          .save()
          .then(savedRequest => {
            res.status(201).json(savedRequest); 
          })
          .catch(error => {
            res.status(500).json({ error: 'Error creating the request' });
          });
     }  })

  };


exports.delete = (req, res) => {
    const id = req.body._id;
    Request.findByIdAndRemove(id)
      .then(data => {
        if (!data) {
          res.status(404).send({
            message: `Cannot delete Request with id=${id}. Maybe Request was not found!`
          });
        } else {
          res.send({
            message: "Request was deleted successfully!"
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete Request with id=" + id
        });
      });
  };