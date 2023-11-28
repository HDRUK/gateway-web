import TeamDatasets from "@/modules/TeamDatasets";
import { render, screen, waitFor, within } from "@/utils/testUtils";
import { server } from "@/mocks/server";
import { getDatasetsV1 } from "@/mocks/handlers/datasets";
import { generateDatasetV1, generateMauroItemV1 } from "@/mocks/data/dataset";
import mockRouter from "next-router-mock";

mockRouter.query = { teamId: "1", tab: "ACTIVE" };

describe("TeamDatasets", () => {
    it("should render all datasets (filtered on BE)", async () => {
        const mauroItems = [
            generateMauroItemV1({
                value: "title",
                key: "properties/summary/title",
            }),
            generateMauroItemV1({
                value: "publisherName",
                key: "properties/summary/publisher/publisherName",
            }),
        ];

        const mockDatasets = [
            generateDatasetV1({
                create_origin: "MANUAL",
                status: "ARCHIVED",
                mauro: mauroItems,
            }),
            generateDatasetV1({ create_origin: "API", status: "ACTIVE" }),
            generateDatasetV1({ create_origin: "FMA", status: "DRAFT" }),
        ];
        server.use(getDatasetsV1(mockDatasets));
        render(<TeamDatasets />);

        await waitFor(() => {
            const datasetCards = screen.getAllByTestId("dataset-card");
            expect(datasetCards).toHaveLength(3);

            expect(
                within(datasetCards[0]).getByText(`${mauroItems[0].value}`)
            ).toBeInTheDocument();
            expect(
                within(datasetCards[0]).getByText(`${mauroItems[1].value}`)
            ).toBeInTheDocument();
            expect(
                within(datasetCards[0]).getByText(`${mockDatasets[0].version}`)
            ).toBeInTheDocument();

            expect(
                within(datasetCards[0]).getByText(`Manually created dataset`)
            ).toBeInTheDocument();
            expect(
                within(datasetCards[1]).getByText(`API created dataset`)
            ).toBeInTheDocument();
            expect(
                within(datasetCards[2]).getByText(`FMA created dataset`)
            ).toBeInTheDocument();
        });
    });
    it("should render message if no active datasets", async () => {
        server.use(getDatasetsV1([]));
        render(<TeamDatasets />);

        await waitFor(() => {
            expect(
                screen.getByText(
                    "No active datasets found on the Gateway for your team."
                )
            ).toBeInTheDocument();
        });
    });
});
