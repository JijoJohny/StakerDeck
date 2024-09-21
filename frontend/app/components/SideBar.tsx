import React from 'react';
import Link from 'next/link';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <ul>
        <li>
          <Link href="/deposit">
        Deposit
          </Link>
        </li>
        <li>
          <Link href="/withdraw">
        Withdraw
          </Link>
        </li>
        <li>
          <Link href="/lucky-draw">
        Lucky Draw
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;