const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const shortid = require('shortid');
const QRCode = require('qrcode');
exports.signup = (req, res) => {
  const prefix = '#cdio24';
  var uniqueCode = ""
  if (req.body.role == 'admin') { 
     uniqueCode = ""
  } else {
    uniqueCode = prefix +req.body.first_name.charAt(0).toUpperCase() + req.body.last_name.charAt(0).toUpperCase()+ shortid.generate();
  }
  const conditions = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
  };
  var user ;
  User.find(conditions).exec((err, u) => {
    
   if(u.length >0)
{  console.log(true)
  user = new User({
    username : req.body.first_name + "_" +req.body.last_name + "_" + shortid.generate(),
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    role: req.body.role ,
    image:"images/avatar_profile.png",
    application_code :uniqueCode,
    occupation :req.body.occupation,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    created_at :req.body.created_at
  });
  user.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    console.log(user._id)
    //user with _id 
    //generate qrcode with _id 
    QRCode.toFile('public/QRCodes/'+user.username+".png", user._id.toHexString(), {
      errorCorrectionLevel: 'H'
    }, function(err) {
      if (err) throw console.log(err);
      console.log('QR code saved!');
    });
    res.send({ message: "User was registered successfully!" });
  
  });
}
else {
  console.log(false)
   user = new User({
    username : req.body.first_name + "_" +req.body.last_name ,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    role: req.body.role ,
    image:"images/avatar_profile.png",
    application_code :uniqueCode,
    occupation :req.body.occupation,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    created_at :req.body.created_at
  });
  
  user.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    QRCode.toFile('public/QRCodes/'+user.username+".png", user._id.toHexString(), {
      errorCorrectionLevel: 'H'
    }, function(err) {
      if (err) throw console.log(err);
      console.log('QR code saved!');
    });
    res.send({ message: "User was registered successfully!" });
  
  });
}

   } )
  

};

exports.signin = (req, res) => {
  User.findOne({
    email: req.body.email
  })
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400 // 24 hours
      });

      res.status(200).send({
        
        user: user,
        accessToken: token
      });
    });
};