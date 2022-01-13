let express = require('express');
let router = express.Router();
let XMLHttpRequest = require('xhr2');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/**
 * Send the webhook to the callback URL with the status of the transaction
 * 
 * @param orderIdentifier - Order identifier
 * @param callbackUrl - URL we want to send the webhook
 */
function webhookHandler(orderIdentifier, callbackUrl) {
  setTimeout(function() {
      let xhr = new XMLHttpRequest();
      xhr.open('POST', callbackUrl, true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify({
          orderIdentifier: orderIdentifier,
      }));
    }, getRandomInt());
}

/**
 * Get random integer between 2000 and 10000
 * 
 * @returns Random integer between 2000 and 10000
 */
function getRandomInt() {
  min = Math.ceil(2000);
  max = Math.floor(10000);
  return Math.floor(Math.random() * (max - min) + min);
}

module.exports = router;
