import { clientPrivateRequester } from "./base.api"

const getDashboardData = () => {
    return clientPrivateRequester.get("/auto-ci-service/v1/dashboard")
}
export default {
    getDashboardData
}