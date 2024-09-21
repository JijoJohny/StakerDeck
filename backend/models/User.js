const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    wallet: {
        publicKey: { type: String, required: true },
        secretKey: { type: String, required: true } // Store securely
    },
    balance: { type: Number, default: 0 },
     usdtBalance: { type: Number, default: 0 }
});

module.exports = mongoose.model('User', userSchema);
