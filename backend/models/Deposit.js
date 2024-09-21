// models/Deposit.js
const mongoose = require('mongoose');

const DepositSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    txHash: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Deposit = mongoose.model('Deposit', DepositSchema);
module.exports = Deposit;
