import mockRouter from "next-router-mock";
import { render, screen, waitFor, within } from "@/utils/testUtils";
import { generateDatasetForTeamV1 } from "@/mocks/data/dataset";
import { getTeamDatasetsV1 } from "@/mocks/handlers/teams";
import { server } from "@/mocks/server";
import TeamDatasets from "./TeamDatasets";

mockRouter.query = { teamId: "1", tab: "ACTIVE" };
window.scrollTo = jest.fn();

const renderTeamDatasets = () =>
    render(<TeamDatasets permissions={{}} teamId="1" />);

describe("TeamDatasets", () => {
    it("should render all datasets (filtered on BE)", async () => {
        const mockDatasets = [
            generateDatasetForTeamV1("1.0", {
                create_origin: "MANUAL",
                status: "ARCHIVED",
            }),
            generateDatasetForTeamV1("1.1", {
                create_origin: "API",
                status: "ACTIVE",
            }),
            generateDatasetForTeamV1("1.0", {
                create_origin: "GMI",
                status: "DRAFT",
            }),
        ];
        server.use(getTeamDatasetsV1(mockDatasets));
        renderTeamDatasets();

        await waitFor(() => {
            const datasetCards = screen.getAllByTestId("dataset-card");
            expect(datasetCards).toHaveLength(3);

            expect(
                within(datasetCards[0]).getByText(
                    `${mockDatasets[0].latest_metadata.summary.title}`
                )
            ).toBeInTheDocument();
            expect(
                within(datasetCards[0]).getByText(
                    `${mockDatasets[0].latest_metadata.summary.publisher.publisherName}`
                )
            ).toBeInTheDocument();
            expect(
                within(datasetCards[0]).getByText(
                    `${mockDatasets[0].latest_metadata.required.version}`
                )
            ).toBeInTheDocument();

            expect(
                within(datasetCards[0]).getByText(`Manually created dataset`)
            ).toBeInTheDocument();
            expect(
                within(datasetCards[1]).getByText(`API created dataset`)
            ).toBeInTheDocument();
            expect(
                within(datasetCards[2]).getByText(
                    `Predefined Integration created dataset`
                )
            ).toBeInTheDocument();
        });
    });
    it("should render message if no active datasets", async () => {
        server.use(getTeamDatasetsV1([]));
        renderTeamDatasets();

        await waitFor(() => {
            expect(
                screen.getByText(
                    "No active datasets found on the Gateway for your team."
                )
            ).toBeInTheDocument();
        });
    });

    it("should render all datasets (with different GWDM versions)", async () => {
        const mockDatasets = [
            generateDatasetForTeamV1("1.0", {
                create_origin: "API",
                status: "ACTIVE",
            }),
            generateDatasetForTeamV1("1.0", {
                create_origin: "API",
                status: "ACTIVE",
            }),
            generateDatasetForTeamV1("1.1", {
                create_origin: "API",
                status: "ACTIVE",
            }),
        ];
        server.use(getTeamDatasetsV1(mockDatasets));
        renderTeamDatasets();

        await waitFor(() => {
            const datasetCards = screen.getAllByTestId("dataset-card");
            expect(datasetCards).toHaveLength(3);

            expect(
                within(datasetCards[0]).getByText(
                    `${mockDatasets[0].latest_metadata.summary.publisher.publisherName}`
                )
            ).toBeInTheDocument();

            expect(
                within(datasetCards[1]).getByText(
                    `${mockDatasets[1].latest_metadata.summary.publisher.publisherName}`
                )
            ).toBeInTheDocument();

            expect(
                within(datasetCards[2]).getByText(
                    `${mockDatasets[2].latest_metadata.summary.publisher.name}`
                )
            ).toBeInTheDocument();
        });
    });
});
