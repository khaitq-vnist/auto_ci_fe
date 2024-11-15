
import { CreateProjectRequest } from "@/app/dashboard/projects/new/props"
import { PrefixProjectPathV1 } from "./constant/path"
import axiosInstance from "./instance.axios"

const getAllProjects = () => {
    return axiosInstance.get("/auto-ci-service/v1/projects")
}

const createNewProjects = (requestData: CreateProjectRequest) => {
    return axiosInstance.post("/auto-ci-service/v1/projects", requestData)
}

export default { getAllProjects, createNewProjects }