'use client';

import React, { useState } from 'react';
import { Row, Col, Card, Form, Button, Modal, Tab, Nav } from 'react-bootstrap';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { useYamlContext } from '../context/yaml.context';
import { useRouter } from 'next/navigation';
import { Stage } from '../props/pipeline.props';
import StageDetailModal from './stages/detail.stage';


const buildTools = [
    { name: 'Maven', version: '3.9.9' },
    { name: 'Gradle', version: '7.2' },
    { name: 'Ant', version: '1.10.11' }
];

const ActionsTab: React.FC = () => {
    const { yamlData, updateYamlField } = useYamlContext();
    const [showModal, setShowModal] = useState<boolean>(false);
    const [showStageDetailModal, setShowStageDetailModal] = useState<boolean>(false);
    const [selectedStage, setSelectedStage] = useState<Stage | null>(null); // State for selected Stage

    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);

    const openStageDetailModal = (stage: Stage) => {
        setSelectedStage(stage); // Set selected stage data
        setShowStageDetailModal(true);
    };

    const closeStageDetailModal = () => setShowStageDetailModal(false);

    const addStage = (tool: { name: string; version: string }) => {
        const newStage: Stage = {
            id: yamlData.actions.length + 1,
            name: tool.name,
            docker_image_name: `library/${tool.name.toLowerCase()}`,
            docker_image_tag: tool.version,
            setup_commands: ["apt-get update -y", "apt-get install -y wget"],
            execute_commands: [`${tool.name.toLowerCase()} clean install`],
            variables: [{ key: "fileName", value: "ls.log" }],
            shell: "bash",
            services: [
                { type: "MYSQL", id: yamlData.actions.length * 2 + 1 },
                { type: "MONGO_DB", id: yamlData.actions.length * 2 + 2 }
            ]
        };

        updateYamlField("actions", [...yamlData.actions, newStage]);
        closeModal();

        if (tool.name === 'Maven') {
            openStageDetailModal(newStage);
        }
    };

    const onDragEnd = (result: DropResult) => {
        const { source, destination } = result;
        if (!destination) return;

        const reorderedStages = Array.from(yamlData.actions);
        const [movedStage] = reorderedStages.splice(source.index, 1);
        reorderedStages.splice(destination.index, 0, movedStage);

        updateYamlField("actions", reorderedStages);
    };

    return (
        <>
            <h3>Configure Pipeline Stages</h3>
            <Button variant="primary" onClick={openModal} className="mb-3">
                + Add New Stage
            </Button>

            <Modal show={showModal} onHide={closeModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Choose Stage Type</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Tab.Container defaultActiveKey="build">
                        <Nav variant="tabs">
                            <Nav.Item>
                                <Nav.Link eventKey="build">Build</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="test">Test</Nav.Link>
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
                        </Tab.Content>
                    </Tab.Container>
                </Modal.Body>
            </Modal>

            {/* Pass selectedStage data to StageDetailModal */}
            {selectedStage && (
                <StageDetailModal
                    show={showStageDetailModal}
                    handleClose={closeStageDetailModal}
                    stage={selectedStage} // Pass selected stage data to modal
                />
            )}

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
                            {yamlData.actions.map((stage, index) => (
                                <Draggable key={stage.id.toString()} draggableId={stage.id.toString()} index={index}>
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.draggableProps.style}
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
