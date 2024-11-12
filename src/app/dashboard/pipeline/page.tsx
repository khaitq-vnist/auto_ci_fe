'use client'
import ActionsTab from '@/components/dashboard/pipeline/actions/actions.tab';
import React, { useState } from 'react';
import { Tab, Tabs, Container } from 'react-bootstrap';


// Define the type for a stage
interface Stage {
    id: string;
    name: string;
}

const PipelineBuilder: React.FC = () => {
    const [key, setKey] = useState<string>('actions');
    const [stages, setStages] = useState<Stage[]>([]);

    // Handle tab switching
    const handleTabChange = (k: string | null) => {
        if (k) setKey(k);
    };

    return (
        <Container fluid style={{ padding: '20px', maxWidth: '1000px' }}>
            <h1>Create New Pipeline</h1>

            {/* Tabs for different sections */}
            <Tabs id="pipeline-tabs" activeKey={key} onSelect={handleTabChange} className="mb-3">
                <Tab eventKey="runs" title="Runs" />
                <Tab eventKey="actions" title="Actions">
                    <ActionsTab stages={stages} setStages={setStages} />
                </Tab>
                <Tab eventKey="filesystem" title="Filesystem" />
                <Tab eventKey="variables" title="Variables" />
                <Tab eventKey="analytics" title="Analytics" />
                <Tab eventKey="settings" title="Settings" />
                <Tab eventKey="yaml" title="YAML" />
            </Tabs>
        </Container>
    );
};

export default PipelineBuilder;