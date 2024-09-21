const axios = require('axios');

exports.convertAptToUsdt = async (req, res) => {
    const { amount } = req.body; // The amount of APT tokens

    try {
        if (!amount || isNaN(amount)) {
            return res.status(400).json({ error: 'Invalid APT amount' });
        }

        // Mock conversion rate or API call to fetch the current APT to USDT conversion rate
        const aptToUsdtRate = await getAptToUsdtRate();

        // Calculate the USDT value
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
        return 5; // Assume 1 APT = 5 USDT
    }
}
