import "@testing-library/jest-dom/extend-expect";
import { render, screen, fireEvent } from "@testing-library/react";
import { Aggregations } from "@/interfaces/Search";
import FilterPanel from "./FilterPanel";

// Mock useTranslations hook
jest.mock("next-intl", () => ({
    useTranslations: jest.fn().mockReturnValue((key: string) => key),
}));

const mockSourceData = [
    {
        id: 2,
        keys: "containsTissue",
        enabled: true,
        type: "dataset",
        buckets: [],
    },
    {
        id: 3,
        keys: "publisherName",
        enabled: true,
        type: "collection",
        buckets: [],
    },
    {
        id: 4,
        keys: "datasetTitles",
        enabled: true,
        type: "paper",
        buckets: [],
    },
    {
        id: 5,
        keys: "accessType",
        enabled: true,
        type: "dataUseRegister",
        buckets: [],
    },
    {
        id: 2,
        keys: "datasetTitles",
        enabled: true,
        type: "dataProvider",
        buckets: [],
    },
    {
        id: 6,
        keys: "typeCategory",
        enabled: true,
        type: "tool",
        buckets: [],
    },
];

const defaultProps = {
    filterCategory: "dataset",
    selectedFilters: {
        containsTissue: ["containsTissue"],
    },
    filterSourceData: mockSourceData,
    setFilterQueryParams: jest.fn(),
    aggregations: {} as Aggregations,
    updateStaticFilter: jest.fn(),
    getParamString: jest.fn(),
    showEuropePmcModal: jest.fn(),
};

const testCases = [
    { category: "dataset", filter: "containsTissue" },
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
            "containsTissue"
        );
    });

    it("should correctly remove dataset filter for publications that have Europe PMC selected as source", () => {
        const publicationProps = {
            ...defaultProps,
            filterCategory: "paper",
        };

        render(<FilterPanel {...publicationProps} />);

        expect(
            screen.getByRole("button", { name: "datasetTitles" })
        ).toBeInTheDocument();

        const radioButton = screen.getByText("Search Online Publications");
        fireEvent.click(radioButton);

        expect(
            screen.queryByRole("button", { name: "datasetTitles" })
        ).not.toBeInTheDocument();
    });
});
