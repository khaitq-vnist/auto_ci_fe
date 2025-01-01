import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";

interface BaseApiConfig {
    refreshToken?: string;
    private: boolean;
    baseUrl?: string;
    callback?: any;
    generateAccessToken?: any;
}

import { Mutex } from "async-mutex";
import { getItemFromLocalStorage } from "../helper";

const clientLock = new Mutex();

export class BaseApi {
    requestInstance: AxiosInstance;
    newAccessToken = "";
    config: BaseApiConfig;
    private: boolean;
    generateAccessToken?: any;
    skipRetryRefreshToken = false;

    private static classInstance?: BaseApi;

    constructor(config: BaseApiConfig) {
        this.config = config;
        this.private = config.private;

        this.requestInstance = axios.create({
            baseURL: config.baseUrl,
            timeout: 60 * 1000, // 60 seconds,
        });
        this.enableRequestInterceptors(config);
        this.enableInterceptors();
    }

    private enableRequestInterceptors(baseConfig: BaseApiConfig) {
        this.requestInstance.interceptors.request.use(
            async function (config: any) {
                const accessToken = getItemFromLocalStorage("access_token");
                if (accessToken && baseConfig.private) {
                    config.headers.Authorization = `Bearer ${accessToken}`;
                    config.headers["Content-Type"] = "application/json";
                }


                return config;
            },
            function (error) {
                return Promise.reject(error);
            }
        );
    }

    private enableInterceptors() {
        this.requestInstance.interceptors.response.use(
            this.getSuccessResponseHandler(),
            this.getErrorResponseHandler()
        );
    }

    private getSuccessResponseHandler() {
        return (resp: AxiosResponse) => resp;
    }

    private getErrorResponseHandler() {
        return async (errorResponse: AxiosError) => {
            if (errorResponse.response?.status === 401) {
                // execute locking process
                const release = await clientLock.acquire();

                // skip retry calling request refreshToken if last request failed and access_token expired

                if (
                    this.skipRetryRefreshToken &&
                    this.isJwtExpired(this.newAccessToken)
                ) {
                    release();
                    return Promise.reject(errorResponse);
                }

                // unlock(release) the process if calling api refresh token request successfully or failed
                try {
                    if (!this.skipRetryRefreshToken) {
                        const { access_token } = await this.generateAccessTokenAxios();
                        if (access_token) {
                            this.newAccessToken = access_token;
                        }
                    }

                    release();
                } catch (e) {
                    release();
                    console.error(e);
                    return Promise.reject(errorResponse);
                }
                const errResponse = { ...errorResponse.config };
                if (errResponse.headers?.Authorization) {
                    errResponse.headers.Authorization = `Bearer ${this.newAccessToken}`;
                }
                return this.requestInstance.request(errResponse);
            }
            return Promise.reject(errorResponse.response);
        };
    }

    private isJwtExpired(token: string) {
        if (!token) return true;

        const decode = JSON.parse(window.atob(token.split(".")[1]));
        return decode.exp * 1000 < new Date().getTime();
    }

    public logout() {
        this.skipRetryRefreshToken = false;
    }

    private generateAccessTokenAxios() {
        return (
            this.config.generateAccessToken &&
            this.config
                .generateAccessToken()
                .finally(() => (this.skipRetryRefreshToken = true))
        );
    }

    static getInstance(config: BaseApiConfig) {
        BaseApi.classInstance = new BaseApi(config)
        return BaseApi.classInstance;
    }
}

export default BaseApi.getInstance;