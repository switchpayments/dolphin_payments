// Transactions DB
const TRANSACTIONS = {}

const fs = require('fs');

const logTransaction = (id, operation, amount, buyersName, orderIdentifier, callbackUrl, userProfile) => {
    fs.appendFileSync('../transactions.txt', JSON.stringify({
        "id": id,
        "operation": operation,
        "amount": amount,
        "buyersName": buyersName,
        "orderIdentifier": orderIdentifier,
        "callbackUrl": callbackUrl,
        "userProfile": userProfile,
    }) + '\n')
}

const createTransaction = (operation, amount, buyersName, orderIdentifier, callbackUrl, userProfile, status, errorDetails) => {

    // Create an unique ID for the transaction
    const id = Math.floor(Math.random() * Math.floor(Math.random() * Date.now()));

    // Log the transaction to file (just an easy way to show the transactions being stored)
    logTransaction(id, operation, amount, buyersName, orderIdentifier, callbackUrl, userProfile);

    // Add the transaction to the DB
    TRANSACTIONS[id] = {operation, amount, buyersName, orderIdentifier, callbackUrl, userProfile, status, errorDetails};

    // Clean empty values
    TRANSACTIONS[id] = Object.fromEntries(Object.entries(TRANSACTIONS[id]).filter(([_, v]) => v != null));

    // Return ID
    return id;
}

const getTransaction = id => {

    // Get transaction
    const transaction = TRANSACTIONS[id]

    // Return transaction details
    return transaction ? {id, ...transaction} : null;
}

const setStatus = (id, status) => {
    // Update the status of the transaction
    TRANSACTIONS[id].status = status;
}

module.exports = {
    createTransaction,
    getTransaction,
    setStatus,
}
