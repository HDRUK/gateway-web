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

    it("marks a result that came from another partner context", async () => {
        render(
            <ResultsTable
                results={[
                    {
                        ...datasetSearchResultV1,
                        partner_context: "CRUK",
                        partner_name: "Cancer Research UK",
                    },
                ]}
                showLibraryModal={jest.fn()}
            />
        );

        await screen.findByRole("link", {
            name: datasetSearchResultV1.team.name,
        });
        expect(screen.getByText("Cancer Research UK")).toBeInTheDocument();
    });

    /**
     * The API omits partner_name for this deployment's own context, so its
     * absence - not a comparison the client has to make - is what keeps the
     * line off every one of our own results.
     */
    it("shows no provenance line for our own results", async () => {
        render(
            <ResultsTable
                results={[datasetSearchResultV1]}
                showLibraryModal={jest.fn()}
            />
        );

        await screen.findByRole("link", {
            name: datasetSearchResultV1.team.name,
        });
        expect(screen.queryByText(/^via/)).not.toBeInTheDocument();
    });
});
