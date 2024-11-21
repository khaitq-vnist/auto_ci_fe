'use client';

import React, { useEffect, useState } from 'react';
import { Card, Form, Button, Container, Collapse } from 'react-bootstrap';

import { Stage } from '../props/pipeline.props';
import ServiceTab from './stages/tabs/service.tab';
import { useYamlContext } from '../context/yaml.context';

const mockApiFetchStages = async (): Promise<Stage[]> => {
    return Promise.resolve([
        {
            id: 1,
            name: 'Build',
            status: 'enabled',
            docker_image_name: 'library/maven',
            docker_image_tag: '3.9.9',
            execute_commands: ['mvn clean install'],
            setup_commands: ['apt-get update -y', 'apt-get install -y wget'],
            variables: [{ key: 'BUILD_ENV', value: 'production' }],
            services: [],
            shell: 'bash',
        },
        {
            id: 2,
            name: 'Test',
            status: 'enabled',
            docker_image_name: 'library/maven',
            docker_image_tag: '3.9.9',
            execute_commands: ['mvn test'],
            setup_commands: [],
            variables: [{ key: 'TEST_ENV', value: 'staging' }],
            services: [],
            shell: 'bash',
        },
        {
            id: 3,
            name: 'Quality Gate',
            status: 'enabled',
            docker_image_name: 'library/sonarqube',
            docker_image_tag: 'latest',
            execute_commands: ['sonar-scanner'],
            setup_commands: [],
            variables: [],
            services: [],
            shell: 'bash',
        },
    ]);
};

const ActionsTab: React.FC = () => {
    const { yamlData, updateYamlField } = useYamlContext();
    const [stages, setStages] = useState<Stage[]>([]);
    const [expandedStageId, setExpandedStageId] = useState<number | null>(null);

    useEffect(() => {
        const fetchStages = async () => {
            const recommendedStages = await mockApiFetchStages();
            setStages(recommendedStages);

            // Initialize YAML actions with fetched stages
            const formattedActions = recommendedStages.map((stage) => ({
                name: stage.name,
                id: stage.id!,
                action: stage.name,
                action_id: stage.id!,
                type: 'BUILD',
                status: stage.status,
                working_directory: '/workspace',
                docker_image_name: stage.docker_image_name,
                docker_image_tag: stage.docker_image_tag,
                execute_commands: stage.execute_commands || [],
                setup_commands: stage.setup_commands || [],
                cached_dirs: [],
                variables: stage.variables || [],
                shell: stage.shell || 'bash',
                main_service_name: '',
                cache_base_image: true,
                services: stage.services || [],
            }));
            updateYamlField('actions', formattedActions);
        };
        fetchStages();
    }, []);

    const saveStageDetails = (id: number) => {
        const updatedStage = stages.find((stage) => stage.id === id);

        if (!updatedStage) return;

        // Update YAML actions
        const updatedActions = yamlData.actions.map((action) =>
            action.id === id
                ? {
                      ...action,
                      execute_commands: updatedStage.execute_commands,
                      setup_commands: updatedStage.setup_commands,
                      variables: updatedStage.variables,
                      shell: updatedStage.shell,
                      services: updatedStage.services?.map((service, index) => ({
                          ...service,
                          id: index + 1,
                      })),
                  }
                : action
        );

        updateYamlField('actions', updatedActions);
        setExpandedStageId(null); // Close expanded view
    };

    const updateStageDetail = (id: number, key: keyof Stage, value: any) => {
        setStages((prevStages) => {
            const stageToUpdate = prevStages.find((stage) => stage.id === id);
            if (!stageToUpdate) return prevStages;
    
            const updatedStages = prevStages.map((stage) =>
                stage.id === id ? { ...stage, [key]: value } : stage
            );
    
            return updatedStages;
        });
    };
    

    return (
        <Container>
            <h3>Pipeline Stages</h3>
            {stages.map((stage) => {
                const isExpanded = expandedStageId === stage.id;

                return (
                    <Card key={stage.id} className="mb-3">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center">
                                <Form.Check
                                    type="checkbox"
                                    id={`stage-status-${stage.id}`}
                                    label={stage.name}
                                    checked={stage.status === 'enabled'}
                                    onChange={() =>
                                        setStages((prevStages) =>
                                            prevStages.map((s) =>
                                                s.id === stage.id
                                                    ? {
                                                          ...s,
                                                          status: s.status === 'enabled' ? 'disabled' : 'enabled',
                                                      }
                                                    : s
                                            )
                                        )
                                    }
                                />
                                <Button
                                    variant="outline-primary"
                                    size="sm"
                                    onClick={() =>
                                        isExpanded ? saveStageDetails(stage.id!) : setExpandedStageId(stage.id!)
                                    }
                                >
                                    {isExpanded ? 'Save' : 'Show Details'}
                                </Button>
                            </div>

                            <Collapse in={isExpanded}>
                                <div className="mt-3">
                                    <Card>
                                        <Card.Body>
                                            <Card.Title>Details for {stage.name}</Card.Title>

                                            {/* Commands */}
                                            <Form.Group className="mb-3">
                                                <Form.Label>Execute Commands</Form.Label>
                                                <Form.Control
                                                    as="textarea"
                                                    rows={3}
                                                    value={stage.execute_commands?.join('\n') || ''}
                                                    onChange={(e) => {
                                                        const newValue = e.target.value.split('\n'); // Split the input into an array of commands
                                                        setStages((prevStages) =>
                                                        prevStages.map((s) =>
                                                            s.id === stage.id
                                                            ? { ...s, execute_commands: newValue } // Update execute_commands with the new array
                                                            : s
                                                        )
                                                        );
                                                    }}
                                                    />
                                            </Form.Group>

                                            {/* Shell */}
                                            <Form.Group className="mb-3">
                                                <Form.Label>Shell</Form.Label>
                                                <Form.Select
                                                    value={stage.shell}
                                                    onChange={(e) =>
                                                        updateStageDetail(stage.id!, 'shell', e.target.value)
                                                    }
                                                >
                                                    <option value="bash">Bash</option>
                                                    <option value="sh">Sh</option>
                                                    <option value="zsh">Zsh</option>
                                                </Form.Select>
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
                                                                        stage.id!,
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
                                                                        stage.id!,
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
                                                            updateStageDetail(stage.id!, 'variables', [
                                                                ...(stage.variables || []),
                                                                { key: '', value: '' },
                                                            ])
                                                        }
                                                    >
                                                        + Add Variable
                                                    </Button>
                                                </Card.Body>
                                            </Card>

                                            {/* Services Tab */}
                                            <ServiceTab
                                                initialServices={stage.services || []}
                                                onUpdateServices={(updatedServices) =>
                                                    updateStageDetail(stage.id!, 'services', updatedServices)
                                                }
                                            />
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

export default ActionsTab;
