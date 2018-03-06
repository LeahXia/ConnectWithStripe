
const config = require('./config');
const stripe = require('stripe')(config.stripe.secretKey);
const request = require('request');
const querystring = require('querystring');
const express = require('express');

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
      res.send('The Stripe onboarding process has been succeeded.')
      console.log(body);
    }
  });
});



server.listen(process.env.PORT);
console.info('Express listening on port');
