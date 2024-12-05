'use client';

import React, { useState } from 'react';
import { Container, Button } from 'react-bootstrap';
import Settings from './setting';
import PipelineStages from './pipeline_stage';
interface StageRequest {
    name: string;
    type: string;
    trigger_time: string;
    shell: string;
  }
  
  interface PipelineRequest {
    name: string;
    on: string;
    refs: string[];
    stages: StageRequest[];
  }
  
const PipelineNew: React.FC = () => {
    const [settings, setSettings] = useState({
        name: 'Build application',
        trigger: 'Manually',
        scope: 'Branch',
        branches: [],
    });
    const [pipeline, setPipeline] = useState<{ stages: StageRequest[] } | null>(null);

    const handleSaveSettings = (updatedSettings: any) => {
        setSettings(updatedSettings);
    };

    const handlePipelineChange = (updatedPipeline: any) => {
        setPipeline(updatedPipeline);
    };

    const handleSavePipeline = () => {
        console.log('Pipeline Settings:', settings);
        console.log('Pipeline Stages:', pipeline);
        const pipelineRequest: PipelineRequest = {
            name: settings.name,
            on: settings.trigger,
            refs: settings.branches,
            stages: pipeline?.stages?.map((stage: any) => ({
                name: stage.name,
                type: stage.type,
                trigger_time: stage.trigger_time,
                shell: stage.shell,
            })) || [],
        };
        console.log('Pipeline Request:', pipelineRequest);
    };

    return (
        <Container>
            {/* Settings Section */}
            <Settings settings={settings} onUpdateSettings={handleSaveSettings} />

            {/* Pipeline Stages Section */}
            <PipelineStages buildTool="maven" onPipelineChange={handlePipelineChange} />

            {/* Save Pipeline Button */}
            <Button variant="success" className="mt-4" onClick={handleSavePipeline}>
                Save Pipeline
            </Button>
        </Container>
    );
};

export default PipelineNew;
