"use client";
import { useState } from "react";
import DepositCard from "./components/DepositCard";
import LoginCard from "./components/LoginCard";
import Navbar from "./components/Navbar";
import Timeline from "./components/TimeLine";


const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginCard, setShowLoginCard] = useState(false);

  const handleConnectWallet = () => {
    setShowLoginCard(true);
  };

  const handleCloseLoginCard = () => {
    setShowLoginCard(false);
    setIsLoggedIn(true); // Set logged in after successful login/register
  };
  return (
    <div >
      
      <nav className="navbar">
      <Navbar />
      <div className="navbar-buttons">
      <button 
          onClick={handleConnectWallet}
          className="connect-wallet"
        >
          {isLoggedIn ? 'Wallet Connected' : 'Connect Wallet'}
        </button>
        <button className="buy">Buy</button>
      </div>
    </nav>
      <main className="bg-[#0c0a09]">
        {/* <Sidebar/> */}
        <div className="timeline-container">
      <div className='left'>
        <Timeline in={0}/>
        </div>
        <div className='right'>
        
        <DepositCard/>

        </div></div>
        {/* Main content of the page */}
        {showLoginCard && <LoginCard onClose={handleCloseLoginCard} />}
      </main>
    </div>
  );
};

export default Home;