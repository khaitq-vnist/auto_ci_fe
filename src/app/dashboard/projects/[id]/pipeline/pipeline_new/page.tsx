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
    variables?: VariableRequest[];
    services?: ServiceRequest[];
}
interface VariableRequest {
    key: string;
    value: string;
}
interface ServiceRequest {
    type: string;
    version: string;
    connection?: ConnectionServiceRequest;
}
interface ConnectionServiceRequest {
    host: string;
    port: number;
    user: string;
    db?: string;
    password: string;
}
interface EventRequest {
    type: string;
    refs: string[];
}
interface PipelineRequest {
    name: string;
    on: string;
    refs?: string[] | null;
    events?: EventRequest[];
    stages: StageRequest[];
}

const PipelineNew: React.FC = () => {

    const [settings, setSettings] = useState({
        name: 'Build application',
        trigger: 'Manually',
        scope: 'Branch',
        branches: [],
        events: [],
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
        let events: any[] = []
        if (settings.events.length != 0) {
            events = settings.events.map((event: any) => ({
                type: event,
                refs: settings.branches?.map((branch: string) => `refs/heads/${branch}`) || []
            }))
        }
        const pipelineRequest: PipelineRequest = {
            name: settings.name,
            on: settings.trigger === "Manually" ? "CLICK" : settings.trigger,
            refs: settings.trigger === "Manually" ? settings.branches?.map((branch: string) => `refs/heads/${branch}`) : null,
            events: events,
            stages: (pipeline?.stages || [])
                .filter((stage: any) => String(stage.type) == 'enabled')
                .map((stage: any) => ({
                    name: stage.name,
                    type: "BUILD",
                    trigger_time: "ON_EVERY_EXECUTION",
                    shell: "BASH",
                    execute_commands: stage.commands?.map((commands: any) => commands.command) || [],
                    docker_image_name: stage.docker_image,
                    docker_image_tag: stage.docker_image_tag,
                    variables: stage.variables?.map((variable: any) => ({
                        key: variable.key,
                        value: variable.value,
                    })) || [],
                    services: stage.services?.map((service: any) => ({
                        type: service.type,
                        version: service.version,
                        connection: service.connection
                            ? {
                                host: service.connection.host,
                                port: service.connection.port,
                                user: service.connection.user,
                                password: service.connection.password,
                                db: service.connection.db ? service.connection.db : null,
                            }
                            : null,
                    })) || [],
                }))
        };

        console.log('Pipeline Request:', pipelineRequest);
        const sendRequestCreatePipeline = async (data: object) => {
            try {
                const { id } = params
                const response = await projectService.createNewPipeline(Number(id), data)
                if (response.status == 200 && response.data) {

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
