
const config = require('./config');
const stripe = require('stripe')(config.stripe.secretKey);
const request = require('request');
const querystring = require('querystring');
const express = require('express');
const admin = require('firebase-admin');
const serviceAccount = require('./washi-tape-firebase-adminsdk.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://washi-tape.firebaseio.com'
});

const server = express();

server.get('/', async (req, res) => {
  // Post the authorization code to Stripe to complete the authorization flow.
  request.post(config.stripe.tokenUri, {
    form: {
      grant_type: 'authorization_code',
      client_secret: config.stripe.secretKey,
      code: req.query.code
    },
    json: true
  }, (err, response, body) => {
    if (err || body.error) {
      console.log('The Stripe onboarding process has not succeeded.');
    } else {
      // res.send('The Stripe onboarding process has been succeeded.')
      console.log(body);
      // body.stripe_user_id
      var customToken = createFBToken(body.stripe_user_id);
      res.send(customToken);
    }
  });
});


var createFBToken = (uid) =>{

  admin.auth().createCustomToken(uid)
    .then(function(customToken) {
      // Send token back to client
      console.log(customToken);
      return customToken;
    })
    .catch(function(error) {
      console.log("Error creating custom token:", error);
    });
};


server.listen(process.env.PORT);
console.info('Express listening on port');
