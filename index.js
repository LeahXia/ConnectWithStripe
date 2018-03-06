
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

var userUid = '';

server.get('/:client_id/:user_uid', function (req, res){
  //parse paras from app
  userUid = req.params.user_uid;
  const client_id = req.params.client_id;
  console.log(`----userUid ----  ${userUid}`);
  console.log(`----client_id ----  ${client_id}`);


  const authorizeUrl = 'https://connect.stripe.com/oauth/authorize?response_type=code&scope=read_write&client_id=' + client_id;

  res.redirect(authorizeUrl);

});



server.get('/token', async (req, res) => {
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
      return admin.auth().createCustomToken(userUid).catch(function(error) {
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
          const connectRef = '/stripe_customers/' + userUid + '/connectAcct'
          return admin.database().ref(connectRef).set(body);
        })
      });
    };
  });
});


server.listen(process.env.PORT);
console.info('Express listening on port');
