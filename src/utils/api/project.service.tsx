
import { CreateProjectRequest } from "@/app/dashboard/projects/new/props"

import { clientPrivateRequester } from "./base.api";

const getAllProjects = () => {
    return clientPrivateRequester.get("/auto-ci-service/v1/projects")
}

const createNewProjects = (requestData: CreateProjectRequest) => {
    return clientPrivateRequester.post("/auto-ci-service/v1/projects", requestData)
}

const fetchPipelineTemplate = (buildTool: string) => {
    return clientPrivateRequester.get(`/auto-ci-service/v1/projects/template/${buildTool}`);
};

const fetchListBranches = (projectId: number) => {
    return clientPrivateRequester.get(`/auto-ci-service/v1/projects/${projectId}/branches`)
}
const fetchListPipelines = (projectId: number) => {
    return clientPrivateRequester.get(`/auto-ci-service/v1/projects/${projectId}/pipelines`)
}
const fetchListExecutions = (projectId: number, pipelineId: number) => {
    return clientPrivateRequester.get(`/auto-ci-service/v1/projects/${projectId}/pipelines/${pipelineId}/executions`)
}

const fetchExecutionDetail = (projectId: number, pipelineId: number, executionId: number) => {
    return clientPrivateRequester.get(`/auto-ci-service/v1/projects/${projectId}/pipelines/${pipelineId}/executions/${executionId}`)
}
const runExecution = (projectId: number, pipelineId: number) => {
    return clientPrivateRequester.post(`/auto-ci-service/v1/projects/${projectId}/pipelines/${pipelineId}/executions`)
}
const createNewPipeline = (projectId: number, data: object) => {
    return clientPrivateRequester.post(`/auto-ci-service/v1/pipelines/${projectId}`, data)
}
const deletePipeline = (projectId: number, pipelineId: number) => {
    return clientPrivateRequester.delete(`auto-ci-service/v1/projects/${projectId}/pipelines/${pipelineId}`)
}
export default {
    getAllProjects, createNewProjects,
    fetchPipelineTemplate, fetchListBranches,
    fetchListPipelines, fetchListExecutions,
    fetchExecutionDetail, runExecution,
    createNewPipeline, deletePipeline
}