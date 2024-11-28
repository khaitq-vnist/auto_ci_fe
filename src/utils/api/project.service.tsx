
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

export default { getAllProjects, createNewProjects, fetchPipelineTemplate }