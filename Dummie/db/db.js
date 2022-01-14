// Transactions DB
const TRANSACTIONS = {}

const createTransaction = (operation, amount, buyersName, orderIdentifier, callbackUrl, userProfile, status) => {

    // Create an unique ID for the transaction
    const id = Math.floor(Math.random() * Math.floor(Math.random() * Date.now()));

    // Add the transaction to the DB
    TRANSACTIONS[id] = {operation, amount, buyersName, orderIdentifier, callbackUrl, userProfile, status};

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
    TRANSACTIONS[id] = status;
}

module.exports = {
    createTransaction,
    getTransaction,
    setStatus,
}
