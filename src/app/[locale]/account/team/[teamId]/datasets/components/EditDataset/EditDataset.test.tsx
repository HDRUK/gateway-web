import mockRouter from "next-router-mock";
import { render, screen, waitFor } from "@/utils/testUtils";
import { datasetV1 } from "@/mocks/data/dataset";
import EditDataset from "./EditDataset";

mockRouter.query = { teamId: "1", datasetId: `${datasetV1.id}` };

describe("EditDataset", () => {
    const [
        {
            metadata: {
                metadata: { summary },
            },
        },
    ] = datasetV1.versions;

    it("should render dataset without title populated", async () => {
        render(<EditDataset isDuplicate />);

        await waitFor(() => {
            expect(
                screen.queryByDisplayValue(summary.title as string)
            ).not.toBeInTheDocument();
            expect(
                screen.queryByDisplayValue(
                    summary.publisher.publisherName as string
                )
            ).toBeInTheDocument();
        });
    });
});
