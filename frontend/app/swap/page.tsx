"use client";
import DepositCard from "../components/DepositCard";
import Navbar from "../components/Navbar";
import Sidebar from "../components/SideBar";
import Timeline from "../components/TimeLine";


const Home = () => {
  return (
    <div >
      <Navbar />
      
      <main className="bg-[#0c0a09]">
        {/* <Sidebar/> */}
        <Timeline in={1} />
        
        {/* Main content of the page */}
      </main>
    </div>
  );
};

export default Home;