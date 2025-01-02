'use client'
import DashboardLayout from '@/layouts/dashboard.layout';
import dashboardService from '@/utils/api/dashboard.service';
import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap'; // Install with `npm install react-bootstrap`

interface DashboardData {
  TotalProjects: number;
  TotalIntegrations: number;
}

function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await dashboardService.getDashboardData();
      if (response.data.code === 200 && response.data.data) {
        setDashboardData({
          TotalProjects: response.data.data.total_projects,
          TotalIntegrations: response.data.data.total_integrations,
        });

        // Show modal if total_integrations is 0
        if (response.data?.data?.total_integrations === 0) {
          setShowModal(true);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleGoToIntegrations = () => {
    setShowModal(false);
    // Navigate to the integration route
    window.location.href = 'dashboard/integration'; // Update the route as per your application
  };

  return (
    <DashboardLayout>
      <h1 style={{ color: 'black' }}>Welcome to the Dashboard</h1>
      {dashboardData ? (
        <>
          <table style={{ border: '1px solid black', width: '50%', margin: '20px auto', textAlign: 'center' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid black', padding: '10px' }}>Metric</th>
                <th style={{ border: '1px solid black', padding: '10px' }}>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ border: '1px solid black', padding: '10px' }}>Total Projects</td>
                <td style={{ border: '1px solid black', padding: '10px' }}>{dashboardData.TotalProjects}</td>
              </tr>
              <tr>
                <td style={{ border: '1px solid black', padding: '10px' }}>Total Integrations</td>
                <td style={{ border: '1px solid black', padding: '10px' }}>{dashboardData.TotalIntegrations}</td>
              </tr>
            </tbody>
          </table>

          {/* Modal */}
          <Modal show={showModal} onHide={() => setShowModal(false)} backdrop="static" keyboard={false}>
            <Modal.Header closeButton>
              <Modal.Title>Integrations Needed</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              You currently have no integrations. Would you like to set up integrations now?
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleGoToIntegrations}>
                Go to Integrations
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      ) : (
        <p>Loading data...</p>
      )}
    </DashboardLayout>
  );
}

export default DashboardPage;
