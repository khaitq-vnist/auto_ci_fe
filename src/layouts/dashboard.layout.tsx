'use client'
import DashboardSidebar from '@/components/dashboard/dashboard.sidebar';
import React, { ReactNode, useState } from 'react';

import { Container } from 'react-bootstrap';

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
    </div>
  );
}

export default DashboardLayout;
