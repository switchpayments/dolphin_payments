const fs = require('fs');

const database_path = '../database.json'

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

const loadTransactions = () => {
    try {
        data = fs.readFileSync(database_path, 'utf-8');
        return JSON.parse(data.toString());
    } catch {
        return {};
    }
}

const storeTransactions = (transactions) => {
    fs.writeFileSync(database_path, JSON.stringify(transactions));
}

const createTransaction = (operation, amount, buyersName, orderIdentifier, callbackUrl, userProfile, status, errorDetails) => {

    // Create an unique ID for the transaction
    const id = Math.floor(Math.random() * Math.floor(Math.random() * Date.now()));

    // Log the transaction to file (just an easy way to show the transactions being stored)
    logTransaction(id, operation, amount, buyersName, orderIdentifier, callbackUrl, userProfile);

    // Get transactions from db
    let transactions = loadTransactions();
    transactions[id] = {operation, amount, buyersName, orderIdentifier, callbackUrl, userProfile, status, errorDetails};

    // Append the new transaction
    transactions[id] = {operation, amount, buyersName, orderIdentifier, callbackUrl, userProfile, status, errorDetails};

    // Store transactions to DB
    storeTransactions(transactions);

    // Clean empty values
    transactions[id] = Object.fromEntries(Object.entries(transactions[id]).filter(([_, v]) => v != null));

    // Return ID
    return id;
}

const getTransaction = id => {
    // Load transactions from DB
    let transactions = loadTransactions();

    // Get transaction
    const transaction = transactions[id]

    // Return transaction details
    return transaction ? {id, ...transaction} : null;
}

const setStatus = (id, status) => {
    // Load transactions from DB
    let transactions = loadTransactions();

    // Update the status of the transaction
    transactions[id].status = status;

    // Store the new transaction on DB
    storeTransactions(transactions);
}

module.exports = {
    createTransaction,
    getTransaction,
    setStatus,
}
