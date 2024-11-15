import { PrefixRepositoryPathV1 } from "./constant/path";
import axiosInstance from "./instance.axios";

const getAllRepositoriesByIntegrationId = (inegrationId : number) => {
    return axiosInstance.get(PrefixRepositoryPathV1+"/integration/"+inegrationId)
}

export default { getAllRepositoriesByIntegrationId }