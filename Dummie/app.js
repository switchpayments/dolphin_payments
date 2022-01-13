var express = require('express');
var transactionsRouter = require('./routes/transactions');

var app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/transactions', transactionsRouter);

module.exports = app;
