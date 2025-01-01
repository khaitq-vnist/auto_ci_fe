import { clientPrivateRequester } from "./base.api";
import { PrefixRepositoryPathV1 } from "./constant/path";

const getAllRepositoriesByintegration_id = (inegrationId: number) => {
    return clientPrivateRequester.get(PrefixRepositoryPathV1 + "/integration/" + inegrationId)
}

export default { getAllRepositoriesByintegration_id }