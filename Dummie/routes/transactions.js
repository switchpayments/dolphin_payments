let express = require('express');
let router = express.Router();
let XMLHttpRequest = require('xhr2');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

function webhookHandler(orderIdentifier, callbackUrl) {
    setTimeout(function() {
        let xhr = new XMLHttpRequest();
        xhr.open('POST', callbackUrl, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({
            orderIdentifier: orderIdentifier,
        }));
      }, 5000);
}

module.exports = router;
