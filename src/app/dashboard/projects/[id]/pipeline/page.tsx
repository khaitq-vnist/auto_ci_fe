'use client';
import DashboardLayout from '@/layouts/dashboard.layout';
import React, { useEffect, useState } from 'react';
import { Container, ListGroup } from 'react-bootstrap';

interface Pipeline {
    id: number;
    name: string;
    status: string;
}

const PipelineTab = () => {
    const [pipelines, setPipelines] = useState<Pipeline[]>([]);

    // Mock data
    const mockPipelines: Pipeline[] = [
        { id: 1, name: 'Pipeline A', status: 'Success' },
        { id: 2, name: 'Pipeline B', status: 'Failed' },
        { id: 3, name: 'Pipeline C', status: 'Running' },
    ];

    useEffect(() => {
        // Simulate fetching data
        const fetchMockPipelines = async () => {
            // Simulate network delay
            await new Promise((resolve) => setTimeout(resolve, 500));
            setPipelines(mockPipelines);
        };

        fetchMockPipelines();
    }, []);

    const handlePipelineClick = (pipelineId: number) => {
        alert(`Clicked pipeline with ID: ${pipelineId}`);
        // You can navigate to a pipeline detail page or perform other actions
    };

    return (
       <DashboardLayout>
         <Container>
            <h1>Pipelines</h1>
            <ListGroup>
                {pipelines.map((pipeline) => (
                    <ListGroup.Item
                        key={pipeline.id}
                        onClick={() => handlePipelineClick(pipeline.id)}
                        style={{ cursor: 'pointer' }}
                    >
                        {pipeline.name} - Status: {pipeline.status}
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </Container>
       </DashboardLayout>
    );
};

export default PipelineTab;
