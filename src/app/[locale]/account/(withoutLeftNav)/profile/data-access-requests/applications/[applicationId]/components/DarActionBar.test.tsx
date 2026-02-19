import { render, screen, waitFor, within } from "@/utils/testUtils";
import { DarActionBar } from "./DarActionBar";
import useGet from "@/hooks/useGet";

const defaultProps = {
    applicationId: "123",
    saveDraftOnClick: jest.fn(),
    submitOnClick: jest.fn(),
    manageApplicationOnStatus: jest.fn(),
    isResearcher: true,
};

const mockData = {
    project_title: "My Research Project",
    submission_status: "DRAFT",
    updated_at: "2024-01-15T00:00:00Z",
    primary_applicant: {
        name: "Jane Doe",
        organisation: "University of Dundee",
    },
    datasets: [
        { dataset_id: "1", dataset_title: "Dataset Alpha" },
        { dataset_id: "2", dataset_title: "Dataset Beta" },
    ],
    teams: [{ team_id: 1, approval_status: "APPROVED" }],
};

jest.mock("@/hooks/useGet", () => ({
    __esModule: true,
    default: jest.fn(),
}));

const mockUseGet = useGet as jest.Mock;

describe("DarActionBar", () => {
    beforeEach(() => {
        mockUseGet.mockReturnValue({ data: mockData });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("renders the project title", () => {
        render(<DarActionBar {...defaultProps} />);
        expect(screen.getByText("My Research Project")).toBeInTheDocument();
    });

    it("renders the primary investigator name", () => {
        render(<DarActionBar {...defaultProps} />);
        expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    });

    it("renders the organisation", () => {
        render(<DarActionBar {...defaultProps} />);
        expect(screen.getByText("University of Dundee")).toBeInTheDocument();
    });

    it("renders dataset chips", () => {
        render(<DarActionBar {...defaultProps} />);
        expect(screen.getByText("Dataset Alpha")).toBeInTheDocument();
        expect(screen.getByText("Dataset Beta")).toBeInTheDocument();
    });
})