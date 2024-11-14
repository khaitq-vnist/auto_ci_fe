// ServiceTab.tsx

'use client';
import React, { useState, useEffect } from 'react';
import { Container, Button, Card, Table, Modal, Row, Col, Form } from 'react-bootstrap';
import { Service } from '../../../props/pipeline.props';
import ServiceConfiguration from './serviceconfig.tab';


interface ServiceTabProps {
    initialServices: Service[];
    onUpdateServices: (updatedServices: Service[]) => void;
}

const ServiceTab: React.FC<ServiceTabProps> = ({ initialServices, onUpdateServices }) => {
    const [services, setServices] = useState<Service[]>(initialServices);
    const [showAddServiceModal, setShowAddServiceModal] = useState(false);
    const [selectedService, setSelectedService] = useState<string | null>(null);

    useEffect(() => {
        onUpdateServices(services);
    }, [services, onUpdateServices]);

    const openAddServiceModal = () => setShowAddServiceModal(true);
    const closeAddServiceModal = () => setShowAddServiceModal(false);

    const handleServiceSelect = (service: string) => {
        setSelectedService(service);
        closeAddServiceModal();
    };

    const handleSaveServiceConfiguration = (config: Service) => {
        console.log("config", config)
        setServices((prevServices) => [...prevServices, config]);
        console.log(services);
        setSelectedService(null); // Clear selection after saving
    };

    const handleDeleteService = (index: number) => {
        setServices((prevServices) => prevServices.filter((_, i) => i !== index));
    };

    return (
        <Container>
            {/* Main Action Container Hostname */}
            <Card className="mb-3">
                <Card.Header as="h5">MAIN ACTION CONTAINER HOSTNAME</Card.Header>
                <Card.Body>
                    <Form.Control type="text" defaultValue="MainService" />
                </Card.Body>
            </Card>

            {/* Services Section */}
            <Card className="mb-3">
                <Card.Header as="h5">SERVICES</Card.Header>
                <Card.Body>
                    <Table borderless responsive>
                        <thead>
                            <tr>
                                <th>Service</th>
                                <th>Access Details</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {services.map((service, index) => (
                                <tr key={index}>
                                    <td>{service.type} @ {service.docker_image_tag || 'latest'}</td>
                                    <td>
                                        <div>host: {service.host}</div>
                                        <div>port: {service.port}</div>
                                        <div>user: {service.user}</div>
                                        <div>pass: {service.password}</div>
                                    </td>
                                    <td>
                                        <Button
                                            variant="outline-danger"
                                            size="sm"
                                            onClick={() => handleDeleteService(index)}
                                        >
                                            <i className="bi bi-trash"></i>
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <Button variant="outline-primary" onClick={openAddServiceModal}>
                        +
                    </Button>
                </Card.Body>
            </Card>

            {/* Add Service Modal */}
            <Modal show={showAddServiceModal} onHide={closeAddServiceModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Select a Service</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container>
                        <Row>
                            <Col xs={4} className="mb-3">
                                <Card onClick={() => handleServiceSelect('MySQL')} style={{ cursor: 'pointer' }}>
                                    <Card.Body>
                                        <Card.Title>MySQL</Card.Title>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col xs={4} className="mb-3">
                                <Card onClick={() => handleServiceSelect('PostgreSQL')} style={{ cursor: 'pointer' }}>
                                    <Card.Body>
                                        <Card.Title>PostgreSQL</Card.Title>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                </Modal.Body>
            </Modal>

            {/* Service Configuration Modal */}
            {selectedService && (
                <ServiceConfiguration
                    service={selectedService}
                    onSave={handleSaveServiceConfiguration}
                    onClose={() => setSelectedService(null)}
                />
            )}
        </Container>
    );
};

export default ServiceTab;
