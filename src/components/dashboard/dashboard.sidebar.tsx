'use client'
import { useState } from 'react';
import Link from 'next/link';
import { Nav, Button } from 'react-bootstrap';
import { FaChartPie, FaChartLine, FaFileAlt, FaCog } from 'react-icons/fa';
import '../styles/sidebar.scss';
import { ROUTER_DASHBOARD, ROUTER_DASHBOARD_INTEGRATION } from '@/constants/route';
import { ToastContainer, toast, ToastPosition } from 'react-toastify';
interface SidebarProps {
    isMinimized: boolean;
    toggleSidebar: () => void;
  }

const DashboardSidebar = ({ isMinimized, toggleSidebar } : SidebarProps) =>{

  return (
    <div
    className={`sidebar ${isMinimized ? 'minimized' : 'expanded'}`}
    >
       <ToastContainer 
       position="top-right"
       autoClose={3000} 
       hideProgressBar />
      <div className="d-flex flex-column align-items-center p-3">
        <Button
           variant="dark"
           onClick={toggleSidebar}
           className={`mb-3 button ${isMinimized ? 'centered' : ''}`}
        >
          {isMinimized ? '▶' : '◀'}
        </Button>
        <Nav className="flex-column w-100">
          <Link href={`${ROUTER_DASHBOARD}`} legacyBehavior>
            <Nav.Link href={`${ROUTER_DASHBOARD}`} className="d-flex align-items-center">
              <FaChartPie className="me-2" />
              {!isMinimized && 'Overview'}
            </Nav.Link>
          </Link>
          <Link href={`${ROUTER_DASHBOARD_INTEGRATION}`} legacyBehavior >
            <Nav.Link href={`${ROUTER_DASHBOARD_INTEGRATION}`} className="d-flex align-items-center" >
              <FaChartLine className="me-2" />
              {!isMinimized && 'Integration'}
            </Nav.Link>
          </Link>

          
        </Nav>
      </div>
    </div>
  );
}
export default DashboardSidebar