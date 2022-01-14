const express = require('express');
const router = express.Router();
const XMLHttpRequest = require('xhr2');

const { createTransaction, getTransaction, setStatus } = require('../db/db');
const { decodePayload, encodePayload } = require('../utils/encoding');
const { calculateStatus } = require('../utils/status');

/* GET transactions details */
router.get('/:id', (req, res, next) => {
    try {
        const info = getTransaction(req.params.id);
        if (info) {
            res.status(200);
            const payload = encodePayload(info.status, req.params.id, info.orderIdentifier, info.errorDetails);
            res.send(payload);
        } else {
            res.status(404);
            res.send('🤡');
        }
    } catch (e) {
        // Something bad happened :|
        res.status(500);
        res.send('💀');

        // Let's keep the log...
        console.log(`${req.params.id}: `);
        console.error(e, e.stack)
    }
});

router.post('/', (req, res, next) => {
    try {
        let info = {};
        try {
            info = decodePayload(req.body.payload);
        } catch (e) {
            res.status(400);
            return res.send({
                'payload': e,
            });
        }

        // We'll have 2 status: one we send on the request response and one in the webhook
        const [initial_status, final_status, error_details] = calculateStatus(info);

        // Create the transaction
        const id = createTransaction(
            info.operation,
            info.amount,
            info.buyersName,
            info.orderIdentifier,
            info.callbackUrl,
            info.userProfile,
            initial_status,
            error_details,
        );

        // Respond with success
        res.status(201);
        const payload = encodePayload(initial_status, id, info.orderIdentifier);
        res.send(payload);

        // Send the webhook
        webhookHandler(
            info.callbackUrl,
            id,
            info.orderIdentifier,
            final_status,
            error_details,  // we will only send the error details on the webhook and get status calls
        );
    } catch (e) {
        // Something bad happened :|
        res.status(500);
        res.send('💀');

        // Let's keep the log...
        console.error(e, e.stack)
    }
});

/**
 * Send the webhook to the callback URL with the status of the transaction
 *
 * @param callbackUrl - URL we want to send the webhook
 * @param orderIdentifier - Order identifier
 */
const webhookHandler = (callbackUrl, id, orderIdentifier, status, errorDetails) => {
    setTimeout(() => {
        setStatus(id, status);
        const payload = encodePayload(status, id, orderIdentifier, errorDetails);

        let xhr = new XMLHttpRequest();
        xhr.open('POST', callbackUrl, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(payload));
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
