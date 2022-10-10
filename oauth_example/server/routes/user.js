const express = require("express");
const router = express.Router();
const axios = require("axios");
const qs = require("querystring");

router.get("/", (req, res) => {
  // token in session -> get user data and send it back to the vue app
  if (req.session.token) {
    console.log('Token: ' + req.session.token)
    axios.get(`https://api.intra.42.fr/v2/me`, {
      headers: {
        'Authorization': 'Bearer ' + req.session.token,
      }
    })
    .then( data => {
      res.send({
        authState: "Authorized",
        name: data.data["displayname"],
        photo: data.data["image_url"]
      });
    })
    .catch( err => {
      res.send({
        authState: "Not Authorized",
      })
      console.log(err);
      return ;
    })
  }
  // expired token -> send nothing
  else {
    res.send({
      authState: "Not Authenticated",
    });
  }
});
module.exports = router;
