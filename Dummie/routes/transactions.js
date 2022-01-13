const express = require('express');
const router = express.Router();
const XMLHttpRequest = require('xhr2');

const { createTransaction, getTransaction } = require('../db/db');
const { parse_payload } = require('../utils');

/* GET users listing. */
router.get('/:id', (req, res, next) => {
  try {
    // Get transaction details
    const info = getTransaction(req.params.id);
    if (info) {
      res.send(`✅${info['status']}${info['orderIdentifier']}`);
    } else {
      res.status(404);
      res.send('🤡');
    }
  } catch (e) {
    // Something bad happened :|
    res.status(500);
    res.send('💀');

    // Let's keep the log...
    console.log(`${req.params.id}: ` + e);
  }
});

router.post('/', (req, res, next) => {
  try {
    const info = parse_payload(req.body.payload);
    const id = createTransaction(
      info.operation,
      info.amount,
      info.buyersName,
      info.orderIdentifier,
      info.callbackUrl,
      info.userProfile,
      'ok'
    );

    res.status(201);
    res.send({
      'id': id
    })

  } catch (e) {
    res.status(400);
    return res.send(e);
  }
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
