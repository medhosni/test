const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;

exports.allAccess = (req, res) => {
    res.status(200).send("Public Content.");
  };

// Retrieve all users from the database.
exports.findAll = (req, res) => {
 
  User.find().populate('friends')
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving users."
      });
    });
};
// find user with id 
exports.findOnebyId = (req, res) => {
  const id = req.body._id;
  User.findById(id).populate('friends')
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found User with id " + id });
      else res.send(data);
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving User with id=" + id });
    });
};

exports.findByUsername = (req, res) => {
  const { username } = req.body;

  // Use a regular expression to match usernames that start with the provided letter
  const regex = new RegExp(`^${username}`, 'i');


  User.find({ username: regex })
    .then(data => {
      if (data.length === 0) {
        res.status(404).send({ message: "No users found with the username: " + username });
      } else {
        res.send(data);
      }
    })
    .catch(err => {
      res.status(500).send({ message: "Error retrieving users by username: " + username });
    });
};

// update user + image profile 
exports.update = (req, res) => {
  
  const { _id, first_name, last_name, email, occupation, friends , image } = req.body;

  const updateData = {};

  if (first_name) {
    updateData.first_name = first_name ;
  }
  if (friends) {
    updateData.friends = friends ;
  }

  if (last_name) {
    updateData.last_name = last_name;
  }

  if (email) {
    updateData.email = email;
  }

  if (occupation) {
    updateData.occupation = occupation;
  }

  if (req.file) {
    updateData.image = "images/"+req.file.filename;
  } else if (image) {
    updateData.image = "images/"+image;
  }

  User.findByIdAndUpdate(_id,updateData , { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update the User with id=${_id}. Maybe User was not found!`
        });
      } else res.send({ message: "User was updated successfully." });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating User with id=" + _id + "and the erreor is"  + err
      });
    });
};




exports.delete = (req, res) => {
  const id = req.body._id;
  User.findByIdAndRemove(id)
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete User with id=${id}. Maybe User was not found!`
        });
      } else {
        res.send({
          message: "User was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete User with id=" + id
      });
    });
};

exports.addFriend = (req, res) => {
  const userId = req.body.userId;
  const friendId = req.body.friendId;

  User.findById(userId)
    .then(user => {
      if (!user) {
        res.status(404).send({
          message: `Cannot find User with id=${userId}`
        });
      } else {
        User.findById(friendId)
          .then(friend => {
            if (!friend) {
              res.status(404).send({
                message: `Cannot find User with id=${friendId}`
              });
            } else {
              if (user.friends.includes(friendId)) {
                res.status(400).send({
                  message: 'User is already a friend'
                });
              } else {
                // Add friendId to the user's friends
                user.friends.push(friendId);
                user.save()
                  .then(() => {
                    // Add userId to the friend's friends
                    friend.friends.push(userId);
                    friend.save()
                      .then(() => {
                        res.send({
                          message: "Friend added successfully"
                        });
                      })
                      .catch(err => {
                        res.status(500).send({
                          message: "Could not add user as a friend of friend with id=" + friendId
                        });
                      });
                  })
                  .catch(err => {
                    res.status(500).send({
                      message: "Could not add friend with id=" + friendId
                    });
                  });
              }
            }
          })
          .catch(err => {
            res.status(500).send({
              message: "Could not find User with id=" + friendId
            });
          });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not find User with id=" + userId
      });
    });
};
exports.deleteFriend = (req, res) => {
  const userId = req.body.userId;
  const friendId = req.body.friendId;

  User.findById(userId)
    .then(user => {
      if (!user) {
        res.status(404).send({
          message: `Cannot find User with id=${userId}`
        });
      } else {
        if (!user.friends.includes(friendId)) {
          res.status(400).send({
            message: 'User is not a friend'
          });
        } else {
          User.findById(friendId)
            .then(friend => {
              if (!friend) {
                res.status(404).send({
                  message: `Cannot find User with id=${friendId}`
                });
              } else {
                // Remove friendId from the user's friends
                user.friends = user.friends.filter(friend => friend != friendId);
                user.save()
                  .then(() => {
                    // Remove userId from the friend's friends
                    friend.friends = friend.friends.filter(user => user != userId);
                    friend.save()
                      .then(() => {
                        res.send({
                          message: "Friend removed successfully"
                        });
                      })
                      .catch(err => {
                        res.status(500).send({
                          message: "Could not remove user as a friend of friend with id=" + friendId
                        });
                      });
                  })
                  .catch(err => {
                    res.status(500).send({
                      message: "Could not remove friend with id=" + friendId
                    });
                  });
              }
            })
            .catch(err => {
              res.status(500).send({
                message: "Could not find User with id=" + friendId
              });
            });
        }
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not find User with id=" + userId
      });
    });
};
