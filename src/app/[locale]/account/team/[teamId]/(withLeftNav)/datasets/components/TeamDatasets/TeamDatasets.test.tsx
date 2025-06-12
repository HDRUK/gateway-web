import mockRouter from "next-router-mock";
import { render, screen, waitFor } from "@/utils/testUtils";
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

        await waitFor(
            () => {
                const cards = screen.getAllByTestId("dataset-card");
                expect(cards).toHaveLength(3);

                const [card1, card2, card3] = cards;

                expect(card1).toHaveTextContent(
                    mockDatasets[0].latest_metadata.summary.title
                );
                expect(card1).toHaveTextContent(
                    mockDatasets[0].latest_metadata.summary.publisher
                        .publisherName
                );
                expect(card1).toHaveTextContent(
                    mockDatasets[0].latest_metadata.required.version
                );
                expect(card1).toHaveTextContent("Manually created dataset");

                expect(card2).toHaveTextContent("API created dataset");
                expect(card3).toHaveTextContent(
                    "Predefined Integration created dataset"
                );
            },
            { timeout: 300 }
        );
    });

    it("should render message if no active datasets", async () => {
        server.use(getTeamDatasetsV1([]));
        renderTeamDatasets();

        await waitFor(
            () => {
                expect(
                    screen.getByText(
                        "No active datasets found on the Gateway for your team."
                    )
                ).toBeInTheDocument();
            },
            { timeout: 300 }
        );
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

        await waitFor(
            () => {
                const cards = screen.getAllByTestId("dataset-card");
                expect(cards).toHaveLength(3);

                const [card1, card2, card3] = cards;

                expect(card1).toHaveTextContent(
                    mockDatasets[0].latest_metadata.summary.publisher
                        .publisherName
                );
                expect(card2).toHaveTextContent(
                    mockDatasets[1].latest_metadata.summary.publisher
                        .publisherName
                );
                expect(card3).toHaveTextContent(
                    mockDatasets[2].latest_metadata.summary.publisher.name
                );
            },
            { timeout: 300 }
        );
    });
});
