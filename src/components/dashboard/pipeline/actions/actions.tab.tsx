// ActionsTab.tsx

import React, { useState } from 'react';
import { Row, Col, Card, Form, Button, Modal, Tab, Nav } from 'react-bootstrap';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

interface Stage {
    id: string;
    name: string;
}

interface ActionsTabProps {
    stages: Stage[];
    setStages: React.Dispatch<React.SetStateAction<Stage[]>>;
}

const buildTools = [
    { name: 'Maven', version: '3.9.9' },
    { name: 'Gradle', version: '7.2' },
    { name: 'Ant', version: '1.10.11' }
];

const testTools = [
    { name: 'JUnit', version: '5.7.2' },
    { name: 'Mockito', version: '3.9.0' },
    { name: 'Cypress', version: '8.2.0' }
];

const ActionsTab: React.FC<ActionsTabProps> = ({ stages, setStages }) => {
    const [showModal, setShowModal] = useState<boolean>(false);
    const [selectedTab, setSelectedTab] = useState<string>('build');

    // Function to open the modal
    const openModal = () => setShowModal(true);

    // Function to close the modal
    const closeModal = () => setShowModal(false);

    // Add a stage based on selected tool
    const addStage = (tool: { name: string; version: string }) => {
        const newStage: Stage = { id: `${tool.name}-${stages.length}`, name: `${tool.name} v${tool.version}` };
        setStages([...stages, newStage]);
        closeModal(); // Close the modal after adding
    };

    // Handle drag and drop for reordering stages
    const onDragEnd = (result: DropResult) => {
        const { source, destination } = result;
        if (!destination) return;

        const reorderedStages = Array.from(stages);
        const [movedStage] = reorderedStages.splice(source.index, 1);
        reorderedStages.splice(destination.index, 0, movedStage);
        setStages(reorderedStages);
    };

    return (
        <>
            <h3>Configure Pipeline Stages</h3>
            <Button variant="primary" onClick={openModal} className="mb-3">
                + Add New Stage
            </Button>
            
            {/* Modal for choosing stage type */}
            <Modal show={showModal} onHide={closeModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Choose Stage Type</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Tab.Container defaultActiveKey="build">
                        <Nav variant="tabs">
                            <Nav.Item>
                                <Nav.Link eventKey="build" onClick={() => setSelectedTab('build')}>Build</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="test" onClick={() => setSelectedTab('test')}>Test</Nav.Link>
                            </Nav.Item>
                        </Nav>
                        <Tab.Content className="mt-3">
                            <Tab.Pane eventKey="build">
                                <Row>
                                    {buildTools.map((tool) => (
                                        <Col key={tool.name} xs={12} md={6} className="mb-3">
                                            <Card onClick={() => addStage(tool)} style={{ cursor: 'pointer' }}>
                                                <Card.Body>
                                                    <Card.Title>{tool.name}</Card.Title>
                                                    <Card.Text>Version: {tool.version}</Card.Text>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    ))}
                                </Row>
                            </Tab.Pane>
                            <Tab.Pane eventKey="test">
                                <Row>
                                    {testTools.map((tool) => (
                                        <Col key={tool.name} xs={12} md={6} className="mb-3">
                                            <Card onClick={() => addStage(tool)} style={{ cursor: 'pointer' }}>
                                                <Card.Body>
                                                    <Card.Title>{tool.name}</Card.Title>
                                                    <Card.Text>Version: {tool.version}</Card.Text>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    ))}
                                </Row>
                            </Tab.Pane>
                        </Tab.Content>
                    </Tab.Container>
                </Modal.Body>
            </Modal>

            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="stages">
                    {(provided) => (
                        <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            style={{
                                minHeight: '150px',
                                border: '1px solid #ddd',
                                borderRadius: '5px',
                                padding: '10px',
                                marginBottom: '20px'
                            }}
                        >
                            {stages.map((stage, index) => (
                                <Draggable key={stage.id} draggableId={stage.id} index={index}>
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            style={{
                                                padding: '10px',
                                                backgroundColor: '#f8f9fa',
                                                marginBottom: '10px',
                                                borderRadius: '5px',
                                                ...provided.draggableProps.style
                                            }}
                                        >
                                            <div className="d-flex justify-content-between align-items-center">
                                                <span>{stage.name}</span>
                                                <Form.Check type="switch" label="Enable" />
                                            </div>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </>
    );
};

export default ActionsTab;
