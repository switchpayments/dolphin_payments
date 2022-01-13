// Transactions DB
let TRANSACTIONS = {}

let createTransaction = (operation, amount, buyersName, orderIdentifier, callbackUrl, userProfile, status) => {

    // Create an unique ID for the transaction
    const id = Math.floor(Math.random() * Math.floor(Math.random() * Date.now()));

    // Add the transaction to the DB
    TRANSACTIONS[id] = {operation, amount, buyersName, orderIdentifier, callbackUrl, userProfile, status};

    // Clean empty values
    TRANSACTIONS[id] = Object.fromEntries(Object.entries(TRANSACTIONS[id]).filter(([_, v]) => v != null));
    
    // Return ID
    return id;
}

let getTransaction = id => {

    // Get transaction
    let transaction = TRANSACTIONS[id]

    // Return transaction details
    return {id, ...transaction}
}

module.exports = {
    TRANSACTIONS,
    createTransaction,
    getTransaction
}