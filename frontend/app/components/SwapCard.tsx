"use client";
import React, { useState } from 'react';
import { ToggleButtonGroup, ToggleButton } from '@mui/material';


const SwapCard = () => {
  const [crypto, setCrypto] = useState('usdc'); // State to track selected currency (USDC or USDT)
  const [aptAmount, setAptAmount] = useState('');
  const [stableAmount, setStableAmount] = useState('');

  const handleCryptoChange = (event: any, newCrypto: React.SetStateAction<string> | null) => {
    if (newCrypto !== null) {
      setCrypto(newCrypto);
    }
  };

  return (
    <div className="swap-card">
      <h2>Swap</h2>
      <p>Swap APT to {crypto.toUpperCase()} instantly</p>

      {/* Input for APT amount */}
      <div className="input-container">
        <label>APT Amount</label>
        <input 
          type="number" 
          placeholder="Enter APT amount" 
          value={aptAmount}
          onChange={(e) => setAptAmount(e.target.value)}
        />
      </div>

      {/* Input for USDC/USDT amount */}
      <div className="input-container">
        <label>{crypto.toUpperCase()} Amount</label>
        <input 
          type="number" 
          placeholder={`Enter ${crypto.toUpperCase()} amount`} 
          value={stableAmount}
          onChange={(e) => setStableAmount(e.target.value)}
        />
      </div>

      {/* Toggle Button to switch between USDC and USDT */}
      <div className="toggle-container">
        <ToggleButtonGroup
          value={crypto}
          exclusive
          onChange={handleCryptoChange}
          aria-label="Crypto toggle"
        >
          <ToggleButton value="usdc" aria-label="USDC">
            USDC
          </ToggleButton>
          <ToggleButton value="usdt" aria-label="USDT">
            USDT
          </ToggleButton>
        </ToggleButtonGroup>
      </div>

      {/* Swap Button */}
      <button className="swap-button">Swap</button>
    </div>
  );
};

export default SwapCard;


// import React, { useState } from 'react';


// const SwapCard = () => {
//   const [amount, setAmount] = useState('');

//   return (
//     <div className="deposit-card">
//       <h2>Swap</h2>
//       <p>Swap APT to earn fixed APY without any lock-in period!</p>

//       <div className="amount-input">
//         <label htmlFor="amount">Amount to Deposit (in USD):</label>
//         <div className="input-group">
//           <input
//             type="number"
//             id="amount"
//             placeholder="Enter deposit amount"
//             value={amount}
//             onChange={(e) => setAmount(e.target.value)}
//           />
//           <span className="currency">0 APT</span>
//         </div>
//       </div>

//       <button className="deposit-btn">Deposit</button>
//     </div>
//   );
// };

// export default SwapCard;
