import { ComponentProps, ReactNode } from "react";
import Cookies from "js-cookie";
import mockRouter from "next-router-mock";
import { MemoryRouterProvider } from "next-router-mock/MemoryRouterProvider";
import { Filter } from "@/interfaces/Filter";
import { SearchAggregationData, SearchCategory } from "@/interfaces/Search";
import { Schema } from "@/interfaces/V4Schema";
import config from "@/config/config";
import { configure, render } from "@/utils/testUtils";
import {
    generateSearchV1Response,
    generateSearchV2Response,
    typesenseSearchFlags,
} from "@/mocks/data/search";
import {
    postSearchV1,
    postSearchV2Aggregation,
    RecordedRequest,
} from "@/mocks/handlers/search";
import { server } from "@/mocks/server";
import Search from "./Search";

configure({ asyncUtilTimeout: 3000 });

export const searchFilters = [
    {
        id: 1,
        keys: "containsBioSamples",
        enabled: true,
        type: "dataset",
        value: "",
        buckets: [],
    },
] as unknown as Filter[];

export const searchSchema = { $defs: {} } as unknown as Schema;

export const renderSearch = (
    url = "/search",
    siblings?: ReactNode,
    props?: Partial<ComponentProps<typeof Search>>
) => {
    mockRouter.setCurrentUrl(url);

    return render(
        <MemoryRouterProvider>
            {siblings}
            <Search filters={searchFilters} schema={searchSchema} {...props} />
        </MemoryRouterProvider>
    );
};

export const urlParams = (): Record<string, string> =>
    Object.fromEntries(
        Object.entries(mockRouter.query).map(([key, value]) => [
            key,
            Array.isArray(value) ? value.join(",") : `${value}`,
        ])
    );

export const mockSearch = (
    type: SearchCategory,
    response:
        | SearchAggregationData
        | ((
              request: RecordedRequest
          ) => SearchAggregationData) = generateSearchV2Response(type)
) => {
    const requests: RecordedRequest[] = [];
    server.use(postSearchV2Aggregation(response, requests, type));
    return requests;
};

export const mockSearchV1 = (
    type: SearchCategory,
    response = generateSearchV1Response(type)
) => {
    const requests: RecordedRequest[] = [];
    server.use(postSearchV1(type, response, requests));
    return requests;
};

const matchesWidth = (query: string, width: number) => {
    const min = /min-width:\s*([\d.]+)px/.exec(query);
    const max = /max-width:\s*([\d.]+)px/.exec(query);
    return (
        (!min || width >= Number(min[1])) && (!max || width <= Number(max[1]))
    );
};

export const setScreenWidth = (width: number) => {
    Object.defineProperty(window, "matchMedia", {
        writable: true,
        configurable: true,
        value: (query: string) => ({
            matches: matchesWidth(query, width),
            media: query,
            onchange: null,
            addListener: () => {},
            removeListener: () => {},
            addEventListener: () => {},
            removeEventListener: () => {},
            dispatchEvent: () => false,
        }),
    });
};

export const forwardHistoryToRouter = () =>
    jest
        .spyOn(window.history, "pushState")
        .mockImplementation((_data, _unused, url) => {
            if (url) {
                mockRouter.push(`${url}`);
            }
        });

export const resetSearchTestState = () => {
    jest.requireMock("@/providers/FeatureProvider").useFeatures.mockReturnValue(
        typesenseSearchFlags
    );
    server.use(
        postSearchV2Aggregation(({ body }) =>
            generateSearchV2Response(
                body.type as SearchCategory,
                {},
                { hits: [] }
            )
        )
    );
    window.dataLayer = [];
    window.scrollTo = jest.fn();
    Object.defineProperty(window, "matchMedia", {
        writable: true,
        configurable: true,
        value: undefined,
    });
    Cookies.remove(config.VIEW_TYPE);
    Cookies.remove(config.POST_LOGIN_ACTION_COOKIE, { path: "/" });
    forwardHistoryToRouter().mockClear();
};

export const gtmEvents = (event: string) =>
    (window.dataLayer as { event: string }[]).filter(
        entry => entry.event === event
    );
