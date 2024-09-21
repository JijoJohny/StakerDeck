import React from 'react';
import DepositCard from './DepositCard';

const Timeline = (props: any) => {
  const steps = [
    {
      id: 1,
      title: 'Deposit',
      description: 'Depositing 0 USD worth of APT',
    },
    {
      id: 2,
      title: 'Swap',
      description: 'Swapping APT to Stable coin(s) on Panora Swap',
    },
    {
      id: 3,
      title: 'Stake Liquidity',
      description: 'Staking liquidity on Cellana Finance',
    },
    {
      id: 4,
      title: 'Deposited',
      description: '0 USD worth of APT deposited successfully',
    },
  ];

  return (
    <>
        {steps.map((step, index) => (
        <div key={step.id} className="timeline-item">
          <div className={`timeline-number ${index <= props.in ? 'active' : ''}`}>
            {step.id}
          </div>
          <div className="timeline-content">
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </div>
        </div>
       
      ))}
         </>
      
      
  );
};

export default Timeline;
