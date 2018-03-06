
const config = require('./config');
const stripe = require('stripe')(config.stripe.secretKey);
const request = require('request');
const querystring = require('querystring');
const express = require('express');
const admin = require('firebase-admin');
const serviceAccount = require('./washi-tape-firebase-adminsdk.json');
const firebase = require('firebase')


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://washi-tape.firebaseio.com'
});

var firebaseConfig = {
  apiKey: "AIzaSyD8J3w2bnaRHGvz7_Z1BD1VyE00lJQsRzY",
  authDomain: "washi-tape.firebaseapp.com",
  databaseURL: "https://washi-tape.firebaseio.com",
  projectId: "washi-tape",
  storageBucket: "washi-tape.appspot.com",
  messagingSenderId: "915313004323"
};
firebase.initializeApp(firebaseConfig);

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
      // var customToken = createFBToken(body.stripe_user_id);
      // create FB token
      // DtD6sMoOUXdX611jt02hrUO48Z85
      // body.stripe_user_id
      return admin.auth().createCustomToken('MYLPF2l9KSNW53DIL8GVqfevmm62').catch(function(error) {
          console.log("Error creating custom token:", error);
      }).then(function(customToken) {
        console.log('-------------------------customToken--------------------');
        console.log(customToken);
        // sign in to fb with token
        return firebase.auth().signInWithCustomToken(customToken).catch(function(error) {
          var errorCode = error.code;
          var errorMessage = error.message;
          console.log(errorMessage);
        }).then(() => {
          return admin.database().ref('/stripe/MYLPF2l9KSNW53DIL8GVqfevmm62/connectAcct').set(body);
        })
      });
    };
  });
});


// var createFBToken = (uid) =>{
//
//   admin.auth().createCustomToken(uid)
//     .then(function(customToken) {
//       // Send token back to client
//       console.log('-------------------------customToken--------------------');
//       console.log(customToken);
//       return customToken;
//     })
//     .catch(function(error) {
//       console.log("Error creating custom token:", error);
//     });
// };


server.listen(process.env.PORT);
console.info('Express listening on port');
