import { BaseApi } from "./instance.axios";

export const clientPrivateRequester = BaseApi.getInstance({
    baseUrl: "http://localhost:8080",
    private: true,
}).requestInstance;

export const clientPublicRequester = BaseApi.getInstance({
    baseUrl: "http://localhost:8080",
    private: false,
}).requestInstance;
