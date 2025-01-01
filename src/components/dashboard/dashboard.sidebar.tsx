'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Nav, Button } from 'react-bootstrap';
import { FaChartPie, FaChartLine, FaProjectDiagram, FaSignOutAlt } from 'react-icons/fa';
import '../styles/sidebar.scss';
import {
  ROUTER_DASHBOARD,
  ROUTER_DASHBOARD_INTEGRATION,
  ROUTER_DASHBOARD_PROJECTS,
} from '@/constants/route';

interface SidebarProps {
  isMinimized: boolean;
  toggleSidebar: () => void;
  onLogout: () => void; // Callback function for logout
}

const DashboardSidebar = ({ isMinimized, toggleSidebar, onLogout }: SidebarProps) => {
  return (
    <div className={`sidebar ${isMinimized ? 'minimized' : 'expanded'} bg-dark text-light`}>
      <div className="d-flex flex-column align-items-center p-3">
        {/* Sidebar Toggle Button */}
        <Button
          variant="secondary"
          onClick={toggleSidebar}
          className={`mb-3 button ${isMinimized ? 'centered' : ''}`}
        >
          {isMinimized ? '▶' : '◀'}
        </Button>

        {/* Navigation Links */}
        <Nav className="flex-column w-100">
          <Link href={ROUTER_DASHBOARD} legacyBehavior>
            <Nav.Link href={ROUTER_DASHBOARD} className="d-flex align-items-center nav-link">
              <FaChartPie className="me-2" />
              {!isMinimized && 'Overview'}
            </Nav.Link>
          </Link>
          <Link href={ROUTER_DASHBOARD_PROJECTS} legacyBehavior>
            <Nav.Link href={ROUTER_DASHBOARD_PROJECTS} className="d-flex align-items-center nav-link">
              <FaProjectDiagram className="me-2" />
              {!isMinimized && 'Projects'}
            </Nav.Link>
          </Link>
          <Link href={ROUTER_DASHBOARD_INTEGRATION} legacyBehavior>
            <Nav.Link href={ROUTER_DASHBOARD_INTEGRATION} className="d-flex align-items-center nav-link">
              <FaChartLine className="me-2" />
              {!isMinimized && 'Integration'}
            </Nav.Link>
          </Link>
        </Nav>

        {/* Logout Button */}
        <div className="mt-auto w-100">
          <Button
            variant="danger"
            onClick={onLogout}
            className="d-flex align-items-center justify-content-center w-100"
          >
            <FaSignOutAlt className="me-2" /> {!isMinimized && 'Logout'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DashboardSidebar;
