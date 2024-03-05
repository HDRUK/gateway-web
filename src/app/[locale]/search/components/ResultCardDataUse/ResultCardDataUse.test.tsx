import { render, screen } from "@/utils/testUtils";
import ResultCardDataUse from "./ResultCardDataUse";

describe("ResultCardDataUse", () => {
    const mockData = {
        highlight: { abstract: "string", description: "string" },
        team: { member_of: "teamA", name: "teamName" },
        projectTitle: "projectTitle",
        organisationName: "organisationName",
        publisher: "publisher",
        datasetTitles: ["datasetTitles"],
        _id: "1",
    };

    it("should render with all data", async () => {
        render(<ResultCardDataUse result={mockData} />);

        expect(screen.getByText(mockData.projectTitle)).toBeInTheDocument();
        expect(screen.getByText(mockData.organisationName)).toBeInTheDocument();
        expect(screen.getByText(mockData.datasetTitles[0])).toBeInTheDocument();
    });
});
