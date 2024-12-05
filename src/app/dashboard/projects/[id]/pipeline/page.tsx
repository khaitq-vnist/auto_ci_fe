'use client';

import React, { useEffect, useState } from 'react';
import { Table, Spinner, Container, Alert, Button, ButtonGroup } from 'react-bootstrap';
import projectService from '@/utils/api/project.service';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

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
    const router = useRouter();
    const params = useParams();

    useEffect(() => {
        const fetchPipelines = async () => {
            try {
                setLoading(true);
                const { id } = params
                const response = await projectService.fetchListPipelines(Number(id)); // Replace with actual API function

                if (response.status === 200 && response.data) {
                    setPipelines(response.data.data);
                } else {
                    throw new Error('Failed to fetch pipelines');
                }
            } catch (err: any) {
                setError(err.message || 'An error occurred while fetching pipelines');
            } finally {
                setLoading(false);
            }
        };

        fetchPipelines();
    }, []);
    const runExecution = async (projectId: number, pipelineId : number) => {
        try {
            setLoading(true);
            const response = await projectService.runExecution(projectId, pipelineId); // Replace with actual API function

            if (response.status === 200 && response.data) {
                // Handle successful
                const executionId = response.data.data?.id ? response.data.data.id : 0;
                if (executionId > 0) {
                    router.push(`pipeline/${pipelineId}/executions/${executionId}`);
                }
            } else {
                throw new Error('Failed to start pipeline execution');
            }
        } catch (err: any) {
            toast.error(err.message || 'An error occurred while starting pipeline execution');
        } 
    }
    const handleRunPipeline = (pipelineId: number) => {
       const {id} = params;
         runExecution(Number(id), pipelineId);
    };

    const handleViewDetails = (pipelineId: number) => {
        console.log(`View Details clicked for Pipeline ID: ${pipelineId}`);
        // Navigate to details page or open a modal with pipeline details
        router.push(`pipeline/${pipelineId}`)
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
        <Container>
            <h3 className="mb-4">Pipeline List</h3>
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
                            <td>{pipeline.refs.join(', ')}</td>
                            <td>{pipeline.last_execution_status}</td>
                            <td >
                                {/* <ButtonGroup> */}
                                <Button
                                    className='me-2'
                                    variant="success"
                                    size="sm"
                                    onClick={() => handleRunPipeline(pipeline.id)}
                                >
                                    Run Now
                                </Button>
                                <Button

                                    variant="primary"
                                    size="sm"
                                    onClick={() => handleViewDetails(pipeline.id)}
                                >
                                    View Details
                                </Button>
                                {/* </ButtonGroup> */}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
};

export default PipelinePage;
