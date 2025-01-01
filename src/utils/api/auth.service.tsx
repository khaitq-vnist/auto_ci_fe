import { clientPublicRequester } from "./base.api";
import { PrefixAuthPathV1 } from "./constant/path";

const loginUser = async (email: string, password: string) => {
    const requestBody = {
        email: email,
        password: password
    };

    return clientPublicRequester.post(PrefixAuthPathV1 + '/login', requestBody);
};

const registerUser = async (email: string, password: string, name: string) => {
    const requestBody = {
        email: email,
        password: password,
        name: name
    };
    return clientPublicRequester.post(PrefixAuthPathV1 + '/sign-up', requestBody);
};

export default { loginUser, registerUser };