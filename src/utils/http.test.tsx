import AxiosMockAdapter from "axios-mock-adapter";
import axiosInstance from "./http";

const mock = new AxiosMockAdapter(axiosInstance);

describe("Http utils", () => {
    it("should add withCredentials to request config", async () => {
        const url = "/test-url";
        mock.onAny().reply(config => {
            expect(config.withCredentials).toBe(true);
            return [200, {}];
        });

        await axiosInstance.get(url);
    });
});
