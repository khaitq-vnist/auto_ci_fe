'use client'
import projectService from '@/utils/api/project.service';
import { useRouter } from 'next/navigation';
// pages/projects.tsx

import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Dropdown } from 'react-bootstrap';
import { FiSearch } from 'react-icons/fi';


// Define the project interface
interface Project {
    id: number;
    name: string;
    lastActivity: string;
    icon: string;
}

// Function to fetch projects using the real API
const fetchProjects = async (): Promise<Project[]> => {
    try {
        const response = await projectService.getAllProjects();
        console.log("response: ", response)
        if (response.status != 200) {
            return []
        }
        const data = response.data.data;

        // Transform API response to match the Project interface
        return data.map((item: any) => ({
            id: item.id,
            name: item.name,
            lastActivity: new Date(item.updated_at * 1000).toLocaleString(),
            icon: item.full_name.includes('github') ? 'github' : item.name.charAt(0).toUpperCase(),
        }));
    } catch (error) {
        console.error('Error fetching projects:', error);
        return [];
    }
};

const ProjectsCard = () => {
    const router = useRouter()
    const [projects, setProjects] = useState<Project[]>([]);

    useEffect(() => {
        // Fetch projects from the API
        const getProjects = async () => {
            const data = await fetchProjects();
            console.log("data: ", data)
            setProjects(data);
            console.log("Project: ", projects)
        };
        getProjects();
    }, []);
    const handleOnClickButtonAddNew = () => {
        router.push("/dashboard/projects/new")
    }

    return (
        <Container fluid style={{ padding: '20px' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Projects</h2>
                <Button variant="primary" onClick={handleOnClickButtonAddNew}>Add Project</Button>
            </div>

            <div className="d-flex mb-3">
                <Button variant="outline-secondary" className="me-2">
                    <FiSearch />
                </Button>
                <Dropdown className="me-2">
                    <Dropdown.Toggle variant="outline-secondary" id="sort-dropdown">
                        Sort
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item href="#">Last Updated</Dropdown.Item>
                        <Dropdown.Item href="#">Name</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                <Dropdown>
                    <Dropdown.Toggle variant="outline-secondary" id="filter-dropdown">
                        Filter: Mine
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item href="#">All</Dropdown.Item>
                        <Dropdown.Item href="#">Mine</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
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
                                        <img
                                            src="/github-icon.png" // Placeholder path for GitHub icon
                                            alt="GitHub"
                                            style={{ width: '24px', height: '24px' }}
                                        />
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
    );
};

export default ProjectsCard;
