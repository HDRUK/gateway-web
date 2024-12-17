import mockRouter from "next-router-mock";
import { render, screen, waitFor, within } from "@/utils/testUtils";
import { generateDatasetV1 } from "@/mocks/data/dataset";
import { getDatasetsV1 } from "@/mocks/handlers/datasets";
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
            generateDatasetV1("1.0", {
                create_origin: "MANUAL",
                status: "ARCHIVED",
            }),
            generateDatasetV1("1.0", {
                create_origin: "API",
                status: "ACTIVE",
            }),
            generateDatasetV1("1.0", { create_origin: "GMI", status: "DRAFT" }),
        ];
        server.use(getTeamDatasetsV1(mockDatasets));
        renderTeamDatasets();

        await waitFor(() => {
            const datasetCards = screen.getAllByTestId("dataset-card");
            expect(datasetCards).toHaveLength(3);

            expect(
                within(datasetCards[0]).getByText(
                    `${mockDatasets[0].versions[0].metadata.metadata.summary.title}`
                )
            ).toBeInTheDocument();
            expect(
                within(datasetCards[0]).getByText(
                    `${mockDatasets[0].versions[0].metadata.metadata.summary.publisher.publisherName}`
                )
            ).toBeInTheDocument();
            expect(
                within(datasetCards[0]).getByText(
                    `${mockDatasets[0].versions[0].metadata.metadata.required.version}`
                )
            ).toBeInTheDocument();

            expect(
                within(datasetCards[0]).getByText(`Manually created dataset`)
            ).toBeInTheDocument();
            expect(
                within(datasetCards[1]).getByText(`API created dataset`)
            ).toBeInTheDocument();
            expect(
                within(datasetCards[2]).getByText(`Gateway App created dataset`)
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
            generateDatasetV1("1.0", {
                create_origin: "API",
                status: "ACTIVE",
            }),
            generateDatasetV1("1.0", {
                create_origin: "API",
                status: "ACTIVE",
            }),
            generateDatasetV1("1.1", {
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
                    `${mockDatasets[0].versions[0].metadata.metadata.summary.publisher.publisherName}`
                )
            ).toBeInTheDocument();

            expect(
                within(datasetCards[1]).getByText(
                    `${mockDatasets[1].versions[0].metadata.metadata.summary.publisher.publisherName}`
                )
            ).toBeInTheDocument();

            expect(
                within(datasetCards[2]).getByText(
                    `${mockDatasets[2].versions[0].metadata.metadata.summary.publisher.name}`
                )
            ).toBeInTheDocument();
        });
    });
});
