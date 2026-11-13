import { rest } from "msw";
import apis from "@/config/apis";
import { NHS_SDE_FILTER } from "@/consts/cohortDiscovery";
import { fireEvent, render, screen, waitFor } from "@/utils/testUtils";
import { server } from "@/mocks/server";
import ViewCohortDatasetsButton from "./ViewCohortDatasetsButton";

type SearchBody = {
    filters: { dataset: { dataProviderColl: string[] } };
};

const mockSearch = (requestBodies: SearchBody[] = []) => {
    server.use(
        rest.post(apis.searchV2AggregationUrl, async (req, res, ctx) => {
            requestBodies.push(await req.json());

            return res(
                ctx.status(200),
                ctx.json({
                    message: "success",
                    data: {
                        query: "",
                        type: "datasets",
                        results: {
                            HDRUK: {
                                hits: [
                                    {
                                        _id: "1098",
                                        metadata: {
                                            summary: {
                                                title: "Cohort Discovery OMOP dataset",
                                                publisher: {
                                                    name: "Example Trust",
                                                },
                                                populationSize: 1000,
                                            },
                                        },
                                    },
                                ],
                                total: 1,
                                aggregations: [],
                                ids: ["1098"],
                            },
                        },
                    },
                })
            );
        })
    );
};

const loadedButton = async () => {
    const button = screen.getByRole("button");
    await waitFor(() => expect(button).toBeEnabled());
    return button;
};

describe("ViewCohortDatasetsButton", () => {
    it("can't be clicked until the datasets have loaded", async () => {
        mockSearch();

        render(<ViewCohortDatasetsButton />);

        expect(screen.getByRole("button")).toBeDisabled();
        await loadedButton();
    });

    it("lists the cohort discovery datasets from the search", async () => {
        mockSearch();

        render(<ViewCohortDatasetsButton />);
        fireEvent.click(await loadedButton());

        expect(
            await screen.findByText("Cohort Discovery OMOP dataset")
        ).toBeInTheDocument();
        expect(screen.getByText("Example Trust")).toBeInTheDocument();
    });

    it("limits the NHS SDE list to the NHS SDE network", async () => {
        const requestBodies: SearchBody[] = [];
        mockSearch(requestBodies);

        render(<ViewCohortDatasetsButton nhsSdeOnly />);
        fireEvent.click(await loadedButton());
        await screen.findByText("Cohort Discovery OMOP dataset");

        expect(
            requestBodies.map(body => body.filters.dataset.dataProviderColl)
        ).toEqual([[NHS_SDE_FILTER]]);
    });
});
