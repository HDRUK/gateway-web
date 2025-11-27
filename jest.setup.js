import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder } from "util";
import { server } from "./mocks/server";

const nextRouterMock = require("next-router-mock");

require("jest-fetch-mock").enableMocks();

jest.mock("next/router", () => nextRouterMock);

if (!global.TextEncoder) {
    // @ts-ignore
    global.TextEncoder = TextEncoder;
}
if (!global.TextDecoder) {
    // @ts-ignore
    global.TextDecoder = TextDecoder;
}

global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
}));

jest.mock("next/navigation", () => {
    const { useRouter } = nextRouterMock;
    const usePathname = () => {
        const router = useRouter();
        return router.pathname;
    };

    const useSearchParams = () => {
        const router = useRouter();
        return new URLSearchParams(router.query);
    };

    const useParams = () => {
        const router = useRouter();
        return router.query;
    };

    return {
        useRouter,
        usePathname,
        useSearchParams,
        useParams,
    };
});

beforeAll(() => {
    server.listen();
});

afterAll(() => {
    server.close();
});

afterEach(() => {
    server.resetHandlers();
});
