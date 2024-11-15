'use client'
import DashboardLayout from '@/layouts/dashboard.layout';
// pages/projects.tsx

import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Dropdown } from 'react-bootstrap';
import { FiSearch } from 'react-icons/fi';
import { FaGithub } from "react-icons/fa";
import { useRouter } from 'next/navigation';

// Define the project interface
interface Project {
    id: number;
    name: string;
    lastActivity: string;
    icon: string;
}

// Mock API call to get project data
const fetchProjects = async (): Promise<Project[]> => {
    return [
        {
            id: 1,
            name: 'demo_ci_cd',
            lastActivity: '12 hours ago',
            icon: 'K', // Placeholder for user's initial
        },
        {
            id: 2,
            name: 'auto_ci_fe',
            lastActivity: '5 days ago',
            icon: 'github', // Placeholder for GitHub icon
        },
        {
            id: 3,
            name: 'demo_ci_cd',
            lastActivity: '5 days ago',
            icon: 'github',
        },
        {
            id: 4,
            name: 'demo_ci_cd',
            lastActivity: '5 days ago',
            icon: 'github',
        },
        {
            id: 5,
            name: 'auto_ci_fe',
            lastActivity: '5 days ago',
            icon: 'github',
        },
    ];
};

const ProjectsPage = () => {
    const router = useRouter();
    const [projects, setProjects] = useState<Project[]>([]);
    
    useEffect(() => {
        // Fetch projects from the mock API
        const getProjects = async () => {
            const data = await fetchProjects();
            setProjects(data);
        };
        getProjects();
    }, []);

    const handleClickButtonAddNew = () => {
        router.push('/dashboard/projects/new');
    }
    return (
        <DashboardLayout>
            <Container fluid style={{ padding: '20px' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Projects</h2>
                <Button variant="primary" onClick={handleClickButtonAddNew}>Add Project</Button>
            </div>

            <Row>
                {projects.map((project) => (
                    <Col xs={12} sm={6} md={4} lg={3} key={project.id} className="mb-4">
                        <Card style={{ border: '1px solid #ddd', borderRadius: '8px' }}>
                            <Card.Body className="d-flex align-items-center">
                                <div
                                    style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        backgroundColor: project.icon === 'github' ? '#f0f0f0' : '#FFCDD2',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '18px',
                                        fontWeight: 'bold',
                                        color: project.icon === 'github' ? '#000' : '#C2185B',
                                        marginRight: '10px',
                                    }}
                                >
                                    {project.icon === 'github' ? (
                                         <FaGithub style={{ width: '24px', height: '24px' }} />
                                    ) : (
                                        project.icon
                                    )}
                                </div>
                                <div>
                                    <Card.Title style={{ fontSize: '16px', margin: 0 }}>{project.name}</Card.Title>
                                    <Card.Text style={{ fontSize: '14px', color: '#6c757d' }}>
                                        Last activity {project.lastActivity}
                                    </Card.Text>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
        </DashboardLayout>
    );
};

export default ProjectsPage;
