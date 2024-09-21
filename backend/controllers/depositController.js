const User = require('../models/User');
const Deposit = require('../models/Deposit');
const { AptosClient, AptosAccount } = require("aptos");
require('dotenv').config();

const ADMIN_PRIVATE = process.env.ADMIN_PRIVATE;

function hexToUint8Array(hexString) {
    const matches = hexString.match(/.{1,2}/g) || [];
    return new Uint8Array(matches.map(byte => parseInt(byte, 16)));
}
exports.deposit = async (req, res) => {
    const { amount } = req.body;
    const userId = req.user._id;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const userSecretKeyUint8Array = hexToUint8Array(user.wallet.secretKey);
        const userAccount = new AptosAccount(userSecretKeyUint8Array);

        const client = new AptosClient("https://testnet.aptoslabs.com");

        const appWalletAddress = ADMIN_PRIVATE;

        const transferPayload = {
            type: "entry_function_payload",
            function: "0x1::coin::transfer",
            type_arguments: ["0x1::aptos_coin::AptosCoin"],
            arguments: [appWalletAddress, amount]
        };

        const txnRequest = await client.generateTransaction(userAccount.address(), transferPayload);
        const signedTxn = await client.signTransaction(userAccount, txnRequest);

        const txnResponse = await client.submitTransaction(signedTxn);
        await client.waitForTransaction(txnResponse.hash);

        user.balance += amount;
        await user.save();

        const depositRecord = new Deposit({
            userId,
            amount,
            txHash: txnResponse.hash
        });
        await depositRecord.save();

        res.status(200).json({ message: "Deposit successful", txHash: txnResponse.hash });

    } catch (error) {
        console.error("Error in deposit:", error.message);
        res.status(500).json({ error: "Deposit failed" });
    }
};
