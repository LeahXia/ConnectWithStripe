'use strict';

module.exports = {

  // Secret for cookie sessions.
  secret: 'sk_test_6CvgC1kuGX2Dvt3jaXpJsNZS',

  // Configuration for Stripe.
  // API Keys: https://dashboard.stripe.com/account/apikeys
  // Connect Settings: https://dashboard.stripe.com/account/applications/settings
  stripe: {
    secretKey: 'sk_test_6CvgC1kuGX2Dvt3jaXpJsNZS',
    publishableKey: 'pk_test_xuw9bJYDbQrCtElRLVRaqam9',
    clientId: 'ca_Bu4YckH3YinB6zJNs0LnCOZB58h3O',
    authorizeUrl:'https://connect.stripe.com/oauth/authorize?response_type=code&scope=read_write&client_id=',
    tokenUri: 'https://connect.stripe.com/oauth/token'
  },

};
