// StageDetailModal.tsx

'use client';
import React from 'react';
import { Modal, Button, Container, Form, Card } from 'react-bootstrap';
import { Stage } from '../../props/pipeline.props';


interface StageDetailModalProps {
    show: boolean;
    handleClose: () => void;
    stage: Stage; // Accept stage prop
}

const StageDetailModal: React.FC<StageDetailModalProps> = ({ show, handleClose, stage }) => {
    return (
        <Modal show={show} onHide={handleClose} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Stage Details: {stage.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container>
                    <Card className="mb-3">
                        <Card.Header as="h5">Commands</Card.Header>
                        <Card.Body>
                            <Form.Control as="textarea" rows={4} defaultValue={stage.execute_commands?.join('\n')} />
                        </Card.Body>
                    </Card>
                    <Form.Group controlId="shellSelect" style={{ width: '45%' }}>
                        <Form.Label>Shell</Form.Label>
                        <Form.Select defaultValue={stage.shell}>
                            <option>Bash</option>
                            <option>Sh</option>
                            <option>Zsh</option>
                        </Form.Select>
                    </Form.Group>
                    <Button variant="primary" size="lg" className="w-100" onClick={handleClose}>
                        Save changes
                    </Button>
                </Container>
            </Modal.Body>
        </Modal>
    );
};

export default StageDetailModal;
