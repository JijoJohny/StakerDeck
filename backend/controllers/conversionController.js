const axios = require('axios');
require('dotenv').config();
const User = require('../models/User');
const Deposit = require('../models/Deposit');
const { AptosClient, AptosAccount } = require("aptos");

const ADMIN_PRIVATE = process.env.ADMIN_PRIVATE;

function hexToUint8Array(hexString) {
    const matches = hexString.match(/.{1,2}/g) || [];
    return new Uint8Array(matches.map(byte => parseInt(byte, 16)));
}

exports.convertAptToUsdt = async (req, res) => {
    const { amount } = req.body; // The amount of APT tokens

    try {
        if (!amount || isNaN(amount)) {
            return res.status(400).json({ error: 'Invalid APT amount' });
        }

        const aptToUsdtRate = await getAptToUsdtRate();

        const usdtValue = amount * aptToUsdtRate;

        res.status(200).json({
            aptAmount: amount,
            usdtValue,
            rate: aptToUsdtRate,
            message: `${amount} APT is approximately ${usdtValue} USDT`
        });
    } catch (error) {
        console.error('Error in conversion:', error.message);
        res.status(500).json({ error: 'Conversion failed' });
    }
};


async function getAptToUsdtRate() {
    try {
        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=aptos&vs_currencies=usd');
        return response.data.aptos.usd;
    } catch (error) {
        console.error('Error fetching APT to USDT rate:', error.message);
        return 5;
    }
}


exports.convert = async (req, res) => {
    const { amount } = req.body;
    const userId = req.user._id;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const convertedUsdtValue = await getAptToUsdtRate(amount);
        //console.log(convertedUsdtValue);
        user.usdtBalance += convertedUsdtValue;
        await user.save();


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

        const depositRecord = new Deposit({
            userId,
            amount,
            txHash: txnResponse.hash
        });
        await depositRecord.save();

        res.status(200).json({ message: "Conversion successful", txHash: txnResponse.hash, usdtBalance: user.usdtBalance });

    } catch (error) {
        console.error("Error in deposit:", error.message);
        res.status(500).json({ error: "Deposit failed" });
    }
};
