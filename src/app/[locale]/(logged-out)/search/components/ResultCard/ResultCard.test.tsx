import { formatDate } from "@/utils/date";
import { render, screen } from "@/utils/testUtils";
import { generateDatasetMetadataV1 } from "@/mocks/data/dataset";
import ResultCard from "./ResultCard";

describe("ResultCard", () => {
    const mockResult = generateDatasetMetadataV1();
    it("should render with all data", async () => {
        render(
            <ResultCard
                result={{
                    highlight: { abstract: "string", description: "string" },
                    metadata: mockResult,
                    _id: "1",
                }}
            />
        );

        const formattedDate = `Date range: ${formatDate(
            mockResult.metadata.provenance.temporal.startDate || "",
            "YYYY"
        )}-${formatDate(
            mockResult.metadata.provenance.temporal.endDate || "",
            "YYYY"
        )}`;

        expect(
            screen.getByText(mockResult.metadata.summary.abstract)
        ).toBeInTheDocument();
        expect(
            screen.getByText(
                mockResult.metadata.summary.publisher.publisherName
            )
        ).toBeInTheDocument();
        expect(
            screen.getByText(mockResult.metadata.summary.shortTitle)
        ).toBeInTheDocument();
        expect(
            screen.getByText(formattedDate, { exact: false })
        ).toBeInTheDocument();
    });
    it("should render n/a when no date", async () => {
        const mockResult = generateDatasetMetadataV1();
        const mockWithoutData = {
            metadata: {
                ...mockResult.metadata,
                provenance: {
                    temporal: {
                        endDate: undefined,
                        startDate: undefined,
                    },
                },
            },
        };
        render(
            <ResultCard
                result={{
                    highlight: { abstract: "string", description: "string" },
                    metadata: mockWithoutData,
                    _id: "1",
                }}
            />
        );
        expect(screen.getByText(`Date range: n/a`)).toBeInTheDocument();
    });
});
