import { createGatewayFlagAdapter } from "./gatewayFlagAdapter";

jest.mock("@/config/apis", () => ({
    __esModule: true,
    default: {
        enabledFeatures: "http://localhost/mock-api",
    },
}));

describe("createGatewayFlagAdapter", () => {
    const mockResponse = {
        SDEConciergeServiceEnquiry: { enabled: true },
        Aliases: { enabled: false },
    };

    let adapter: ReturnType<ReturnType<typeof createGatewayFlagAdapter>>;

    beforeEach(() => {
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: async () => mockResponse,
        }) as jest.Mock;

        jest.useFakeTimers();
        adapter = createGatewayFlagAdapter()();
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.useRealTimers();
    });

    it("refetches after TTL expiry", async () => {
        await adapter.decide({ key: "SDEConciergeServiceEnquiry" });

        jest.advanceTimersByTime(5 * 60 * 1000 + 1);

        await adapter.decide({ key: "Aliases" });

        expect(fetch).toHaveBeenCalledTimes(2);
    });

    it("fetches and caches feature flags", async () => {
        const result = await adapter.decide({
            key: "SDEConciergeServiceEnquiry",
        });
        expect(result).toBe(true);

        const result2 = await adapter.decide({ key: "Aliases" });
        expect(result2).toBe(false);

        expect(fetch).toHaveBeenCalledTimes(0); // cached
    });

    it("handles API failure gracefully", async () => {
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            statusText: "Service Unavailable",
        });

        const result = await adapter.decide({ key: "NonExistent" });
        expect(result).toBe(undefined);
    });

    it("handles network error gracefully", async () => {
        (fetch as jest.Mock).mockRejectedValueOnce(new Error("Network Error"));

        const result = await adapter.decide({ key: "NonExistent" });
        expect(result).toBe(undefined);
    });
});
