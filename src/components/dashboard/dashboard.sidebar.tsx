'use client'
import { useState } from 'react';
import Link from 'next/link';
import { Nav, Button } from 'react-bootstrap';
import { FaChartPie, FaChartLine, FaFileAlt, FaCog } from 'react-icons/fa';

interface SidebarProps {
    isMinimized: boolean;
    toggleSidebar: () => void;
  }
export default function DashboardSidebar({ isMinimized, toggleSidebar } : SidebarProps) {
//   const [isMinimized, setIsMinimized] = useState(false);

//   const toggleSidebar = () => {
//     setIsMinimized(!isMinimized);
//   };

  return (
    <div
      style={{
        width: isMinimized ? '80px' : '250px',
        height: '100vh',
        backgroundColor: '#343a40',
        color: '#fff',
        position: 'fixed',
        transition: 'width 0.3s',
      }}
    >
      <div className="d-flex flex-column align-items-center p-3">
        <Button
          variant="dark"
          onClick={toggleSidebar}
          className="mb-3"
          style={{ alignSelf: isMinimized ? 'center' : 'flex-end' }}
        >
          {isMinimized ? '▶' : '◀'}
        </Button>
        <Nav className="flex-column w-100">
          <Link href="/overview" passHref>
            <Nav.Link className="d-flex align-items-center">
              <FaChartPie className="me-2" />
              {!isMinimized && 'Overview'}
            </Nav.Link>
          </Link>
          <Link href="/analytics" passHref>
            <Nav.Link className="d-flex align-items-center">
              <FaChartLine className="me-2" />
              {!isMinimized && 'Analytics'}
            </Nav.Link>
          </Link>
          <Link href="/reports" passHref>
            <Nav.Link className="d-flex align-items-center">
              <FaFileAlt className="me-2" />
              {!isMinimized && 'Reports'}
            </Nav.Link>
          </Link>
          <Link href="/settings" passHref>
            <Nav.Link className="d-flex align-items-center">
              <FaCog className="me-2" />
              {!isMinimized && 'Settings'}
            </Nav.Link>
          </Link>
        </Nav>
      </div>
    </div>
  );
}