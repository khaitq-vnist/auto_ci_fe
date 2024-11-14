'use client'
import DashboardLayout from "@/layouts/dashboard.layout";
import { useRouter } from "next/navigation";
import { Button, Container, Table } from "react-bootstrap";

import { useEffect, useState } from "react";
import AddNewIntegrationModal from "@/components/dashboard/integration/add.new.modal";
import { toast } from "react-toastify";
import integrationService from "../../../utils/api/integration.service";
import { CreateIntegrationRequest, Integration } from "./list.props";



const IntegrationPage = () => {
  const router = useRouter();
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [showModal, setShowModal] = useState(false);

  const handleShowModal = () => {
    console.log("showModal called");
    setShowModal(true);
  };

  useEffect(() => {
    const fetchListIntegration = async () => {
      try {
        const resp = await integrationService.getAllIntegrations();
        if (resp.status !== 200 || resp.data.code !== 200) {
          toast.error("Failed to fetch integrations");
          return null;
        }
        setIntegrations
        const data = resp.data
        if (data && data.data) {
          setIntegrations(
            data.data.map((item: any) => ({
              id: item.id,
              name: item.integration_name,
              scope: item.provider_name,
              // map other properties as needed
            }))
          );
        }
      } catch (error) {
        toast.error("Unexpected error");
        return null;
      }
    };

    fetchListIntegration()
  }, [showModal]);

  const handleCloseModal = () => setShowModal(false);
  const handleSave = (data: { type: string; name: string; personalToken: string }) => {
    const createIntegration = async (req: CreateIntegrationRequest) => {
      try {
        const response = await integrationService.createIntegration(req);
        if (response.data.code === 200) {
          toast.success("Integration created successfully!");
        } else {
          toast.error("Failed to create integration");
        }
      } catch (error) {
        toast.error("Unexpected error while creating integration");
      }
    }
    const integrationData: CreateIntegrationRequest = {
      integration_name: data.name,
      provider_code: data.type,
      access_token: data.personalToken,
    };
    createIntegration(integrationData)

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
              <tr key={integration.id}>
                <td>{integration.name ?? 'Unnamed Integration'}</td>
                <td>{integration.scope ?? 'Not specified'}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    </DashboardLayout>
  );
};

export default IntegrationPage;


