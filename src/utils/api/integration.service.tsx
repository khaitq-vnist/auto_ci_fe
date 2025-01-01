import { CreateIntegrationRequest } from "@/app/dashboard/integration/list.props";
import { PrefixIntegrationPathV1 } from "./constant/path";
import { clientPrivateRequester } from "./base.api";


const getAllIntegrations = () => {
    return clientPrivateRequester.get(PrefixIntegrationPathV1)
}
const createIntegration = (integrationData: CreateIntegrationRequest) => {
    return clientPrivateRequester.post(PrefixIntegrationPathV1, integrationData, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
};
export default { getAllIntegrations, createIntegration }