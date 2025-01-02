'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Container, Card, Spinner, Alert, Row, Col, Button, Table, Modal } from 'react-bootstrap';
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
    log?: string[];
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
    const [actionExecution, setActionExecution] = useState<ActionExecution | null>(null);
    const [showLogModal, setShowLogModal] = useState(false);
    const [logs, setLogs] = useState<string[]>([]);
    const params = useParams();
    const [isPolling, setIsPolling] = useState<boolean>(false);
    const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);

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

    const fetchDetailLogs = async (actionId: number) => {
        try {
            const { id, pipelineId, executionId } = params;
            const response = await projectService.getDetailLogAction(Number(id), Number(pipelineId), Number(executionId), actionId);

            if (response.status === 200 && response.data) {
                setActionExecution(response.data.data);
                setLogs(response.data.data.log || []);
                startPolling(actionId);
            } else {
                throw new Error('Failed to fetch action detail logs.');
            }
        } catch (err: any) {
            console.error(err.message || 'An error occurred while fetching the action detail logs.');
        }
    };

    const startPolling = (actionId: number) => {
        if (pollingInterval) clearInterval(pollingInterval);

        setIsPolling(true);

        const interval = setInterval(async () => {
            const { id, pipelineId, executionId } = params;

            try {
                const response = await projectService.getDetailLogAction(
                    Number(id),
                    Number(pipelineId),
                    Number(executionId),
                    actionId
                );

                if (response.status === 200 && response.data) {
                    const newLogs = response.data.data.log || [];
                    const actionStatus = response.data.data.status;

                    // Avoid duplicate logs
                    setLogs(newLogs);
                    console.log(`Action Status: ${actionStatus}`);
                    // Stop polling if status is "SUCCESS" or "FAIL"
                    if (actionStatus === 'SUCCESSFUL' || actionStatus === 'FAILED') {
                        stopPolling();
                        return
                    }
                } else {
                    throw new Error('Failed to fetch logs.');
                }
            } catch (err) {
                if (err instanceof Error) {
                    console.error(err.message || 'An error occurred while polling logs.');
                } else {
                    console.error('An error occurred while polling logs.');
                }
            }
        }, 5000); // Poll every 5 seconds

        setPollingInterval(interval);
    };

    const stopPolling = () => {

        if (pollingInterval) {
            clearInterval(pollingInterval);
            setPollingInterval(null);
        }
        setIsPolling(false);
        console.log('Polling stopped');
    };



    const handleLogModalClose = () => {
        stopPolling();
        setShowLogModal(false);
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
                    <Table bordered>
                        <tbody>
                            <tr>
                                <td><strong>Status:</strong></td>
                                <td>{execution.status}</td>
                            </tr>
                            <tr>
                                <td><strong>Triggered On:</strong></td>
                                <td>{execution.triggered_on}</td>
                            </tr>
                            <tr>
                                <td><strong>Branch:</strong></td>
                                <td>{execution.branch?.name} {execution.branch?.default ? '(default)' : ''}</td>
                            </tr>
                            <tr>
                                <td><strong>Start Date:</strong></td>
                                <td>{formatDate(execution.start_date)}</td>
                            </tr>
                            <tr>
                                <td><strong>Finish Date:</strong></td>
                                <td>{formatDate(execution.finish_date)}</td>
                            </tr>
                        </tbody>
                    </Table>
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
                            onClick={() => {
                                fetchDetailLogs(actionExecution.action.id);
                                setShowLogModal(true);
                            }}
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
                    </Card.Body>
                </Card>
            ))}

            {/* Log Modal */}
            <Modal show={showLogModal} onHide={handleLogModalClose} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Action Logs</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {logs.length === 0 ? (
                        <p>No logs available.</p>
                    ) : (
                        <pre>{logs.join('\n')}</pre>
                    )}
                    {isPolling && <Spinner animation="border" role="status" />}
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default ExecutionDetailPage;
