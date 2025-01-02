'use client';

import React, { useEffect, useState } from 'react';
import { Table, Spinner, Container, Alert, Button, Modal } from 'react-bootstrap';
import projectService from '@/utils/api/project.service';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import DashboardLayout from '@/layouts/dashboard.layout';

interface Pipeline {
    id: number;
    name: string;
    on: string;
    refs: string[];
    last_execution_status: string;
    last_execute_revision: string;
}

const PipelinePage: React.FC = () => {
    const [pipelines, setPipelines] = useState<Pipeline[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [pipelineToDelete, setPipelineToDelete] = useState<number | null>(null);
    const router = useRouter();
    const params = useParams();

    useEffect(() => {
        fetchPipelines();
    }, []);

    const fetchPipelines = async () => {
        try {
            setLoading(true);
            const { id } = params;
            const response = await projectService.fetchListPipelines(Number(id)); // Replace with actual API function

            if (response.status === 200 && response.data) {
                if (response.data.data.length > 0) {
                    setPipelines(response.data.data);
                } else {
                    router.push(`/dashboard/projects/${id}/pipeline/new/analytics`);
                    return
                }
            } else {
                throw new Error('Failed to fetch pipelines');
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred while fetching pipelines');
        } finally {
            setLoading(false);
        }
    };

    const runExecution = async (projectId: number, pipelineId: number) => {
        try {
            setLoading(true);
            const response = await projectService.runExecution(projectId, pipelineId); // Replace with actual API function

            if (response.status === 200 && response.data) {
                const executionId = response.data.data?.id ? response.data.data.id : 0;
                if (executionId > 0) {
                    router.push(`pipeline/${pipelineId}/executions/${executionId}`);
                }
            } else {
                throw new Error('Failed to start pipeline execution');
            }
        } catch (err: any) {
            toast.error(err.message || 'An error occurred while starting pipeline execution');
        } finally {
            setLoading(false);
        }
    };

    const handleRunPipeline = (pipelineId: number) => {
        const { id } = params;
        runExecution(Number(id), pipelineId);
    };

    const handleViewDetails = (pipelineId: number) => {
        router.push(`pipeline/${pipelineId}`);
    };

    const handleDeletePipeline = (pipelineId: number) => {
        setPipelineToDelete(pipelineId);
        setShowDeleteModal(true);
    };

    const confirmDeletePipeline = async () => {
        try {
            if (!pipelineToDelete) return;

            setLoading(true);
            const { id } = params;
            const response = await projectService.deletePipeline(Number(id), pipelineToDelete); // Replace with actual API function

            if (response.status === 200) {
                toast.success('Pipeline deleted successfully');
                setPipelines((prev) => prev.filter((pipeline) => pipeline.id !== pipelineToDelete));
            } else {
                throw new Error('Failed to delete pipeline');
            }
        } catch (err: any) {
            toast.error(err.message || 'An error occurred while deleting pipeline');
        } finally {
            setPipelineToDelete(null);
            setShowDeleteModal(false);
            setLoading(false);
        }
    };

    const handleAddNewPipeline = () => {
        router.push(`pipeline/pipeline_new`);
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

    return (
        <DashboardLayout>
            <Container>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h3>Pipeline List</h3>
                    <Button variant="primary" onClick={handleAddNewPipeline}>
                        Add New Pipeline
                    </Button>
                </div>
                <Table bordered hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Trigger</th>
                            <th>Refs</th>
                            <th>Last Execution Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pipelines.map((pipeline, index) => (
                            <tr key={pipeline.id}>
                                <td>{index + 1}</td>
                                <td>{pipeline.name}</td>
                                <td>{pipeline.on}</td>
                                <td>{pipeline.refs?.join(', ')}</td>
                                <td>{pipeline.last_execution_status}</td>
                                <td>
                                    <Button
                                        className="me-2"
                                        variant="success"
                                        size="sm"
                                        onClick={() => handleRunPipeline(pipeline.id)}
                                    >
                                        Run Now
                                    </Button>
                                    <Button
                                        className="me-2"
                                        variant="primary"
                                        size="sm"
                                        onClick={() => handleViewDetails(pipeline.id)}
                                    >
                                        View Details
                                    </Button>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => handleDeletePipeline(pipeline.id)}
                                    >
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>

                {/* Delete Confirmation Modal */}
                <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirm Delete</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Are you sure you want to delete this pipeline?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                            Cancel
                        </Button>
                        <Button variant="danger" onClick={confirmDeletePipeline}>
                            Delete
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        </DashboardLayout>
    );
};

export default PipelinePage;
