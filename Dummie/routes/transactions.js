const express = require('express');
const router = express.Router();
const XMLHttpRequest = require('xhr2');

const { createTransaction, getTransaction, setStatus } = require('../db/db');
const { encodeField, parse_payload } = require('../utils');

/* GET transactions details */
router.get('/:id', (req, res, next) => {
    try {
        const info = getTransaction(req.params.id);
        if (info) {
            res.send({
                'payload': `✅${info['status']}${info['orderIdentifier']}`,
            });
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
        let info = {};
        try {
            info = parse_payload(req.body.payload);
        } catch (e) {
            res.status(400);
            return res.send({
                'payload': e,
            });
        }

        const status = info.amount > 200 ? '⏳' : '✅';

        const id = createTransaction(
            info.operation,
            info.amount,
            info.buyersName,
            info.orderIdentifier,
            info.callbackUrl,
            info.userProfile,
            info.amount,
            status,
        );

        const encodedID = encodeField('01', id.toString());
        const encodedOrderID = encodeField('02', info.orderIdentifier);

        res.status(201);
        res.send({
            'payload': `${status}${encodedID}${encodedOrderID}`,
        });

        if (status == '⏳') {
            webhookHandler(
                info.callbackUrl,
                id,
                info.orderIdentifier,
                '✅',
            );
        }
    } catch (e) {
        // Something bad happened :|
        res.status(500);
        res.send('💀');

        // Let's keep the log...
        console.log(`${req.params.id}: ` + e);
    }
});

/**
 * Send the webhook to the callback URL with the status of the transaction
 *
 * @param callbackUrl - URL we want to send the webhook
 * @param orderIdentifier - Order identifier
 */
const webhookHandler = (callbackUrl, id, orderIdentifier, status) => {
    setTimeout(() => {
        setStatus(id, status);
        const encodedID = encodeField('01', id.toString());
        const encodedOrderID = encodeField('02', orderIdentifier);


        let xhr = new XMLHttpRequest();
        xhr.open('POST', callbackUrl, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({
            'payload': `${status}${encodedID}${encodedOrderID}`,
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
