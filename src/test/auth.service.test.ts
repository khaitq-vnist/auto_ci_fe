import authService from "../utils/api/auth.service";
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { clientPublicRequester } from "../utils/api/base.api";
import { PrefixAuthPathV1 } from "../utils/api/constant/path";
import { AxiosHeaders, AxiosResponse, InternalAxiosRequestConfig } from "axios";

// Mock clientPublicRequester
jest.mock("../utils/api/base.api", () => ({
  clientPublicRequester: {
    post: jest.fn().mockImplementation(() => Promise.resolve({ data: { token: '' }, status: 200, statusText: '', headers: {}, config: {}, request: {} }))
  },
}));

describe("loginUser", () => {
  const mockEmail = "test@example.com";
  const mockPassword = "password123";
  const mockResponse: AxiosResponse<{ token: string }, any> = {
    data: { token: "test-token" },
    status: 200,
    statusText: "OK",
    headers: {},
    config: {} as InternalAxiosRequestConfig,
    request: {},
  };
  const loginPath = `${PrefixAuthPathV1}/login`;

  beforeEach(() => {
    (clientPublicRequester.post as jest.Mock).mockClear();
  });

  it("should call clientPublicRequester.post with correct path and request body", async () => {
    (clientPublicRequester.post as jest.MockedFunction<typeof clientPublicRequester.post>).mockResolvedValue(mockResponse);

    const result = await authService.loginUser(mockEmail, mockPassword);

    expect(clientPublicRequester.post).toHaveBeenCalledWith(loginPath, {
      email: mockEmail,
      password: mockPassword,
    });

    expect(result).toEqual(mockResponse);
  });

  it("should handle API errors correctly", async () => {
    const errorMessage = "Network Error";
    (clientPublicRequester.post as jest.MockedFunction<typeof clientPublicRequester.post>).mockRejectedValue(new Error(errorMessage));

    await expect(authService.loginUser(mockEmail, mockPassword)).rejects.toThrow(errorMessage);
  });
});