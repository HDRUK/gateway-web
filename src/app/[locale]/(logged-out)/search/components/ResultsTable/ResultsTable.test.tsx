import { render, screen } from "@/utils/testUtils";
import { datasetSearchResultV1 } from "@/mocks/data/dataset";
import ResultsTable from "./ResultsTable";

describe("ResultsTable", () => {
    it("should label the data custodian with the owning team, not the metadata publisher", async () => {
        const result = {
            ...datasetSearchResultV1,
            metadata: {
                ...datasetSearchResultV1.metadata,
                summary: {
                    ...datasetSearchResultV1.metadata.summary,
                    publisher: {
                        gatewayId: 42,
                        name: "Example Publisher Ltd",
                        publisherName: "Example Publisher Ltd",
                    },
                },
            },
            team: {
                ...datasetSearchResultV1.team,
                id: 42,
                name: "Example Custodian Ltd",
            },
        };

        render(
            <ResultsTable results={[result]} showLibraryModal={jest.fn()} />
        );

        expect(
            await screen.findByRole("link", { name: "Example Custodian Ltd" })
        ).toHaveAttribute("href", "/data-custodian/42");
        expect(
            screen.queryByText("Example Publisher Ltd")
        ).not.toBeInTheDocument();
    });
});
