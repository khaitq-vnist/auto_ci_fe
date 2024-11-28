'use client';

import projectService from '@/utils/api/project.service';
import React, { useEffect, useState } from 'react';
import { Card, Form, Button, Container, Collapse, Spinner, Alert } from 'react-bootstrap';

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

const fetchPipelineTemplate = async (buildTool: string): Promise<Pipeline> => {
    const response = await projectService.fetchPipelineTemplate(buildTool);

    if (response.status !== 200) {
        throw new Error(response.data.message || 'Failed to fetch pipeline template.');
    }
    return response.data.data;
};

const PipelineStages: React.FC<{
    buildTool: string;
    onPipelineChange: (pipeline: Pipeline) => void; // Callback to pass updated pipeline data
}> = ({ buildTool, onPipelineChange }) => {
    const [pipeline, setPipeline] = useState<Pipeline | null>(null);
    const [expandedStageId, setExpandedStageId] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const loadPipelineTemplate = async () => {
            try {
                setLoading(true);
                const template = await fetchPipelineTemplate(buildTool);

                if (isMounted) {
                    // Enable all stages by default
                    const enabledStages = template.stages.map((stage) => ({
                        ...stage,
                        type: 'enabled',
                    }));
                    const updatedPipeline = { ...template, stages: enabledStages };
                    setPipeline(updatedPipeline);

                    // Pass the initial pipeline to the parent
                    onPipelineChange(updatedPipeline);
                }
            } catch (err: any) {
                if (isMounted) setError(err.message || 'An error occurred while fetching the pipeline template.');
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        loadPipelineTemplate();

        return () => {
            isMounted = false;
        };
    }, []);

    const updateStageDetail = (id: number, key: keyof Stage, value: any) => {
        if (!pipeline) return;

        const updatedPipeline = {
            ...pipeline,
            stages: pipeline.stages.map((stage) =>
                stage.id === id ? { ...stage, [key]: value } : stage
            ),
        };

        setPipeline(updatedPipeline);

        onPipelineChange(updatedPipeline);
    };

    if (loading) {
        return (
            <Container className="text-center mt-4">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="mt-4">
                <Alert variant="danger">{error}</Alert>
            </Container>
        );
    }

    if (!pipeline) {
        return <Container className="mt-4">No pipeline data available.</Container>;
    }

    return (
        <Container>
            <h3 className="mb-4">Pipeline Stages</h3>
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
                                            {/* Docker Image */}
                                            <Form.Group className="mb-3">
                                                <Form.Label>Docker Image</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={stage.docker_image}
                                                    onChange={(e) =>
                                                        updateStageDetail(stage.id, 'docker_image', e.target.value)
                                                    }
                                                />
                                            </Form.Group>

                                            {/* Docker Image Tag */}
                                            <Form.Group className="mb-3">
                                                <Form.Label>Docker Image Tag</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={stage.docker_image_tag}
                                                    onChange={(e) =>
                                                        updateStageDetail(stage.id, 'docker_image_tag', e.target.value)
                                                    }
                                                />
                                            </Form.Group>

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
                                                                { id: Date.now(), key: '', value: '' },
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
                                                            <div key={index} className="mb-3">
                                                                <strong>Type:</strong> {service.type} <br />
                                                                <strong>Version:</strong> {service.version}
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
        </Container>
    );
};

export default PipelineStages;