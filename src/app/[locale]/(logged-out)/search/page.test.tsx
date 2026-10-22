import { ReactElement } from "react";
import SearchPage from "./page";

jest.mock("./components/Search", () => ({
    __esModule: true,
    default: () => null,
}));

jest.mock("./components/SearchLoader", () => ({
    __esModule: true,
    default: () => null,
}));

jest.mock("@/utils/api", () => ({
    getFilters: jest.fn().mockResolvedValue([
        {
            id: 1,
            keys: "dataSubType",
            type: "dataset",
            buckets: [{ key: "Not applicable" }, { key: "Cohort" }],
        },
    ]),
    getSchemaFromTraser: jest.fn().mockResolvedValue({ schema: { $defs: {} } }),
}));

jest.mock("next/headers", () => ({
    cookies: jest.fn().mockResolvedValue({
        get: (name: string) =>
            name === "view-type" ? { value: "list" } : undefined,
    }),
}));

type Element = ReactElement<Record<string, unknown>>;

const renderPage = async () => {
    const page = (await SearchPage({
        searchParams: Promise.resolve({ type: "datasets" }),
    })) as Element;

    return {
        fallback: page.props.fallback as Element,
        loader: page.props.children as Element,
    };
};

describe("SearchPage", () => {
    it("shows the pending search while the results load", async () => {
        const { fallback } = await renderPage();

        expect(fallback.props).toMatchObject({
            isPending: true,
            initialView: "list",
            schema: { $defs: {} },
        });
    });

    it("passes the filters without the not applicable data sub type", async () => {
        const { fallback, loader } = await renderPage();

        const expected = [
            expect.objectContaining({ buckets: [{ key: "Cohort" }] }),
        ];
        expect(fallback.props.filters).toEqual(expected);
        expect(loader.props.filters).toEqual(expected);
    });
});
