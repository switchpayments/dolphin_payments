const express = require('express');
const router = express.Router();
const XMLHttpRequest = require('xhr2');

const { createTransaction } = require('../db/db');
const { parse_payload } = require('../utils');

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.send('respond with a resource');
});

router.post('/', (req, res, next) => {
  try {
    const info = parse_payload(req.body.payload);
  } catch (e) {
    res.status(400);
    return res.send(e);
  }

  res.status(201);
  res.send('respond with a resources');
});

/**
 * Send the webhook to the callback URL with the status of the transaction
 *
 * @param orderIdentifier - Order identifier
 * @param callbackUrl - URL we want to send the webhook
 */
const webhookHandler = (orderIdentifier, callbackUrl) => {
  setTimeout(() => {
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
const getRandomInt = () => {
  min = Math.ceil(2000);
  max = Math.floor(10000);
  return Math.floor(Math.random() * (max - min) + min);
}

module.exports = router;
