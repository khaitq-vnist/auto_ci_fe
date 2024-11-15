'use client'
import DashboardLayout from '@/layouts/dashboard.layout';
import integrationService from '@/utils/api/integration.service';
import repositoryService from '@/utils/api/repository.service';
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Nav, Dropdown, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';

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

const fetchRepositories = async (integrationId: number): Promise<Repository[]> => {
    try {
        const resp = await repositoryService.getAllRepositoriesByIntegrationId(integrationId);
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
                    <Nav.Item>
                        <Nav.Link eventKey="GITLAB">GITLAB</Nav.Link>
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
        </DashboardLayout>
    );
};

export default CreateProjectPage;
