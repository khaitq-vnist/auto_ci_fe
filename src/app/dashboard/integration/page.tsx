'use client'
import DashboardLayout from "@/layouts/dashboard.layout"
import { useRouter } from "next/navigation";
import { Button, Container, Table } from "react-bootstrap"
import { FormIntegration, Integration } from "./list.props";
import { useState } from "react";
import AddNewIntegrationModal from "@/components/dashboard/integration/add.new.modal";
import { toast } from "react-toastify";
const apiData: { integrations: Integration[] } = {
    integrations: [
      {
        url: "https://api.buddy.works/workspaces/buddy/integrations/5fff3231277e1449d8eb3e6a",
        html_url: "https://app.buddy.works/buddy/workspace/integrations",
        hash_id: "5fff3231277e1449d8eb3e6a",
        name: "Buddy AWS integration",
        type: "AMAZON",
        scope: "WORKSPACE",
        identifier: "my_aws_integration",
        all_pipelines_allowed: true,
        permissions: {
          admins: "MANAGE",
          others: "USE_ONLY",
          users: [],
          groups: []
        },
        allowed_pipelines: []
      }
    ]
  };
  

const IntegrationPage = () => {
    const router = useRouter();
    const integrations = apiData.integrations;
    const [showModal, setShowModal] = useState(false);

  const handleShowModal = () => {
    console.log("showModal called");
    setShowModal(true)
  };
  const handleCloseModal = () => setShowModal(false);
  const handleSave = (data: { type: string; name: string; personalToken: string }) => {
    console.log('Form data saved:', data);
    toast.success("Integration added successfully!");
    // Add additional save logic here, such as sending data to an API
  };

    return (
        <DashboardLayout>
            <Container className="d-flex justify-content-between align-items-center p-3 border-bottom">
                <h1 className="m-0">Integration</h1>
                <div className="ms-auto">
  <Button variant="primary" onClick={handleShowModal}>
    Add New
  </Button>
</div>
      <AddNewIntegrationModal
        show={showModal}
        onClose={handleCloseModal}
        onSave={handleSave}
      />
            </Container>
            <Container className="p-3">
            <Table striped bordered hover>
          <thead className="text-center">
            <tr>
              <th>Name</th>
              <th>Scope</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {integrations.map((integration) => (
              <tr key={integration.hash_id ?? Math.random()}>
                <td>{integration.name ?? 'Unnamed Integration'}</td>
                <td>{integration.scope ?? 'Not specified'}</td>
              </tr>
            ))}
          </tbody>
        </Table>
       
            </Container>
          
        </DashboardLayout>
        
    )
}
export default IntegrationPage