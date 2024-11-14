'use client'
import ActionsTab from '@/components/dashboard/pipeline/actions/actions.tab';
import { YamlProvider } from '@/components/dashboard/pipeline/context/yaml.context';
import SettingsTab from '@/components/dashboard/pipeline/setting/tabs/setting.tab';
import YamlTab from '@/components/dashboard/pipeline/yaml/yaml.tab';
// PipelineBuilder.tsx

import React, { useState } from 'react';
import { Container, Tabs, Tab } from 'react-bootstrap';


const PipelineBuilder: React.FC = () => {
    const [key, setKey] = useState<string>('actions');

    // Handle tab switching
    const handleTabChange = (k: string | null) => {
        if (k) setKey(k);
    };

    return (
        <YamlProvider>
            <Container fluid style={{ padding: '20px', maxWidth: '1000px' }}>
                <h1>Create New Pipeline</h1>

                {/* Tabs for different sections */}
                <Tabs id="pipeline-tabs" activeKey={key} onSelect={handleTabChange} className="mb-3">
                    <Tab eventKey="runs" title="Runs" />
                    <Tab eventKey="actions" title="Actions">
                        <ActionsTab />
                    </Tab>
                    <Tab eventKey="filesystem" title="Filesystem" />
                    <Tab eventKey="variables" title="Variables" />
                    <Tab eventKey="analytics" title="Analytics" />
                    <Tab eventKey="settings" title="Settings" >
                        <SettingsTab />
                    </Tab>

                    <Tab eventKey="yaml" title="YAML" >
                        <YamlTab />
                    </Tab>
                </Tabs>
            </Container>
        </YamlProvider>
    );
};

export default PipelineBuilder;
