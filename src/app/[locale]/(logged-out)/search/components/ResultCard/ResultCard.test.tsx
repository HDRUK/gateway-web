import { formatDate } from "@/utils/date";
import { render, screen } from "@/utils/testUtils";
import {
    generateDatasetHighlightsV1,
    generateDatasetMetadataMiniV1,
} from "@/mocks/data/dataset";
import ResultCard from "./ResultCard";

describe("ResultCard", () => {
    const defaultMockResult = generateDatasetMetadataMiniV1();
    const defaultMockHighlight = generateDatasetHighlightsV1();

    const renderResultCard = (
        mockResult = defaultMockResult,
        mockHighlight = defaultMockHighlight
    ) => {
        render(
            <ResultCard
                result={{
                    highlight: mockHighlight,
                    metadata: mockResult,
                    _id: "1",
                    team: {
                        id: 1,
                        member_of: "",
                        name: "",
                        is_question_bank: false,
                        is_dar: false,
                        dar_modal_header: null,
                        dar_modal_content: null,
                        dar_modal_footer: null,
                    },
                }}
                libraryData={[]}
                mutateLibraries={jest.fn()}
            />
        );
    };

    it("should render with all data", async () => {
        const populationSize = `Dataset population size: ${defaultMockResult.summary.populationSize?.toLocaleString()}`;
        const formattedDate = `Date range: ${formatDate(
            defaultMockResult.provenance.temporal.startDate || "",
            "YYYY"
        )}-${formatDate(
            defaultMockResult.provenance.temporal.endDate || "",
            "YYYY"
        )}`;

        renderResultCard(); // Reuse mockResult and mockHighlight here

        expect(
            screen.getByText(defaultMockHighlight.abstract![0])
        ).toBeInTheDocument();
        expect(
            screen.getByText(defaultMockResult.summary.publisher.publisherName)
        ).toBeInTheDocument();
        expect(
            screen.getByText(defaultMockResult.summary.shortTitle)
        ).toBeInTheDocument();
        expect(
            screen.getByText(populationSize, { exact: false })
        ).toBeInTheDocument();
        expect(
            screen.getByText(formattedDate, { exact: false })
        ).toBeInTheDocument();
    });

    it("should render n/a when no date", async () => {
        const mockResultWithoutDate = {
            ...defaultMockResult,
            provenance: {
                temporal: {
                    endDate: undefined,
                    startDate: undefined,
                },
            },
        };

        renderResultCard(mockResultWithoutDate);

        expect(screen.getByText(`Date range: n/a`)).toBeInTheDocument();
    });

    it("should render `not reported` when no population", async () => {
        const mockResultWithoutPopulation = {
            ...defaultMockResult,
            summary: {
                ...defaultMockResult.summary,
                populationSize: null,
            },
        };

        renderResultCard(mockResultWithoutPopulation);

        expect(
            screen.getByText(`Dataset population size: not reported`)
        ).toBeInTheDocument();
    });
});
