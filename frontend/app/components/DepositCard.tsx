"use client";
import React, { useState } from 'react';


const DepositCard = () => {
  const [amount, setAmount] = useState('');

  return (
    <div className="deposit-card">
      <h2>Deposit</h2>
      <p>Deposit APT to earn fixed APY without any lock-in period!</p>

      <div className="amount-input">
        <label htmlFor="amount">Amount to Deposit (in USD):</label>
        <div className="input-group">
          <input
            type="number"
            id="amount"
            placeholder="Enter deposit amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <span className="currency">0 APT</span>
        </div>
      </div>

      <button className="deposit-btn">Deposit</button>
    </div>
  );
};

export default DepositCard;
