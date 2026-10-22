import { SearchCategory } from "@/interfaces/Search";
import { fireEvent, screen, waitFor } from "@/utils/testUtils";
import { RecordedRequest } from "@/mocks/handlers/search";
import {
    mockSearch,
    mockSearchV1,
    renderSearch,
    resetSearchTestState,
    urlParams,
} from "./testUtils";

jest.mock("@/providers/FeatureProvider", () => ({
    useFeatures: jest.fn(),
}));

jest.mock("@/hooks/useCohortStatus", () => ({
    useCohortStatus: () => ({ requestStatus: null, hasAccess: false }),
}));

jest.mock("@/modules/PublicationSearchDialog", () => ({
    __esModule: true,
    default: ({
        onSubmit,
    }: {
        onSubmit: (
            query: string | string[],
            type: string,
            datasetNames: string[]
        ) => void;
    }) => (
        <div data-testid="publication-search-dialog">
            <button
                type="button"
                onClick={() => onSubmit("asthma", "text", [])}>
                submit text
            </button>
            <button
                type="button"
                onClick={() =>
                    onSubmit(["Dataset A", "Dataset B"], "dataset", [
                        "Dataset A",
                        "Dataset B",
                    ])
                }>
                submit datasets
            </button>
        </div>
    ),
}));

const settle = () => new Promise(resolve => setTimeout(resolve, 50));

const lastRequest = (requests: RecordedRequest[]) =>
    requests[requests.length - 1];

describe("Search publications", () => {
    beforeEach(() => {
        resetSearchTestState();
    });

    it("opens the europe pmc dialog when online publications are selected", async () => {
        const requests = mockSearch(SearchCategory.PUBLICATIONS);
        renderSearch("/search?type=publications&query=asthma");
        await waitFor(() => expect(requests).toHaveLength(1));

        fireEvent.click(
            screen.getByRole("radio", { name: "Search Online Publications" })
        );

        expect(
            await screen.findByTestId("publication-search-dialog")
        ).toBeInTheDocument();
        expect(urlParams()).toEqual({ type: "publications", source: "FED" });
    });

    it("searches europe pmc by text", async () => {
        const requests = mockSearchV1(SearchCategory.PUBLICATIONS);
        renderSearch("/search?type=publications&source=FED&page=3");

        fireEvent.click(screen.getByRole("textbox", { name: "Search" }));
        fireEvent.click(
            await screen.findByRole("button", { name: "submit text" })
        );

        await waitFor(() =>
            expect(lastRequest(requests).body).toEqual({ query: "asthma" })
        );
        expect(lastRequest(requests).searchParams).toMatchObject({
            source: "FED",
            page: "1",
        });
        expect(urlParams()).toEqual({
            type: "publications",
            pmc: "text",
            query: "asthma",
            source: "FED",
        });
    });

    it("shows no results or no results message for europe pmc without a query", async () => {
        mockSearchV1(SearchCategory.PUBLICATIONS);

        renderSearch("/search?type=publications&source=FED");

        await settle();
        expect(screen.queryByText("Publication 1")).not.toBeInTheDocument();
        expect(document.getElementById("result-summary")).toBeNull();
        expect(
            document.querySelector(".MuiSkeleton-root, [role='progressbar']")
        ).toBeNull();
    });

    it("searches europe pmc by dataset names kept in the url", async () => {
        const requests = mockSearchV1(SearchCategory.PUBLICATIONS);
        renderSearch("/search?type=publications&source=FED");

        fireEvent.click(screen.getByRole("textbox", { name: "Search" }));
        fireEvent.click(
            await screen.findByRole("button", { name: "submit datasets" })
        );

        await waitFor(() =>
            expect(lastRequest(requests).body).toEqual({
                query: ["Dataset A", "Dataset B"],
            })
        );
        expect(urlParams()).toMatchObject({
            pmc: "dataset",
            query: "Dataset A|Dataset B",
        });
        await waitFor(() =>
            expect(screen.getByRole("textbox", { name: "Search" })).toHaveValue(
                "Dataset A,Dataset B"
            )
        );
    });

    it("restores a europe pmc dataset search from the url", async () => {
        const requests = mockSearchV1(SearchCategory.PUBLICATIONS);

        renderSearch(
            "/search?type=publications&source=FED&pmc=dataset&query=Dataset A|Dataset B"
        );

        await waitFor(() => expect(requests).toHaveLength(1));
        expect(requests[0].body).toEqual({
            query: ["Dataset A", "Dataset B"],
        });
    });
});
