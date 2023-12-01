import "@testing-library/jest-dom/extend-expect";
import { server } from "./mocks/server";

const nextRouterMock = require("next-router-mock");

require("jest-fetch-mock").enableMocks();

jest.mock("next/router", () => nextRouterMock);

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

    return {
        useRouter,
        usePathname,
        useSearchParams,
    };
});

jest.mock("react-i18next", () => ({
    // this mock makes sure any components using the translate hook can use it without a warning being shown
    useTranslation: () => {
        return {
            t: str => str,
            i18n: {
                changeLanguage: () => new Promise(() => {}),
            },
        };
    },
    initReactI18next: {
        type: "3rdParty",
        init: () => {},
    },
}));

beforeAll(() => {
    server.listen();
});

afterAll(() => {
    server.close();
});

afterEach(() => {
    server.resetHandlers();
});
