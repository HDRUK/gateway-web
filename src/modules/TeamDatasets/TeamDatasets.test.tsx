import TeamDatasets from "@/modules/TeamDatasets";
import { render, screen, waitFor, within } from "@/utils/testUtils";
import { server } from "@/mocks/server";
import { getDatasetsV1 } from "@/mocks/handlers/datasets";
import { generateDatasetV1 } from "@/mocks/data/dataset";
import { DatasetSchema } from "@/interfaces/Dataset";

jest.mock("next/navigation", () => ({
    useSearchParams() {
        return {
            get: () => "active",
        };
    },
}));

describe("TeamDatasets", () => {
    it("should render active datasets", async () => {
        const mockDatasets = [
            generateDatasetV1({ create_origin: "FMA", status: "Active" }),
            generateDatasetV1({ create_origin: "MANUAL", status: "Archived" }),
            generateDatasetV1({ create_origin: "API", status: "Active" }),
            generateDatasetV1({ create_origin: "MANUAL", status: "Active" }),
            generateDatasetV1({ create_origin: "MANUAL", status: "Draft" }),
            generateDatasetV1({ create_origin: "FMA", status: "Draft" }),
        ];
        server.use(getDatasetsV1(mockDatasets));
        render(<TeamDatasets />);

        const mockDatasetSchema1 = JSON.parse(
            mockDatasets[0].dataset
        ) as DatasetSchema;

        await waitFor(() => {
            const datasetCards = screen.getAllByTestId("dataset-card");
            expect(datasetCards).toHaveLength(3);

            expect(
                within(datasetCards[0]).getByText(
                    `${mockDatasetSchema1.metadata.summary.title}`
                )
            ).toBeInTheDocument();
            expect(
                within(datasetCards[0]).getByText(
                    `${mockDatasetSchema1.metadata.summary.publisher.publisherName.toUpperCase()}`
                )
            ).toBeInTheDocument();
            expect(
                within(datasetCards[0]).getByText(`${mockDatasets[0].version}`)
            ).toBeInTheDocument();

            expect(
                within(datasetCards[0]).getByText(`FMA created dataset`)
            ).toBeInTheDocument();
            expect(
                within(datasetCards[1]).getByText(`API created dataset`)
            ).toBeInTheDocument();
            expect(
                within(datasetCards[2]).getByText(`Manually created dataset`)
            ).toBeInTheDocument();
        });
    });
    it("should render message if no active datasets", async () => {
        const mockDatasets = [
            generateDatasetV1({ create_origin: "MANUAL", status: "Archived" }),
            generateDatasetV1({ create_origin: "FMA", status: "Draft" }),
        ];
        server.use(getDatasetsV1(mockDatasets));
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
