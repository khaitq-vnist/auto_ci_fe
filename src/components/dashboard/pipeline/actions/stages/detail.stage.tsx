// StageDetailModal.tsx

'use client';
import React, { useState } from 'react';
import { Modal, Button, Container, Form, Card, Nav, Tab } from 'react-bootstrap';
import { Service, Stage } from '../../props/pipeline.props';
import ServiceTab from './tabs/service.tab';


interface StageDetailModalProps {
    show: boolean;
    handleClose: () => void;
    stage: Stage;
    onSaveStage: (updatedStage: Stage) => void; // Callback to save the updated stage
}

const StageDetailModal: React.FC<StageDetailModalProps> = ({ show, handleClose, stage, onSaveStage }) => {
    const [selectedTab, setSelectedTab] = useState<string>('commands');
    const [services, setServices] = useState<Service[]>(stage.services || []); // Initialize with existing services
    
    // Handler to update services
    const handleServiceUpdate = (updatedServices: Service[]) => {
        setServices(updatedServices);
    };

    // Save changes including updated services
    const handleSaveChanges = () => {
        console.log('stage: ', stage)
        const updatedStage = {
            services,
        };
        console.log('updatedStage', updatedStage)
        onSaveStage(updatedStage); // Call the save function passed as a prop
        handleClose();
    };

    return (
        <Modal show={show} onHide={handleClose} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Stage Details: {stage.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container>
                    {/* Navigation Tabs */}
                    <Tab.Container activeKey={selectedTab} onSelect={(tab) => setSelectedTab(tab || 'commands')}>
                        <Nav variant="tabs" className="justify-content-start mb-3">
                            <Nav.Item>
                                <Nav.Link eventKey="commands">Commands</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="services">Services</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="variables">Variables</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="shell">Shell</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="options">Options</Nav.Link>
                            </Nav.Item>
                        </Nav>

                        <Tab.Content>
                            {/* Commands Tab */}
                            <Tab.Pane eventKey="commands">
                                <Card className="mb-3">
                                    <Card.Header as="h5">Commands</Card.Header>
                                    <Card.Body>
                                        <Form.Control
                                            as="textarea"
                                            rows={4}
                                            defaultValue={stage.execute_commands?.join('\n')}
                                            onChange={(e) => stage.execute_commands = e.target.value.split('\n')}
                                        />
                                    </Card.Body>
                                </Card>
                            </Tab.Pane>

                            {/* Services Tab */}
                            <Tab.Pane eventKey="services">
                                <ServiceTab initialServices={services} onUpdateServices={handleServiceUpdate} />
                            </Tab.Pane>

                            {/* Variables Tab */}
                            <Tab.Pane eventKey="variables">
                                <Card className="mb-3">
                                    <Card.Header as="h5">Variables</Card.Header>
                                    <Card.Body>
                                        {stage.variables?.map((variable, index) => (
                                            <div key={index}>
                                                <strong>Key:</strong> {variable.key} <br />
                                                <strong>Value:</strong> {variable.value} <br />
                                            </div>
                                        ))}
                                    </Card.Body>
                                </Card>
                            </Tab.Pane>

                            {/* Shell Tab */}
                            <Tab.Pane eventKey="shell">
                                <Form.Group controlId="shellSelect" className="mb-3">
                                    <Form.Label>Shell</Form.Label>
                                    <Form.Select defaultValue={stage.shell}
                                        onChange={(e) => stage.shell = e.target.value}
                                    >
                                        <option>Bash</option>
                                        <option>Sh</option>
                                        <option>Zsh</option>
                                    </Form.Select>
                                </Form.Group>
                            </Tab.Pane>
                            <Tab.Pane eventKey="options">
                                <Card className="mb-3">
                                    <Card.Header as="h5">Name Stages</Card.Header>
                                    <Card.Body>
                                        <Form.Control
                                            as="textarea"
                                            rows={4}
                                            defaultValue={stage.name} 
                                            onChange={(e) => stage.name = e.target.value}
                                        />
                                    </Card.Body>
                                </Card>
                            </Tab.Pane>
                        </Tab.Content>
                    </Tab.Container>

                    <Button variant="primary" size="lg" className="w-100" onClick={handleSaveChanges}>
                        Save changes
                    </Button>
                </Container>
            </Modal.Body>
        </Modal>
    );
};

export default StageDetailModal;
