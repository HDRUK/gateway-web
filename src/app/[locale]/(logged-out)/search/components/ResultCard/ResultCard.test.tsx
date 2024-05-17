import { formatDate } from "@/utils/date";
import { render, screen } from "@/utils/testUtils";
import {
    generateDatasetHighlightsV1,
    generateDatasetMetadataMiniV1,
} from "@/mocks/data/dataset";
import ResultCard from "./ResultCard";

describe("ResultCard", () => {
    const mockResult = generateDatasetMetadataMiniV1();
    const mockHighlight = generateDatasetHighlightsV1();
    it("should render with all data", async () => {
        render(
            <ResultCard
                result={{
                    highlight: mockHighlight,
                    metadata: mockResult,
                    _id: "1",
                }}
            />
        );

        const populationSize = `Dataset population size: ${mockResult.summary.populationSize?.toLocaleString()}`;
        const formattedDate = `Date range: ${formatDate(
            mockResult.provenance.temporal.startDate || "",
            "YYYY"
        )}-${formatDate(mockResult.provenance.temporal.endDate || "", "YYYY")}`;

        expect(screen.getByText(mockHighlight.abstract[0])).toBeInTheDocument();
        expect(
            screen.getByText(mockResult.summary.publisher.publisherName)
        ).toBeInTheDocument();
        expect(
            screen.getByText(mockResult.summary.shortTitle)
        ).toBeInTheDocument();
        expect(
            screen.getByText(populationSize, { exact: false })
        ).toBeInTheDocument();
        expect(
            screen.getByText(formattedDate, { exact: false })
        ).toBeInTheDocument();
    });
    it("should render n/a when no date", async () => {
        const mockResult = generateDatasetMetadataMiniV1();
        const mockWithoutData = {
            ...mockResult,
            provenance: {
                temporal: {
                    endDate: undefined,
                    startDate: undefined,
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
    it("should render `not reported` when no population", async () => {
        const mockResult = generateDatasetMetadataMiniV1();
        const mockWithoutData = {
            ...mockResult,
            summary: {
                ...mockResult.summary,
                populationSize: null,
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
        expect(
            screen.getByText(`Dataset population size: not reported`)
        ).toBeInTheDocument();
    });
});
