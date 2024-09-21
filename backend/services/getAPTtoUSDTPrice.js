const axios = require('axios');

async function getAPTtoUSDTPrice() {
  try {
    const response = await axios.get('https://api.1inch.io/v4.0/56/quote', {
      params: {
        fromTokenAddress: '0xC7efb4076dbe143cbcd98cfaaa929ecfc8f299203dfff63b95ccb6bfe19850fa', // Replace with the actual APT BEP-20 token address
        toTokenAddress: '0x55d398326f99059fF775485246999027B3197955', // USDT BEP-20 address
        amount: '1000000000000000000', // 1 APT (in wei format)
      }
    });
    const data = response.data;
    const price = data.toTokenAmount / (10 ** data.toToken.decimals); // Convert from smallest denomination

    console.log(`1 APT = ${price} USDT`);
  } catch (error) {
    console.error("Error fetching price:", error.message);
  }
}

getAPTtoUSDTPrice();
