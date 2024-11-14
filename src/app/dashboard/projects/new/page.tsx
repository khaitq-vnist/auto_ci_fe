'use client'
import DashboardLayout from '@/layouts/dashboard.layout';
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Nav, Dropdown, Spinner } from 'react-bootstrap';

interface Integration {
    name: string;
}

interface Repository {
    name: string;
    lastUpdate: string;
}

// Mock API functions
const fetchIntegrations = async (): Promise<Integration[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                { name: 'GitHub' },
                { name: 'GitLab' },
            ]);
        }, 1000);
    });
};

const fetchRepositories = async (integration: string): Promise<Repository[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                { name: 'auto_ci_fe', lastUpdate: '17 minutes ago' },
                { name: 'auto_ci_be', lastUpdate: '22 hours ago' },
                { name: 'demo_ci_cd', lastUpdate: '13 days ago' },
            ]);
        }, 1000);
    });
};

const CreateProjectPage: React.FC = () => {
    const [integrations, setIntegrations] = useState<Integration[]>([]);
    const [selectedIntegration, setSelectedIntegration] = useState<string | undefined>(undefined);
    const [organization, setOrganization] = useState<string>('khaitq-vnist');
    const [repositories, setRepositories] = useState<Repository[]>([]);
    const [loadingIntegrations, setLoadingIntegrations] = useState<boolean>(true);
    const [loadingRepositories, setLoadingRepositories] = useState<boolean>(false);

    // Fetch integrations on mount
    useEffect(() => {
        const loadIntegrations = async () => {
            setLoadingIntegrations(true);
            const data = await fetchIntegrations();
            setIntegrations(data);
            setLoadingIntegrations(false);
        };
        loadIntegrations();
    }, []);

    // Fetch repositories when integration changes
    useEffect(() => {
        if (selectedIntegration) {
            const loadRepositories = async () => {
                setLoadingRepositories(true);
                const data = await fetchRepositories(selectedIntegration);
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
                {loadingIntegrations ? (
                    <Spinner animation="border" />
                ) : (
                    <Nav
                        variant="tabs"
                        activeKey={selectedIntegration}
                        onSelect={(selectedKey) => setSelectedIntegration(selectedKey || undefined)}
                    >
                        {integrations.map((integration) => (
                            <Nav.Item key={integration.name}>
                                <Nav.Link eventKey={integration.name}>{integration.name}</Nav.Link>
                            </Nav.Item>
                        ))}
                    </Nav>
                )}
            </div>

            {/* Only show organization and repository list if an integration is selected */}
            {selectedIntegration && (
                <>
                    {/* Organization Selection */}
                    <Row className="my-3">
                        <Col>
                            <label>Integration</label>
                            <Dropdown>
                                <Dropdown.Toggle variant="light" id="dropdown-basic">
                                    {selectedIntegration}
                                </Dropdown.Toggle>
                            </Dropdown>
                        </Col>
                        <Col>
                            <label>Organization</label>
                            <Dropdown>
                                <Dropdown.Toggle variant="light" id="dropdown-basic">
                                    {organization}
                                </Dropdown.Toggle>
                                {/* Add options for different organizations if needed */}
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
                                        key={repo.name}
                                        className="align-items-center my-2 p-2"
                                        style={{ borderBottom: '1px solid #ddd' }}
                                    >
                                        <Col>{repo.name}</Col>
                                        <Col className="text-muted">{repo.lastUpdate}</Col>
                                        <Col>
                                            <Button variant="primary" size="sm">
                                                Sync
                                            </Button>
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
        </DashboardLayout>
    );
};

export default CreateProjectPage;
