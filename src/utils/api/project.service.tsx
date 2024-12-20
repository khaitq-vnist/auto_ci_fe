
import { CreateProjectRequest } from "@/app/dashboard/projects/new/props"

import axiosInstance from "./instance.axios"

const getAllProjects = () => {
    return axiosInstance.get("/auto-ci-service/v1/projects")
}

const createNewProjects = (requestData: CreateProjectRequest) => {
    return axiosInstance.post("/auto-ci-service/v1/projects", requestData)
}

const fetchPipelineTemplate = (buildTool: string) => {
    return axiosInstance.get(`/auto-ci-service/v1/projects/template/${buildTool}`);
};

const fetchListBranches = (projectId: number) => {
    return axiosInstance.get(`/auto-ci-service/v1/projects/${projectId}/branches`)
}
const fetchListPipelines = (projectId: number) => {
    return axiosInstance.get(`/auto-ci-service/v1/projects/${projectId}/pipelines`)
}
const fetchListExecutions = (projectId: number, pipelineId: number) => {
    return axiosInstance.get(`/auto-ci-service/v1/projects/${projectId}/pipelines/${pipelineId}/executions`)
}

const fetchExecutionDetail = (projectId: number, pipelineId: number, executionId: number) => {
    return axiosInstance.get(`/auto-ci-service/v1/projects/${projectId}/pipelines/${pipelineId}/executions/${executionId}`)
}
const runExecution = (projectId: number, pipelineId: number) => {
    return axiosInstance.post(`/auto-ci-service/v1/projects/${projectId}/pipelines/${pipelineId}/executions`)
}
const createNewPipeline = (data: object) => {
    return axiosInstance.post(`/auto-ci-service/v1/pipelines`, data)
}
const deletePipeline = (projectId: number, pipelineId: number) => {
    return axiosInstance.delete(`auto-ci-service/v1/projects/${projectId}/pipelines/${pipelineId}`)
}
export default {
    getAllProjects, createNewProjects,
    fetchPipelineTemplate, fetchListBranches,
    fetchListPipelines, fetchListExecutions,
    fetchExecutionDetail, runExecution,
    createNewPipeline, deletePipeline
}