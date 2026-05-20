import React from 'react';
import Navbar from './Navbar';

const DashboardLayout = ({ children }) => {
  return (
    <div className="dashboard-layout">
      <Navbar />
      <div className="main-content">
        <div className="theme-banner"></div>
        <div className="content-container">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
