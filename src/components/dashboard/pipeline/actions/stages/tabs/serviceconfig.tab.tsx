// ServiceConfiguration.tsx

import React, { useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { Service } from '../../../props/pipeline.props';


interface ServiceConfigurationProps {
    service: string;
    onSave: (config: Service) => void;
    onClose: () => void;
}

const ServiceConfiguration: React.FC<ServiceConfigurationProps> = ({ service, onSave, onClose }) => {
    const [host, setHost] = useState('localhost');
    const [port, setPort] = useState(service === 'MySQL' ? '3306' : '5432'); // Default ports
    const [user, setUser] = useState('root');
    const [password, setPassword] = useState('root');
    const [version, setVersion] = useState('latest');

    const handleSave = () => {
        onSave({
            type: service,
            docker_image_tag: version,
            host,
            port,
            user,
            password,
        });
        onClose();
    };

    return (
        <Modal show onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Configure {service}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="host">
                        <Form.Label>Hostname</Form.Label>
                        <Form.Control type="text" value={host} onChange={(e) => setHost(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="port">
                        <Form.Label>Port</Form.Label>
                        <Form.Control type="text" value={port} onChange={(e) => setPort(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="user">
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="text" value={user} onChange={(e) => setUser(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="version">
                        <Form.Label>Version</Form.Label>
                        <Form.Control type="text" value={version} onChange={(e) => setVersion(e.target.value)} />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleSave}>
                    Add this service
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ServiceConfiguration;
