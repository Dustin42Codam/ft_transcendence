const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {

  const stateValue = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

  req.session.stateValue = stateValue

  // res.redirect(`http://localhost:${process.env.FUSIONAUTH_PORT}/oauth2/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}&response_type=code&state=${stateValue}`);
  res.redirect(`https://api.intra.42.fr/oauth/authorize?client_id=7c59d418a12bb6da95283ca1866d0db3946ff94528e8d7be5b98545c31f892ff&redirect_uri=http%3A%2F%2Flocalhost%3A9000%2Foauth-callback&response_type=code&state=${stateValue}`);
  // res.redirect(`https://api.intra.42.fr/oauth/authorize?client_id=7c59d418a12bb6da95283ca1866d0db3946ff94528e8d7be5b98545c31f892ff&redirect_uri=http%3A%2F%2Flocalhost%3A9000%2Foauth-callback&response_type=code`);
});
module.exports = router;
