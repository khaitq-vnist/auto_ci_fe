import exp from "constants"
import { clientPublicRequester } from "./base.api"
import { PrefixServicePathV1 } from "./constant/path"

const fetchAllServices = () => {
    return clientPublicRequester.get(PrefixServicePathV1)
}
export default { fetchAllServices }