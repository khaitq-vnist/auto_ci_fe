'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Container, Card, Spinner, Alert, Row, Col, Button } from 'react-bootstrap';
import projectService from '@/utils/api/project.service';

interface Branch {
    name: string;
    default: boolean;
}

interface ActionExecution {
    status: string;
    progress: number;
    action: {
        id: number;
        name: string;
        type: string;
        trigger_time: string;
        start_date: number;
        finish_date: number;
        last_execution_status: string;
    };
}

interface ExecutionDetail {
    id: number;
    start_date: number;
    finish_date: number;
    status: string;
    triggered_on: string;
    branch: Branch;
    action_executions: ActionExecution[];
}

const ExecutionDetailPage: React.FC = () => {
    const [execution, setExecution] = useState<ExecutionDetail | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const params = useParams();

    useEffect(() => {
        const fetchExecutionDetail = async () => {
            try {
                setLoading(true);
                const { id, pipelineId, executionId } = params;
                const response = await projectService.fetchExecutionDetail(Number(id), Number(pipelineId), Number(executionId));

                if (response.status === 200 && response.data) {
                    setExecution(response.data.data);
                } else {
                    throw new Error('Failed to fetch execution detail.');
                }
            } catch (err: any) {
                setError(err.message || 'An error occurred while fetching the execution detail.');
            } finally {
                setLoading(false);
            }
        };

        fetchExecutionDetail();
    }, [params]);

    const formatDate = (timestamp: number): string => {
        const date = new Date(timestamp * 1000);
        return date.toLocaleString();
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

    if (!execution) {
        return (
            <Container className="mt-4">
                <Alert variant="warning">No execution detail available.</Alert>
            </Container>
        );
    }

    return (
        <Container className="mt-5">
            <h3 style={{ marginBottom: '1.5rem' }}>Execution Detail</h3>

            {/* Execution Overview */}
            <Card style={{ marginBottom: '1.5rem' }}>
                <Card.Body>
                    <Row style={{ marginBottom: '0.5rem' }}>
                        <Col>
                            <strong>Status:</strong> {execution.status}
                        </Col>
                        <Col>
                            <strong>Triggered On:</strong> {execution.triggered_on}
                        </Col>
                        <Col>
                            <strong>Branch:</strong> {execution.branch.name} {execution.branch.default ? '(default)' : ''}
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <strong>Start Date:</strong> {formatDate(execution.start_date)}
                        </Col>
                        <Col>
                            <strong>Finish Date:</strong> {formatDate(execution.finish_date)}
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* Action Executions */}
            {execution.action_executions.map((actionExecution, index) => (
                <Card key={index} style={{ marginBottom: '1rem', border: '1px solid #dee2e6', borderRadius: '0.5rem' }}>
                    <Card.Body className="d-flex align-items-center">
                        <Button
                            variant="link"
                            style={{
                                fontSize: '1.5rem',
                                padding: 0,
                                marginRight: '1rem',
                                color: '#007bff',
                                textDecoration: 'none',
                            }}
                            onClick={() => console.log('Toggle details')}
                        >
                            &gt;
                        </Button>
                        <div style={{ flexGrow: 1 }}>
                            <strong>{actionExecution.action.name}</strong>
                            <p style={{ margin: 0, color: '#6c757d', fontSize: '0.875rem' }}>
                                Status: {actionExecution.status} | Duration:{' '}
                                {actionExecution.action.finish_date - actionExecution.action.start_date}s
                            </p>
                        </div>
                        <div
                            style={{
                                backgroundColor: actionExecution.status === 'SUCCESSFUL' ? '#28a745' : '#dc3545',
                                color: '#fff',
                                borderRadius: '50%',
                                width: '50px',
                                height: '50px',
                                lineHeight: '50px',
                                textAlign: 'center',
                                marginLeft: 'auto',
                            }}
                        >
                            {actionExecution.action.finish_date - actionExecution.action.start_date}s
                        </div>
                    </Card.Body>
                </Card>
            ))}
        </Container>
    );
};

export default ExecutionDetailPage;
