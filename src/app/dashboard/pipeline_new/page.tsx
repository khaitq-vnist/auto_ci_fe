'use client';

import projectService from '@/utils/api/project.service';
import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Container, Collapse, Spinner } from 'react-bootstrap';


interface Command {
    id: number;
    command: string;
}

interface Variable {
    id: number;
    key: string;
    value: string;
}

interface Service {
    id: number;
    type: string;
    version: string;
}

interface Stage {
    id: number;
    name: string;
    type: string;
    docker_image: string;
    docker_image_tag: string;
    commands: Command[];
    variables: Variable[] | null;
    services: Service[] | null;
}

interface Pipeline {
    id: number;
    name: string;
    build_tool: string;
    description: string;
    stages: Stage[];
}

const PipelineNew: React.FC = () => {
    const [pipeline, setPipeline] = useState<Pipeline | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedStageId, setExpandedStageId] = useState<number | null>(null);

    useEffect(() => {
        const loadTemplate = async () : Promise<any> => {
            try {
                setLoading(true);
                const template = await projectService.fetchPipelineTemplate('maven');
                setPipeline(template.data.data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadTemplate();
    }, []);

    const updateStageDetail = (id: number, key: keyof Stage, value: any) => {
        setPipeline((prev) =>
            prev
                ? {
                      ...prev,
                      stages: prev.stages.map((stage) =>
                          stage.id === id ? { ...stage, [key]: value } : stage
                      ),
                  }
                : prev
        );
    };

    const handleCreatePipeline = () => {
        console.log('Final Pipeline Data:', pipeline);
        // Pass `pipeline` to backend API or handle it as needed
    };

    if (loading) {
        return (
            <Container className="text-center mt-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="text-center mt-5">
                <p className="text-danger">Error: {error}</p>
            </Container>
        );
    }

    if (!pipeline) {
        return (
            <Container className="text-center mt-5">
                <p>No pipeline template available.</p>
            </Container>
        );
    }

    return (
        <Container>
            <h3>Pipeline: {pipeline.name}</h3>
            <p>{pipeline.description}</p>

            {pipeline.stages.map((stage) => {
                const isExpanded = expandedStageId === stage.id;

                return (
                    <Card key={stage.id} className="mb-3">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center">
                                <Form.Check
                                    type="checkbox"
                                    id={`stage-status-${stage.id}`}
                                    label={stage.name}
                                    checked={stage.type === 'enabled'}
                                    onChange={() =>
                                        updateStageDetail(
                                            stage.id,
                                            'type',
                                            stage.type === 'enabled' ? 'disabled' : 'enabled'
                                        )
                                    }
                                />
                                <Button
                                    variant="outline-primary"
                                    size="sm"
                                    onClick={() =>
                                        isExpanded ? setExpandedStageId(null) : setExpandedStageId(stage.id)
                                    }
                                >
                                    {isExpanded ? 'Hide Details' : 'Show Details'}
                                </Button>
                            </div>

                            <Collapse in={isExpanded}>
                                <div className="mt-3">
                                    <Card>
                                        <Card.Body>
                                            <Card.Title>Details for {stage.name}</Card.Title>

                                            {/* Commands */}
                                            <Form.Group className="mb-3">
                                                <Form.Label>Commands</Form.Label>
                                                <Form.Control
                                                    as="textarea"
                                                    rows={3}
                                                    value={stage.commands.map((cmd) => cmd.command).join('\n')}
                                                    onChange={(e) => {
                                                        const commands = e.target.value
                                                            .split('\n')
                                                            .map((command, index) => ({
                                                                id: index + 1,
                                                                command,
                                                            }));
                                                        updateStageDetail(stage.id, 'commands', commands);
                                                    }}
                                                />
                                            </Form.Group>

                                            {/* Variables */}
                                            <Card className="mb-3">
                                                <Card.Header>Variables</Card.Header>
                                                <Card.Body>
                                                    {stage.variables?.map((variable, index) => (
                                                        <div key={index} className="mb-3">
                                                            <Form.Control
                                                                type="text"
                                                                placeholder="Key"
                                                                className="mb-2"
                                                                value={variable.key}
                                                                onChange={(e) =>
                                                                    updateStageDetail(
                                                                        stage.id,
                                                                        'variables',
                                                                        stage.variables?.map((v, i) =>
                                                                            i === index
                                                                                ? { ...v, key: e.target.value }
                                                                                : v
                                                                        )
                                                                    )
                                                                }
                                                            />
                                                            <Form.Control
                                                                type="text"
                                                                placeholder="Value"
                                                                value={variable.value}
                                                                onChange={(e) =>
                                                                    updateStageDetail(
                                                                        stage.id,
                                                                        'variables',
                                                                        stage.variables?.map((v, i) =>
                                                                            i === index
                                                                                ? { ...v, value: e.target.value }
                                                                                : v
                                                                        )
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                    ))}
                                                    <Button
                                                        variant="outline-primary"
                                                        size="sm"
                                                        onClick={() =>
                                                            updateStageDetail(stage.id, 'variables', [
                                                                ...(stage.variables || []),
                                                                { id: (stage.variables?.length ?? 0) + 1, key: '', value: '' },
                                                            ])
                                                        }
                                                    >
                                                        + Add Variable
                                                    </Button>
                                                </Card.Body>
                                            </Card>

                                            {/* Services */}
                                            {stage.services && (
                                                <Card className="mb-3">
                                                    <Card.Header>Services</Card.Header>
                                                    <Card.Body>
                                                        {stage.services.map((service, index) => (
                                                            <div key={index}>
                                                                <p>
                                                                    <strong>Type:</strong> {service.type}
                                                                </p>
                                                                <p>
                                                                    <strong>Version:</strong> {service.version}
                                                                </p>
                                                            </div>
                                                        ))}
                                                    </Card.Body>
                                                </Card>
                                            )}
                                        </Card.Body>
                                    </Card>
                                </div>
                            </Collapse>
                        </Card.Body>
                    </Card>
                );
            })}

            <Button variant="success" className="mt-3" onClick={handleCreatePipeline}>
                Create New Pipeline
            </Button>
        </Container>
    );
};

export default PipelineNew;
