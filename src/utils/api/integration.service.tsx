import { CreateIntegrationRequest } from "@/app/dashboard/integration/list.props";
import { PrefixIntegrationPathV1 } from "./constant/path";
import axiosInstance from "./instance.axios";

const getAllIntegrations = () => {
    return axiosInstance.get(PrefixIntegrationPathV1)
}
const createIntegration = (integrationData: CreateIntegrationRequest) => {
    return axiosInstance.post(PrefixIntegrationPathV1, integrationData, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
};
export default { getAllIntegrations, createIntegration }