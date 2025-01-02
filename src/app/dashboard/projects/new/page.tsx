'use client'
import DashboardLayout from '@/layouts/dashboard.layout';
import integrationService from '@/utils/api/integration.service';
import repositoryService from '@/utils/api/repository.service';
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Nav, Dropdown, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { CreateProjectRequest } from './props';
import projectService from '@/utils/api/project.service';
import { useRouter } from 'next/navigation';

interface Integration {
    id: number;
    name: string;
}

interface Repository {
    id: number;
    name: string;
    lastUpdate: string;
}


const timeAgoFromNoew = (unixTimestamp: number): string => {
    const secondsElapsed = Math.floor(Date.now() / 1000) - unixTimestamp;
    const minutesElapsed = Math.floor(secondsElapsed / 60);
    const hoursElapsed = Math.floor(minutesElapsed / 60);
    const daysElapsed = Math.floor(hoursElapsed / 24);
    const monthsElapsed = Math.floor(daysElapsed / 30); // Approximate month length
    const yearsElapsed = Math.floor(daysElapsed / 365); // Approximate year length

    if (yearsElapsed > 0) {
        return yearsElapsed === 1 ? "1 year ago" : `${yearsElapsed} years ago`;
    } else if (monthsElapsed > 0) {
        return monthsElapsed === 1 ? "1 month ago" : `${monthsElapsed} months ago`;
    } else if (daysElapsed > 0) {
        return daysElapsed === 1 ? "1 day ago" : `${daysElapsed} days ago`;
    } else if (hoursElapsed > 0) {
        return hoursElapsed === 1 ? "1 hour ago" : `${hoursElapsed} hours ago`;
    } else {
        return "less than an hour ago";
    }
}

const fetchRepositories = async (integration_id: number): Promise<Repository[]> => {
    try {
        const resp = await repositoryService.getAllRepositoriesByintegration_id(integration_id);
        if (resp.status !== 200 || resp.data.code !== 200) {
            toast.error("Failed to fetch repositories");
            return [];
        }
        const data = resp.data;
        if (data && data.data) {
            return data.data.map((item: any) => ({
                id: item.id,
                name: item.name,
                lastUpdate: timeAgoFromNoew(item.updated_at),
            }));
        }
    } catch (error) {
        toast.error("Unexpected error");
    }
    return [];
};

const CreateProjectPage: React.FC = () => {
    const router = useRouter()
    const [integrations, setIntegrations] = useState<Integration[]>([]);
    const [integrationType, setIntegrationType] = useState<string | null>("GITHUB");
    const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
    const [repositories, setRepositories] = useState<Repository[]>([]);
    const [loadingIntegrations, setLoadingIntegrations] = useState<boolean>(true);
    const [loadingRepositories, setLoadingRepositories] = useState<boolean>(false);

    // Fetch integrations and set the default selection
    useEffect(() => {
        const fetchListIntegration = async () => {
            setLoadingIntegrations(true);
            try {
                const resp = await integrationService.getAllIntegrations();
                if (resp.status !== 200 || resp.data.code !== 200) {
                    toast.error("Failed to fetch integrations");
                    return;
                }
                const data = resp.data;
                if (data && data.data) {
                    if (data.data.length === 0) {
                        toast.error("No integrations available. Please create a new integration first.");
                        router.push("/dashboard/integration");
                        return;
                    }
                    const integrationData = data.data.map((item: any) => ({
                        id: item.id,
                        name: item.integration_name,
                    }));

                    setIntegrations(integrationData);
                    setSelectedIntegration(integrationData[0]); // Default to the first integration
                }
            } catch (error) {
                toast.error("Unexpected error");
            } finally {
                setLoadingIntegrations(false);
            }
        };
        fetchListIntegration();
    }, [integrationType]);

    // Fetch repositories when the selected integration changes
    useEffect(() => {
        if (selectedIntegration) {

            const loadRepositories = async () => {
                setLoadingRepositories(true);
                const data = await fetchRepositories(selectedIntegration.id);
                console.log("repos: ", data)

                setRepositories(data);
                setLoadingRepositories(false);
            };
            loadRepositories();
        }
    }, [selectedIntegration]);
    const handleAddButton = (data: { integration_id: number; repo_id: number }) => {
        const createProjects = async (req: CreateProjectRequest) => {
            try {
                const response = await projectService.createNewProjects(req);
                if (response.data.code === 200) {
                    toast.success("Integration created successfully!");
                    router.push("/dashboard/projects")
                } else {
                    toast.error("Failed to create integration");
                }
            } catch (error) {
                toast.error("Unexpected error while creating integration");
            }
        }
        if (data.integration_id && data.repo_id) {
            const req: CreateProjectRequest = {
                integration_id: data.integration_id,
                repo_id: data.repo_id,
            };
            createProjects(req);
        } else {
            toast.error("Invalid integration or repository selection");
        }

    };

    return (
        <DashboardLayout>
            <Container>
                <h5>Projects / Create new</h5>

                {/* Integration Selection */}
                <div className="my-3">
                    <Nav
                        variant="tabs"
                        activeKey={integrationType || "GITHUB"}
                        onSelect={(selectedKey) => setIntegrationType(selectedKey)}
                    >
                        <Nav.Item>
                            <Nav.Link eventKey="GITHUB">GITHUB</Nav.Link>
                        </Nav.Item>
                    </Nav>
                </div>

                {selectedIntegration && (
                    <>
                        {/* Integration Dropdown */}
                        <Row className="my-3">
                            <Col>
                                <label>List Integrations</label>
                                <Dropdown>
                                    <Dropdown.Toggle variant="light" id="dropdown-basic">
                                        {selectedIntegration.name}
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        {integrations.map((integration) => (
                                            <Dropdown.Item
                                                key={integration.id}
                                                onClick={() => setSelectedIntegration(integration)}
                                            >
                                                {integration.name}
                                            </Dropdown.Item>
                                        ))}
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Col>
                        </Row>

                        {/* Repository List */}
                        <div>
                            <h6>Repository</h6>
                            {loadingRepositories ? (
                                <Spinner animation="border" />
                            ) : (
                                repositories.length > 0 ? (
                                    repositories.map((repo) => (
                                        <Row
                                            key={repo.id}
                                            className="align-items-center my-2 p-2"
                                            style={{ borderBottom: '1px solid #ddd' }}
                                        >
                                            <Col>{repo.name}</Col>
                                            <Col className="text-muted">{repo.lastUpdate}</Col>
                                            <Col className="text-muted">
                                                <Button variant='primary' onClick={() =>
                                                    handleAddButton({
                                                        integration_id: selectedIntegration.id,
                                                        repo_id: repo.id,
                                                    })} > Add</Button>
                                            </Col>
                                        </Row>
                                    ))
                                ) : (
                                    <p>No repositories available.</p>
                                )
                            )}
                        </div>
                    </>
                )}
            </Container>
        </DashboardLayout >
    );
};

export default CreateProjectPage;
