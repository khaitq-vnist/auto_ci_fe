'use client'
import DashboardSidebar from '@/components/dashboard/dashboard.sidebar';
import React, { ReactNode, useState } from 'react';

import { Container } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';

interface DashboardLayoutProps {
  children: ReactNode;
}

const  DashboardLayout = ({ children } : DashboardLayoutProps) => {
  const [isMinimized, setIsMinimized] = useState(false);

  const toggleSidebar = () => setIsMinimized(!isMinimized);

  return (
    <div className="d-flex">
      <DashboardSidebar isMinimized={isMinimized} toggleSidebar={toggleSidebar} />
      <Container
        fluid
        style={{
          marginLeft: isMinimized ? '80px' : '250px', // Adjusts dynamically
          paddingTop: '20px',
          width: `calc(100% - ${isMinimized ? '80px' : '250px'})`, // Makes content area extend
          transition: 'all 0.3s',
        }}
      >
        {children}
      </Container>
      <ToastContainer 
       position="top-right"
       autoClose={3000} 
       />
    </div>
  );
}

export default DashboardLayout;
