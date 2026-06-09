import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@/utils/testUtils";
import { Aggregations } from "@/interfaces/Search";
import { Filter } from "@/interfaces/Filter"; // used to cast mockSourceData
import FilterPanel from "./FilterPanel";

jest.mock("@/providers/FeatureProvider", () => ({
    useFeatures: jest.fn().mockReturnValue({ isExternalSourcesEnabled: false }),
}));

jest.mock("next-intl", () => ({
    useTranslations: jest.fn().mockReturnValue((key: string) => key),
    NextIntlClientProvider: ({ children }: { children: React.ReactNode }) =>
        children,
}));

const mockSourceData = [
    {
        id: 2,
        keys: "containsBioSamples",
        enabled: true,
        type: "dataset",
        value: "",
        buckets: [],
    },
    {
        id: 3,
        keys: "publisherName",
        enabled: true,
        type: "collection",
        value: "",
        buckets: [],
    },
    {
        id: 4,
        keys: "datasetTitles",
        enabled: true,
        type: "paper",
        value: "",
        buckets: [],
    },
    {
        id: 5,
        keys: "accessType",
        enabled: true,
        type: "dataUseRegister",
        value: "",
        buckets: [],
    },
    {
        id: 2,
        keys: "datasetTitles",
        enabled: true,
        type: "dataProvider",
        value: "",
        buckets: [],
    },
    {
        id: 6,
        keys: "typeCategory",
        enabled: true,
        type: "tool",
        value: "",
        buckets: [],
    },
] as Filter[];

const defaultProps = {
    filterCategory: "dataset",
    selectedFilters: {
        containsBioSamples: ["containsBioSamples"],
    },
    filterSourceData: mockSourceData,
    setFilterQueryParams: jest.fn(),
    aggregations: {} as Aggregations,
    updateStaticFilter: jest.fn(),
    getParamString: jest.fn(),
    showEuropePmcModal: jest.fn(),
    resetQueryParamState: jest.fn(),
    schemadefs: {},
};

const testCases = [
    { category: "dataset", filter: "containsBioSamples" },
    { category: "collection", filter: "publisherName" },
    { category: "paper", filter: "source" },
    { category: "tool", filter: "typeCategory" },
    { category: "dataProvider", filter: "datasetTitles" },
];

describe("FilterPanel", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it.each(testCases)(
        "should render different filters based on category",
        ({ category, filter }) => {
            const newProps = {
                ...defaultProps,
                filterCategory: category,
            };
            render(<FilterPanel {...newProps} />);
            expect(screen.getByText(filter)).toBeInTheDocument();
        }
    );

    it("should call setFilterQueryParams when a filter is updated", () => {
        render(<FilterPanel {...defaultProps} />);

        const checkbox = screen.getByRole("checkbox");
        fireEvent.click(checkbox);

        expect(defaultProps.setFilterQueryParams).toHaveBeenCalledWith(
            [],
            "containsBioSamples"
        );
    });

    it("should correctly remove dataset filter for publications that have Europe PMC selected as source", () => {
        const publicationProps = {
            ...defaultProps,
            filterCategory: "paper",
        };

        render(<FilterPanel {...publicationProps} />);

        expect(
            screen.getByRole("button", {
                name: "datasetTitles",
            })
        ).toBeInTheDocument();

        const radioButton = screen.getByText("Search Online Publications");
        fireEvent.click(radioButton);

        expect(
            screen.queryByRole("button", { name: "datasetTitles" })
        ).not.toBeInTheDocument();
    });

    it("reflects dataSource prop change by checking the ARDC radio", () => {
        const { useFeatures } = require("@/providers/FeatureProvider");
        useFeatures.mockReturnValue({ isExternalSourcesEnabled: true });

        const { rerender } = render(
            <FilterPanel
                {...defaultProps}
                filterCategory="dataset"
                dataSource="HDRUK"
            />
        );

        rerender(
            <FilterPanel
                {...defaultProps}
                filterCategory="dataset"
                dataSource="ARDC"
            />
        );

        const radios = screen.getAllByRole("radio");
        const ardcRadio = radios.find(r => r.getAttribute("value") === "ARDC");
        expect(ardcRadio).toBeChecked();
    });

    it("hides all dataset filters except the data source toggle when ARDC is selected", () => {
        const { useFeatures } = require("@/providers/FeatureProvider");
        useFeatures.mockReturnValue({ isExternalSourcesEnabled: true });

        render(
            <FilterPanel
                {...defaultProps}
                filterCategory="dataset"
                dataSource="HDRUK"
            />
        );

        fireEvent.click(screen.getByDisplayValue("ARDC"));

        // Only the dataSource accordion should remain
        const accordions = screen.queryAllByRole("button", {
            name: /containsBioSamples|publisherName|dataType/i,
        });
        expect(accordions).toHaveLength(0);
    });

    it("calls resetQueryParamState when clear all filters is clicked", () => {
        render(
            <FilterPanel
                {...defaultProps}
                selectedFilters={{ publisherName: ["NHS Digital"] }}
            />
        );

        fireEvent.click(screen.getByText("clearAll"));

        expect(defaultProps.resetQueryParamState).toHaveBeenCalled();
    });
});
