'use client';

import React, { useState } from 'react';
import { Container, Button } from 'react-bootstrap';
import Settings from './setting';
import PipelineStages from './pipeline_stage';
import projectService from '@/utils/api/project.service';
import { toast } from 'react-toastify';
import { useParams, useRouter } from 'next/navigation';

interface StageRequest {
    name: string;
    type: string;
    trigger_time: string;
    shell: string;
    execute_commands: string[];
    docker_image_name: string;
    docker_image_tag: string
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
    const router = useRouter()
    const params = useParams()
    const handleSavePipeline = () => {
        console.log('Pipeline Settings:', settings);
        console.log('Pipeline Stages:', pipeline);
        const pipelineRequest: PipelineRequest = {
            name: settings.name,
            on: settings.trigger === "Manually" ? "CLICK" : settings.trigger,
            refs: settings.branches?.map((branch: string) => `refs/heads/${branch}`),
            stages: pipeline?.stages
                ?.filter((stage: any) => String(stage.type) == 'enabled')
                .map((stage: any) => ({
                    name: stage.name,
                    type: "BUILD",
                    trigger_time: "ON_EVERY_EXECUTION",
                    shell: "BASH",
                    execute_commands: stage.commands?.map((commands: any) => commands.command) || [],
                    docker_image_name: stage.docker_image,
                    docker_image_tag: stage.docker_image_tag,
                })) || [],
        };

        console.log('Pipeline Request:', pipelineRequest);
        const sendRequestCreatePipeline = async (data: object) => {
            try {
                const response = await projectService.createNewPipeline(data)
                if (response.status == 200 && response.data) {
                    const { id } = params
                    router.push(`/dashboard/projects/${id}/pipeline`)
                } else {
                    throw Error("Send request create pipeline fails")
                }
            } catch (e) {
                toast.error("Send request create pipeline fails")
            }
        }
        sendRequestCreatePipeline(pipelineRequest)
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
