'use client'
import DashboardLayout from '@/layouts/dashboard.layout';
import React from 'react';
import AuthGuard from '../../components/auth/auth';

function DashboardPage() {
  return (

    <DashboardLayout>
      <h1 style={{ color: 'black' }}>Welcome to the Dashboard</h1>
      {/* Your content here */}
    </DashboardLayout>

  );
}

export default DashboardPage;
